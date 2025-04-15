import { PrismaClient, UserRole, TicketStatus, TicketPriority, ExperienceLevel, ComplaintStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create teams
  const supportTeam = await prisma.team.upsert({
    where: { name: 'Support Team' },
    update: {},
    create: {
      name: 'Support Team',
      description: 'General support team for customer issues',
    },
  });

  const devTeam = await prisma.team.upsert({
    where: { name: 'Development Team' },
    update: {},
    create: {
      name: 'Development Team',
      description: 'Technical team for resolving bugs and implementing features',
    },
  });

  console.log('Teams created...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tixgenius.com' },
    update: {},
    create: {
      email: 'admin@tixgenius.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  // Create Manager
  const managerPassword = await bcrypt.hash('Manager@123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@tixgenius.com' },
    update: {},
    create: {
      email: 'manager@tixgenius.com',
      password: managerPassword,
      firstName: 'Team',
      lastName: 'Manager',
      role: UserRole.MANAGER,
      teamId: supportTeam.id,
    },
  });

  // Create Agent
  const agentPassword = await bcrypt.hash('Agent@123', 10);
  const agent = await prisma.user.upsert({
    where: { email: 'agent@tixgenius.com' },
    update: {},
    create: {
      email: 'agent@tixgenius.com',
      password: agentPassword,
      firstName: 'Support',
      lastName: 'Agent',
      role: UserRole.AGENT,
      teamId: supportTeam.id,
    },
  });

  // Create Developer User
  const developerPassword = await bcrypt.hash('Developer@123', 10);
  const developerUser = await prisma.user.upsert({
    where: { email: 'developer@tixgenius.com' },
    update: {},
    create: {
      email: 'developer@tixgenius.com',
      password: developerPassword,
      firstName: 'Lead',
      lastName: 'Developer',
      role: UserRole.DEVELOPER,
      teamId: devTeam.id,
    },
  });

  // Create Developer profile
  const developer = await prisma.developer.upsert({
    where: { userId: developerUser.id },
    update: {},
    create: {
      userId: developerUser.id,
      specialization: ['Backend', 'Database'],
      experienceLevel: ExperienceLevel.SENIOR,
      gitHubUsername: 'leaddev',
    },
  });

  // Create Regular User
  const userPassword = await bcrypt.hash('User@123', 10);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
    },
  });

  console.log('Users created...');

  // Create Categories
  const bugCategory = await prisma.category.upsert({
    where: { name: 'Bug Report' },
    update: {},
    create: {
      name: 'Bug Report',
      description: 'Issues with existing functionality',
      teamId: devTeam.id,
    },
  });

  const featureCategory = await prisma.category.upsert({
    where: { name: 'Feature Request' },
    update: {},
    create: {
      name: 'Feature Request',
      description: 'Requests for new functionality',
      teamId: devTeam.id,
    },
  });

  const accountCategory = await prisma.category.upsert({
    where: { name: 'Account Issues' },
    update: {},
    create: {
      name: 'Account Issues',
      description: 'Problems with user accounts',
      teamId: supportTeam.id,
    },
  });

  console.log('Categories created...');

  // Create Sample Tickets
  const ticket1 = await prisma.ticket.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Cannot login to the system',
      description: 'I\'m trying to login but keep getting an "Invalid credentials" error.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      creatorId: regularUser.id,
      categoryId: accountCategory.id,
    },
  });

  const ticket2 = await prisma.ticket.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Dashboard shows incorrect data',
      description: 'The dashboard is showing stale data from yesterday.',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.MEDIUM,
      creatorId: regularUser.id,
      categoryId: bugCategory.id,
    },
  });

  const ticket3 = await prisma.ticket.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Add export to CSV feature',
      description: 'It would be helpful to export data to CSV format.',
      status: TicketStatus.OPEN,
      priority: TicketPriority.LOW,
      creatorId: regularUser.id,
      categoryId: featureCategory.id,
    },
  });

  console.log('Tickets created...');

  // Create Assignments
  const assignment1 = await prisma.assignment.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      ticketId: ticket1.id,
      assigneeId: agent.id,
      assignedAt: new Date(),
    },
  });

  const assignment2 = await prisma.assignment.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      ticketId: ticket2.id,
      assigneeId: developerUser.id,
      developerId: developer.id,
      assignedAt: new Date(),
    },
  });

  console.log('Assignments created...');

  // Create Complaint
  const complaint = await prisma.complaint.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      userId: regularUser.id,
      ticketId: ticket1.id,
      title: 'Long response time',
      description: 'It\'s been over 24 hours with no response on my ticket.',
      status: ComplaintStatus.SUBMITTED,
    },
  });

  console.log('Complaints created...');

  // Create Audit Log entries
  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'TICKET',
      entityId: ticket1.id,
      createdById: regularUser.id,
      ticketId: ticket1.id,
      newValues: {
        title: ticket1.title,
        description: ticket1.description,
        status: ticket1.status,
        priority: ticket1.priority,
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'ASSIGN',
      entityType: 'TICKET',
      entityId: ticket1.id,
      createdById: manager.id,
      targetUserId: agent.id,
      ticketId: ticket1.id,
      newValues: {
        assigneeId: agent.id,
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'UPDATE',
      entityType: 'TICKET',
      entityId: ticket2.id,
      createdById: developerUser.id,
      ticketId: ticket2.id,
      oldValues: {
        status: 'OPEN',
      },
      newValues: {
        status: 'IN_PROGRESS',
      },
    },
  });

  console.log('Audit logs created...');

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 