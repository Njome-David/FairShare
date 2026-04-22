// app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Nom du groupe et userId requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Générer un code d'invitation simple (6 caractères alphanumériques)
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Créer le groupe et ajouter le créateur comme membre
    const group = await prisma.group.create({
      data: {
        name,
        inviteCode,
        members: {
          create: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          include: { user: true }
        }
      }
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}