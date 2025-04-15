# Database Schema

TixGenius uses PostgreSQL as its primary database, with a schema designed to support ticket management, user roles, and audit logging. This document details the database schema and relationships.

## Schema Overview

The database schema is defined using Prisma ORM and includes the following main entities:

## Core Models

### User
```prisma
model User {
  id                String         @id @default(uuid())
  email             String         @unique
  password          String
  firstName         String
  lastName          String
  role              UserRole       @default(USER)
  isActive          Boolean        @default(true)
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  phone             String?
  avatar            String?
  lastLogin         DateTime?
  teamId            String?
  team              Team?          @relation(fields: [teamId], references: [id])
  createdTickets    Ticket[]       @relation("TicketCreator")
  assignedTickets   Assignment[]
  complaints        Complaint[]
  createdAuditLogs  AuditLog[]     @relation("AuditLogCreator")
  targetAuditLogs   AuditLog[]     @relation("AuditLogTarget")
  developerProfile  Developer?
}
```

### Team
```prisma
model Team {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  users       User[]
  categories  Category[]
}
```

### Developer
```prisma
model Developer {
  id              String         @id @default(uuid())
  userId          String         @unique
  user            User           @relation(fields: [userId], references: [id])
  specialization  String[]
  experienceLevel ExperienceLevel
  gitHubUsername  String?
  slackId         String?
  availableFrom   DateTime?
  availableTo     DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  assignments     Assignment[]
}
```

### Category
```prisma
model Category {
  id            String   @id @default(uuid())
  name          String   @unique
  description   String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  teamId        String?
  team          Team?    @relation(fields: [teamId], references: [id])
  tickets       Ticket[]
  parentId      String?
  parent        Category? @relation("SubCategories", fields: [parentId], references: [id])
  subCategories Category[] @relation("SubCategories")
}
```

### Ticket
```prisma
model Ticket {
  id              String         @id @default(uuid())
  title           String
  description     String
  status          TicketStatus   @default(OPEN)
  priority        TicketPriority @default(MEDIUM)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  dueDate         DateTime?
  resolvedAt      DateTime?
  creatorId       String
  creator         User           @relation("TicketCreator", fields: [creatorId], references: [id])
  categoryId      String
  category        Category       @relation(fields: [categoryId], references: [id])
  assignments     Assignment[]
  complaints      Complaint[]
  attachments     String[]
  auditLogs       AuditLog[]
}
```

### Assignment
```prisma
model Assignment {
  id            String    @id @default(uuid())
  ticketId      String
  ticket        Ticket    @relation(fields: [ticketId], references: [id])
  assigneeId    String
  assignee      User      @relation(fields: [assigneeId], references: [id])
  developerId   String?
  developer     Developer? @relation(fields: [developerId], references: [id])
  assignedAt    DateTime  @default(now())
  status        AssignmentStatus @default(ASSIGNED)
  notes         String?
  isActive      Boolean   @default(true)
  updatedAt     DateTime  @updatedAt
}
```

### Complaint
```prisma
model Complaint {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  ticketId    String?
  ticket      Ticket?   @relation(fields: [ticketId], references: [id])
  title       String
  description String
  status      ComplaintStatus @default(SUBMITTED)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  resolvedAt  DateTime?
  resolution  String?
}
```

### AuditLog
```prisma
model AuditLog {
  id              String      @id @default(uuid())
  action          String
  entityType      String
  entityId        String
  createdAt       DateTime    @default(now())
  createdById     String
  createdBy       User        @relation("AuditLogCreator", fields: [createdById], references: [id])
  targetUserId    String?
  targetUser      User?       @relation("AuditLogTarget", fields: [targetUserId], references: [id])
  ticketId        String?
  ticket          Ticket?     @relation(fields: [ticketId], references: [id])
  oldValues       Json?
  newValues       Json?
  ipAddress       String?
  userAgent       String?
}
```

## Enums

### UserRole
```prisma
enum UserRole {
  ADMIN
  MANAGER
  AGENT
  DEVELOPER
  USER
}
```

### ExperienceLevel
```prisma
enum ExperienceLevel {
  JUNIOR
  MID
  SENIOR
  LEAD
}
```

### TicketStatus
```prisma
enum TicketStatus {
  OPEN
  IN_PROGRESS
  PENDING
  RESOLVED
  CLOSED
  REOPENED
}
```

### TicketPriority
```prisma
enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### AssignmentStatus
```prisma
enum AssignmentStatus {
  ASSIGNED
  ACCEPTED
  REJECTED
  COMPLETED
  REASSIGNED
}
```

### ComplaintStatus
```prisma
enum ComplaintStatus {
  SUBMITTED
  UNDER_REVIEW
  RESOLVED
  DISMISSED
}
```

## Database Functions and Triggers

### Audit Logging
- Automatic audit log creation for all model changes
- Tracks user actions, old and new values
- Includes IP address and user agent information

### Timestamps
- Automatic `createdAt` and `updatedAt` timestamp management
- Triggers for updating timestamps on model changes

## Indexes

The schema includes indexes for:
- User email lookups
- Team assignments
- Ticket status and priority
- Category hierarchies
- Audit log queries

## Migrations

Database migrations are managed through Prisma:
- Development migrations: `prisma migrate dev`
- Production deployments: `prisma migrate deploy`

## Seeding

Initial data seeding is handled by `prisma/seed.ts`:
- Creates default admin user
- Sets up initial teams
- Creates sample categories
- Adds test tickets and assignments 