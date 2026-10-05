import { PrismaClient } from "@prisma/client";
import { getTestDatabaseUrl } from "./testDatabase.js";

const prisma = new PrismaClient({ datasourceUrl: getTestDatabaseUrl() });

try {
  await prisma.$transaction([
    prisma.activityLog.deleteMany(),
    prisma.expenseShare.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.settlement.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.groupMember.deleteMany(),
    prisma.group.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("Test database reset complete.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
