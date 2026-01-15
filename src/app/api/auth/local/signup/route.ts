import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_PATH, 'utf-8');
    return JSON.parse(raw) as Array<any>;
  } catch {
    return [];
  }
}

async function writeUsers(users: Array<any>) {
  await fs.mkdir(path.dirname(USERS_PATH), { recursive: true });
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const users = await readUsers();
    const exists = users.find((u) => u.email === email.toLowerCase());

    if (exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    users.push({ email: email.toLowerCase(), name: name || null, passwordHash });
    await writeUsers(users);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
