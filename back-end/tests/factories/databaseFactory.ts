import { prisma } from "../../src/database";
import { recommendations } from "./recommendationFactory";

export async function resetDB() {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
}

export async function populateDB() {
  for (let i = 0; i < 3; i++) {
    const { name, youtubeLink } = recommendations[i];
    await prisma.$executeRaw`INSERT INTO "recommendations" ("name", "youtubeLink")
        VALUES (${name}, ${youtubeLink})`;
  }
}
