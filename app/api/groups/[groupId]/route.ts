import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> } // Note le type Promise
) {
  try {
    // Attendre la résolution des paramètres
    const { groupId } = await params;

    if (!groupId) {
      return NextResponse.json(
        { error: 'ID du groupe manquant' },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, pseudo: true }
            }
          }
        },
        expenses: {
          include: {
            payer: {
              select: { id: true, pseudo: true }
            },
            splits: {
              include: {
                user: {
                  select: { id: true, pseudo: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Groupe non trouvé' },
        { status: 404 }
      );
    }

    const totalSpent = group.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return NextResponse.json({
      ...group,
      totalSpent
    });
  } catch (error) {
    console.error('Erreur GET /api/groups/[groupId]:', error);
    // Renvoyer un message d'erreur plus précis en développement
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: 'Erreur serveur', details: errorMessage },
      { status: 500 }
    );
  }
}