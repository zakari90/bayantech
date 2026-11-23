import { waterDb } from "../db";
import { Expense, ExpenseCategory } from "../types";

export async function getExpenses(category?: ExpenseCategory): Promise<Expense[]> {
  let query = waterDb.expenses.toCollection();
  if (category) {
    query = waterDb.expenses.where("category").equals(category);
  }
  const list = await query.toArray();
  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addExpense(data: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
  const newExpense: Expense = {
    ...data,
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  await waterDb.expenses.add(newExpense);
  return newExpense;
}

export async function deleteExpense(id: string): Promise<void> {
  await waterDb.expenses.delete(id);
}
