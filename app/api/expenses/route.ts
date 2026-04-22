// app/api/expenses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { description, amount, payerId, groupId, splits } = await req.json();

    // Validations
    if (amount % 25 !== 0) {
      return NextResponse.json(
        { error: 'Le montant doit être un multiple de 25 FCFA' },
        { status: 400 }
      );
    }

    if (!description || !amount || !payerId || !groupId || !splits) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la somme des parts égale le montant total
    const totalShares = splits.reduce((sum: number, s: any) => sum + s.share, 0);
    if (Math.abs(totalShares - amount) > 0.01) {
      return NextResponse.json(
        { error: 'La somme des parts doit être égale au montant total' },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        payerId,
        groupId,
        splits: {
          create: splits.map((s: any) => ({
            userId: s.userId,
            share: s.share
          }))
        }
      },
      include: {
        payer: true,
        splits: { include: { user: true } }
      }
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}