import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { inviteCode, userId } = await req.json();

    // Validation
    if (!inviteCode || !userId) {
      return NextResponse.json(
        { error: 'Code d\'invitation et userId requis' },
        { status: 400 }
      );
    }

    // Trouver le groupe correspondant au code
    const group = await prisma.group.findUnique({
      where: { inviteCode },
      include: { members: true }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Code d\'invitation invalide' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    const alreadyMember = group.members.some(m => m.userId === userId);
    if (alreadyMember) {
      return NextResponse.json(
        { error: 'Vous êtes déjà membre de ce groupe' },
        { status: 400 }
      );
    }

    // Ajouter l'utilisateur comme membre
    const updatedGroup = await prisma.group.update({
      where: { id: group.id },
      data: {
        members: {
          create: { userId }
        }
      },
      include: {
        members: {
          include: { user: true }
        }
      }
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}