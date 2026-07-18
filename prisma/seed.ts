import { db } from "@/lib/db";

async function main() {
  try {
    await db.category.deleteMany();
    await db.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Filming" },
      ],
    });

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

main();
