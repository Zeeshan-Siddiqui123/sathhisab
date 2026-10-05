import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "../src/config/env.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);
  await prisma.$transaction(async (prisma) => {
  if (await prisma.user.count()) {
    throw new Error("Seed requires an empty database. Existing data was preserved.");
  }

  // 1. Create 3 users
  const zeeshan = await prisma.user.create({
    data: {
      name: "Zeeshan",
      email: "zeeshan@example.com",
      passwordHash,
    },
  });

  const ali = await prisma.user.create({
    data: {
      name: "Ali",
      email: "ali@example.com",
      passwordHash,
    },
  });

  const ahmed = await prisma.user.create({
    data: {
      name: "Ahmed",
      email: "ahmed@example.com",
      passwordHash,
    },
  });

  console.log("Created users:", zeeshan.name, ali.name, ahmed.name);

  // 2. Create Flat group
  const group = await prisma.group.create({
    data: {
      name: "Gulshan Flat 402",
      type: "FLAT",
      currency: "PKR",
      createdBy: zeeshan.id,
      members: {
        create: [
          { userId: zeeshan.id, role: "OWNER" },
          { userId: ali.id, role: "MEMBER" },
          { userId: ahmed.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("Created group:", group.name);

  // 3. Grocery Rs 6,000 (600,000 paisa) paid by Zeeshan, split equal among 3 (200,000 paisa each)
  const expense1 = await prisma.expense.create({
    data: {
      groupId: group.id,
      title: "Monthly Grocery",
      amount: 600000n, // Rs 6,000
      paidBy: zeeshan.id,
      category: "GROCERY",
      splitMethod: "EQUAL",
      expenseDate: new Date(),
      createdBy: zeeshan.id,
      shares: {
        create: [
          { userId: zeeshan.id, shareAmount: 200000n },
          { userId: ali.id, shareAmount: 200000n },
          { userId: ahmed.id, shareAmount: 200000n },
        ],
      },
    },
  });

  // 4. Internet Rs 3,000 (300,000 paisa) paid by Ali, split equal among 3 (100,000 paisa each)
  const expense2 = await prisma.expense.create({
    data: {
      groupId: group.id,
      title: "StormFiber Internet Bill",
      amount: 300000n, // Rs 3,000
      paidBy: ali.id,
      category: "INTERNET",
      splitMethod: "EQUAL",
      expenseDate: new Date(),
      createdBy: ali.id,
      shares: {
        create: [
          { userId: zeeshan.id, shareAmount: 100000n },
          { userId: ali.id, shareAmount: 100000n },
          { userId: ahmed.id, shareAmount: 100000n },
        ],
      },
    },
  });

  console.log("Created expenses:", expense1.title, expense2.title);
  });
  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
