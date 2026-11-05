/**
 * prisma/seed.ts
 * Seed script for drug monographs, verified clinics, and partner pharmacies.
 */

async function main() {
  console.log('Seeding initial clinical drug monographs and partner facilities...');
  // Note: Seed logic executes strictly against configured database upon manual trigger
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

