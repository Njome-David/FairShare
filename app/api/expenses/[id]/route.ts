import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la dépense manquant' },
        { status: 400 }
      );
    }

    // Vérifier que la dépense existe
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: { splits: true }
    });

    if (!expense) {
      return NextResponse.json(
        { error: 'Dépense non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer d'abord les splits associés (Prisma peut le faire automatiquement avec onDelete: Cascade si configuré, mais nous le faisons explicitement ici)
    await prisma.expenseSplit.deleteMany({
      where: { expenseId: id }
    });

    // Supprimer la dépense
    await prisma.expense.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Dépense supprimée avec succès', id },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/expenses/[id] error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}