import { prisma } from "../../lib/prisma.js";

/**
 * Fetches activity logs for a group with pagination.
 */
export async function getActivity(groupId, query) {
  const { page = 1, limit = 30, action } = query || {};
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    groupId,
    ...(action && { action }),
  };

  const [total, logs] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      include: {
        actor: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
  ]);

  return {
    data: logs.map((log) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      meta: log.meta,
      actor: log.actor,
      createdAt: log.createdAt,
    })),
    meta: { total, page: Number(page), limit: Number(limit) },
  };
}
