interface Balance {
  userId: string;
  amount: number; // Positif = doit etre rembourse, Negatif = doit de l'argent
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export function computeNetBalances(expenses: any[]): Record<string, number> {
  const balances: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const payer = expense.payerId;
    const amount = expense.amount;
    
    // Initialisation
    if (!balances[payer]) balances[payer] = 0;
    balances[payer] += amount;
    
    expense.splits.forEach((split: any) => {
      const userId = split.userId;
      const share = split.share;
      if (!balances[userId]) balances[userId] = 0;
      balances[userId] -= share;
    });
  });
  
  return balances;
}

export function settleDebts(balances: Record<string, number>): Transaction[] {
  const creditors: Balance[] = [];
  const debtors: Balance[] = [];
  
  Object.entries(balances).forEach(([userId, amount]) => {
    if (amount > 0.01) creditors.push({ userId, amount });
    else if (amount < -0.01) debtors.push({ userId, amount: -amount });
  });
  
  // Tri decroissant
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  
  const transactions: Transaction[] = [];
  let i = 0, j = 0;
  
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.amount, debtor.amount);
    
    if (amount > 0.01) {
      transactions.push({ from: debtor.userId, to: creditor.userId, amount });
    }
    
    creditor.amount -= amount;
    debtor.amount -= amount;
    
    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }
  
  return transactions;
}