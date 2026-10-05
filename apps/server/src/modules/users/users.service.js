import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../lib/errors.js";

/**
 * Updates current user profile
 */
export async function updateProfile(userId, { name, avatarUrl }) {
  const data = {};
  if (name !== undefined) data.name = name.trim();
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  }).catch(() => {
    throw new NotFoundError("User not found");
  });

  return user;
}
