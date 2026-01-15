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

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find((u) => u.email === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // For simplicity we return basic user info; no JWT/session implementation here.
    return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
