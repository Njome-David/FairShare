import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { computeNetBalances, settleDebts } from '@/lib/debts';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { error: 'ID du groupe manquant' },
        { status: 400 }
      );
    }

    // Récupérer toutes les dépenses du groupe avec leurs splits
    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: {
        splits: true,
        payer: { select: { id: true, pseudo: true } }
      }
    });

    // Récupérer tous les membres du groupe pour enrichir les noms
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: { user: { select: { id: true, pseudo: true } } }
        }
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    // Calculer les soldes nets
    const netBalances = computeNetBalances(expenses);

    // Formater les soldes avec les pseudos
    const balancesWithNames = Object.entries(netBalances).map(([userId, amount]) => {
      const member = group.members.find(m => m.userId === userId);
      return {
        userId,
        pseudo: member?.user.pseudo || 'Inconnu',
        amount: Math.round(amount) // Arrondi à 2 décimales
      };
    });

    // Calculer les transactions optimisées
    const rawTransactions = settleDebts(netBalances);

    // Enrichir les transactions avec les pseudos
    const transactions = rawTransactions.map(t => {
      const fromMember = group.members.find(m => m.userId === t.from);
      const toMember = group.members.find(m => m.userId === t.to);
      return {
        from: t.from,
        fromPseudo: fromMember?.user.pseudo || 'Inconnu',
        to: t.to,
        toPseudo: toMember?.user.pseudo || 'Inconnu',
        amount: Math.round(t.amount) 
      };
    });

    // Calculer le total des dépenses du groupe
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      groupId,
      groupName: group.name,
      totalSpent: Math.round(totalSpent),
      membersCount: group.members.length,
      netBalances: balancesWithNames,
      suggestedTransactions: transactions
    });
  } catch (error) {
    console.error('GET /api/groups/[groupId]/balances error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}