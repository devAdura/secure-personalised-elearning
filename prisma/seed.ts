import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.securityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.learningActivity.deleteMany();
  await prisma.discussionPost.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.webAuthnChallenge.deleteMany();
  await prisma.webAuthnCredential.deleteMany();
  await prisma.session.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const [admin, lecturer, lecturerTwo, student, studentTwo] = await Promise.all([
    prisma.user.create({ data: { name: "System Administrator", email: "admin@securelearn.test", passwordHash, role: "ADMIN" } }),
    prisma.user.create({ data: { name: "Dr Grace Okafor", email: "lecturer@securelearn.test", passwordHash, role: "LECTURER" } }),
    prisma.user.create({ data: { name: "Mr David Bello", email: "david@securelearn.test", passwordHash, role: "LECTURER" } }),
    prisma.user.create({ data: { name: "Ada Nwosu", email: "student@securelearn.test", passwordHash, role: "STUDENT" } }),
    prisma.user.create({ data: { name: "Ibrahim Musa", email: "ibrahim@securelearn.test", passwordHash, role: "STUDENT" } })
  ]);

  const cybersecurity = await prisma.course.create({
    data: {
      title: "Introduction to Cybersecurity",
      description: "Learn foundational cybersecurity concepts, common threats, authentication principles, risk management and safe digital practices through collaborative activities.",
      category: "Cybersecurity", level: "Beginner", lecturerId: lecturer.id, isPublished: true,
      materials: { create: [
        { title: "Security Fundamentals", content: "Cybersecurity protects the confidentiality, integrity and availability of information. Study the CIA triad and identify examples from everyday systems." },
        { title: "Authentication and Access Control", content: "Compare passwords, multi-factor authentication and WebAuthn passkeys. Focus on how public-key authentication reduces phishing risk.", fileUrl: "https://webauthn.guide/" }
      ]},
      assignments: { create: [
        { title: "Threat Analysis Exercise", description: "Identify three threats to a university e-learning system. For each threat, describe its likely impact and one suitable control.", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { title: "Authentication Comparison", description: "Compare password-only authentication with passkey authentication using security, usability and privacy criteria.", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
      ]}
    }, include: { assignments: true }
  });

  const webDev = await prisma.course.create({
    data: {
      title: "Modern Web Application Development",
      description: "Build full-stack applications using component-based interfaces, server APIs, relational databases, validation and secure deployment practices.",
      category: "Software Development", level: "Intermediate", lecturerId: lecturer.id, isPublished: true,
      materials: { create: [
        { title: "Full-Stack Architecture", content: "A full-stack system combines a user interface, server-side application logic, data persistence and deployment infrastructure." },
        { title: "Database Modelling", content: "Use entities, relationships, constraints and indexes to design a consistent relational database for a web application." }
      ]},
      assignments: { create: [{ title: "Design a Course API", description: "Design REST-style endpoints for course creation, enrolment and assignment submission. Include request validation and access-control rules.", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }] }
    }, include: { assignments: true }
  });

  const dataScience = await prisma.course.create({
    data: {
      title: "Data Science Essentials",
      description: "Explore data preparation, descriptive analysis, visualisation and introductory predictive thinking using practical educational datasets.",
      category: "Data Science", level: "Beginner", lecturerId: lecturerTwo.id, isPublished: true,
      materials: { create: [{ title: "Understanding Data", content: "Distinguish qualitative and quantitative variables, recognise missing values, and select appropriate summaries for a dataset." }] },
      assignments: { create: [{ title: "Dataset Summary", description: "Choose a small public dataset and explain its variables, quality issues and three useful descriptive statistics.", dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) }] }
    }
  });

  await prisma.course.create({
    data: {
      title: "Advanced Network Defence",
      description: "A draft advanced course on network monitoring, incident response and defence-in-depth architecture.",
      category: "Cybersecurity", level: "Advanced", lecturerId: lecturer.id, isPublished: false
    }
  });

  await prisma.enrollment.createMany({ data: [
    { userId: student.id, courseId: cybersecurity.id },
    { userId: student.id, courseId: webDev.id },
    { userId: studentTwo.id, courseId: cybersecurity.id },
    { userId: studentTwo.id, courseId: dataScience.id }
  ]});

  const rootPost = await prisma.discussionPost.create({ data: { courseId: cybersecurity.id, authorId: lecturer.id, content: "Welcome to the course. Introduce yourself and mention one cybersecurity topic you want to understand better." } });
  await prisma.discussionPost.createMany({ data: [
    { courseId: cybersecurity.id, authorId: student.id, parentId: rootPost.id, content: "I am Ada. I want to understand why passkeys are safer than ordinary passwords." },
    { courseId: cybersecurity.id, authorId: studentTwo.id, parentId: rootPost.id, content: "I am Ibrahim. I am interested in network attacks and incident response." },
    { courseId: webDev.id, authorId: student.id, content: "Does server-side validation still matter when the form already validates inputs in the browser?" }
  ]});

  await prisma.submission.create({
    data: {
      assignmentId: cybersecurity.assignments[0].id,
      studentId: studentTwo.id,
      content: "Threat 1 is credential theft through phishing. It can expose student records. A suitable control is phishing-resistant passkey authentication. Threat 2 is unauthorised course modification. Role-based authorisation can reduce this risk. Threat 3 is data loss. Tested backups and recovery procedures are appropriate controls.",
      grade: 82,
      feedback: "Good identification of realistic threats and controls. Add more detail about likelihood in future analyses."
    }
  });

  await prisma.notification.createMany({ data: [
    { userId: student.id, title: "Welcome to SecureLearn", message: "Set up a fingerprint/passkey to strengthen your account security." },
    { userId: student.id, title: "Assignment reminder", message: "Threat Analysis Exercise is due in seven days." },
    { userId: lecturer.id, title: "New course activity", message: "Students have started participating in Introduction to Cybersecurity." },
    { userId: admin.id, title: "Security monitoring active", message: "Authentication and administrator actions are being recorded in the security log." }
  ]});

  await prisma.learningActivity.createMany({ data: [
    { userId: student.id, courseId: cybersecurity.id, action: "COURSE_VIEW", createdAt: new Date(Date.now() - 60 * 60 * 1000) },
    { userId: student.id, courseId: webDev.id, action: "COURSE_VIEW", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
  ]});

  await prisma.securityLog.createMany({ data: [
    { userId: admin.id, action: "SEED_ADMIN_CREATED", status: "SUCCESS", ipAddress: "system", userAgent: "seed" },
    { userId: lecturer.id, action: "COURSE_CREATED", status: "SUCCESS", ipAddress: "system", userAgent: "seed", metadata: { courseId: cybersecurity.id } },
    { userId: student.id, action: "LOGIN_PASSWORD", status: "SUCCESS", ipAddress: "127.0.0.1", userAgent: "Demo browser" },
    { action: "LOGIN_PASSWORD", status: "FAILURE", ipAddress: "127.0.0.1", userAgent: "Demo browser", metadata: { email: "unknown@example.com" } }
  ]});

  console.log("Seed complete.");
  console.log("Demo password for all accounts: Password123!");
  console.log("Admin: admin@securelearn.test");
  console.log("Lecturer: lecturer@securelearn.test");
  console.log("Student: student@securelearn.test");
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
