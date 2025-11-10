import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding Auth Service...');

  // Hash password for all test users
  const password = await bcrypt.hash('Test1234!', 10);

  // 1. Customer (Propietario de vehículo)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@autodiag.com' },
    update: {},
    create: {
      email: 'customer@autodiag.com',
      password,
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+52 961 123 4567',
      role: UserRole.CUSTOMER,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Customer created:', customer.email);

  // 2. Workshop Admin (Dueño de taller)
  const workshopAdmin = await prisma.user.upsert({
    where: { email: 'taller@autodiag.com' },
    update: {},
    create: {
      email: 'taller@autodiag.com',
      password,
      firstName: 'Carlos',
      lastName: 'Hernández',
      phone: '+52 961 234 5678',
      role: UserRole.WORKSHOP_ADMIN,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Workshop Admin created:', workshopAdmin.email);

  // 3. Mechanic (Mecánico)
  const mechanic = await prisma.user.upsert({
    where: { email: 'mecanico@autodiag.com' },
    update: {},
    create: {
      email: 'mecanico@autodiag.com',
      password,
      firstName: 'José',
      lastName: 'López',
      phone: '+52 961 345 6789',
      role: UserRole.MECHANIC,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Mechanic created:', mechanic.email);

  // 4. Admin (Super admin)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autodiag.com' },
    update: {},
    create: {
      email: 'admin@autodiag.com',
      password,
      firstName: 'María',
      lastName: 'González',
      phone: '+52 961 456 7890',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Admin created:', admin.email);

  // 5. Additional customers for testing
  const customer2 = await prisma.user.upsert({
    where: { email: 'ana.martinez@gmail.com' },
    update: {},
    create: {
      email: 'ana.martinez@gmail.com',
      password,
      firstName: 'Ana',
      lastName: 'Martínez',
      phone: '+52 961 567 8901',
      role: UserRole.CUSTOMER,
      isVerified: true,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Customer 2 created:', customer2.email);

  console.log('\n🎉 Auth Service seeded successfully!');
  console.log('\n📋 Test credentials:');
  console.log('   Email: customer@autodiag.com | Password: Test1234!');
  console.log('   Email: taller@autodiag.com   | Password: Test1234!');
  console.log('   Email: mecanico@autodiag.com | Password: Test1234!');
  console.log('   Email: admin@autodiag.com    | Password: Test1234!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });