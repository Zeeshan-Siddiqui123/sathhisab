import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../../lib/errors.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates an invite token for a group
 */
export async function createInvitation(groupId, createdBy, expiresInDays = 7) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const invitation = await prisma.invitation.create({
    data: {
      groupId,
      createdBy,
      tokenHash,
      expiresAt,
    },
    select: {
      id: true,
      groupId: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    ...invitation,
    token: rawToken,
  };
}

/**
 * Lists active invitations for a group (owner only)
 */
export async function getGroupInvitations(groupId) {
  return await prisma.invitation.findMany({
    where: {
      groupId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      expiresAt: true,
      createdAt: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Revokes an existing invitation
 */
export async function revokeInvitation(groupId, invitationId) {
  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, groupId },
  });

  if (!invitation) {
    throw new NotFoundError("Invitation not found");
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { revokedAt: new Date() },
  });

  return { success: true };
}

/**
 * Previews an invitation (public endpoint)
 */
export async function previewInvitation(token) {
  const tokenHash = hashToken(token);

  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash },
    include: {
      group: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!invitation || invitation.revokedAt || new Date(invitation.expiresAt) < new Date()) {
    throw new NotFoundError("Invitation link is invalid, expired, or has been revoked");
  }

  return {
    group: invitation.group,
    inviter: invitation.creator,
    expiresAt: invitation.expiresAt,
  };
}

/**
 * Accepts an invitation and joins the group (requires auth)
 */
export async function acceptInvitation(token, userId) {
  const tokenHash = hashToken(token);

  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash },
    include: {
      group: true,
    },
  });

  if (!invitation || invitation.revokedAt || new Date(invitation.expiresAt) < new Date()) {
    throw new NotFoundError("Invitation link is invalid, expired, or has been revoked");
  }

  const groupId = invitation.groupId;

  // Check existing membership
  const existingMember = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId,
      },
    },
  });

  if (existingMember && existingMember.leftAt === null) {
    return {
      group: invitation.group,
      alreadyMember: true,
    };
  }

  return await prisma.$transaction(async (tx) => {
    let membership;

    if (existingMember) {
      membership = await tx.groupMember.update({
        where: { id: existingMember.id },
        data: {
          leftAt: null,
          role: "MEMBER",
          joinedAt: new Date(),
        },
      });
    } else {
      membership = await tx.groupMember.create({
        data: {
          groupId,
          userId,
          role: "MEMBER",
        },
      });
    }

    await tx.activityLog.create({
      data: {
        groupId,
        actorId: userId,
        action: "MEMBER_JOINED",
        entityType: "MEMBER",
        entityId: userId,
      },
    });

    return {
      group: invitation.group,
      membership,
      alreadyMember: false,
    };
  });
}
