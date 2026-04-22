// app/api/users/[userId]/stats/route.ts
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
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les groupes auxquels l'utilisateur appartient avec leurs dépenses
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            expenses: {
              include: {
                splits: true,
                payer: { select: { id: true, pseudo: true } },
              },
            },
            members: {
              include: { user: { select: { id: true, pseudo: true } } },
            },
          },
        },
      },
    });

    const groupsCount = memberships.length;
    let totalSpent = 0;
    let expensesCount = 0;
    const recentGroups: any[] = [];

    for (const m of memberships) {
      const group = m.group;
      const groupTotal = group.expenses.reduce((sum, e) => sum + e.amount, 0);
      totalSpent += groupTotal;
      expensesCount += group.expenses.length;

      // Groupes récents (max 3) avec leurs totaux pour le pie chart
      if (recentGroups.length < 5) { // on peut en prendre jusqu'à 5 pour le graphique
        recentGroups.push({
          id: group.id,
          name: group.name,
          totalSpent: groupTotal,
          memberCount: group.members.length,
        });
      }
    }

    const averagePerGroup = groupsCount > 0 ? totalSpent / groupsCount : 0;

    return NextResponse.json({
      totalSpent: Math.round(totalSpent * 100) / 100,
      groupsCount,
      expensesCount,
      averagePerGroup: Math.round(averagePerGroup * 100) / 100,
      recentGroups, // utilisé pour le pie chart
    });
  } catch (error) {
    console.error('GET /api/users/[userId]/stats error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}