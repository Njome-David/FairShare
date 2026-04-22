import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { pseudo } = await req.json();
    if (!pseudo) {
      return NextResponse.json({ error: 'Pseudo requis' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { pseudo } });
    if (!user) {
      user = await prisma.user.create({ data: { pseudo } });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}