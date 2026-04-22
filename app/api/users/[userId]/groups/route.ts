import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur manquant' },
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

    // Récupérer les groupes auxquels l'utilisateur appartient
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            members: {
              include: { user: { select: { id: true, pseudo: true } } }
            },
            expenses: {
              select: { amount: true }
            }
          }
        }
      }
    });

    // Formater la réponse
    const groups = memberships.map(m => {
      const totalSpent = m.group.expenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        id: m.group.id,
        name: m.group.name,
        inviteCode: m.group.inviteCode,
        createdAt: m.group.createdAt,
        membersCount: m.group.members.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        members: m.group.members.map(member => ({
          userId: member.userId,
          pseudo: member.user.pseudo
        }))
      };
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('GET /api/users/[userId]/groups error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}