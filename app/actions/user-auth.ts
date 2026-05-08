'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';

const prisma = new PrismaClient();

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  age?: number;
  jobTitle?: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { error: 'Email already registered' };

  const hashed = await bcrypt.hash(data.password, 12);
  await prisma.user.create({
    data: {
      name:     data.name,
      email:    data.email,
      password: hashed,
      age:      data.age     || null,
      jobTitle: data.jobTitle || null,
      phone:    data.phone   || null,
    },
  });

  return { success: true };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('CredentialsSignin')) return { error: 'Invalid email or password' };
    throw e;
  }
}
