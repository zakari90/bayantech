"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  TrendingDown,
  Plus,
  Zap,
  Wrench,
  Activity,
  FileText,
  HelpCircle,
  Calendar,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getExpenses, deleteExpense, formatCurrency } from "@/app/waterdexiedb";
import { Expense, ExpenseCategory } from "@/app/waterdexiedb/types";
import { ExpenseFormDialog } from "@/components/watermanagemtcomponents/ExpenseFormDialog";
import { toast } from "sonner";

export default function ExpensesPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const exps = await getExpenses();
      setExpenses(exps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === "all") return expenses;
    return expenses.filter((e) => e.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const totalExpenseAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  const getCategoryMeta = (cat: ExpenseCategory) => {
    switch (cat) {
      case "electricity":
        return {
          label: isRtl ? "كهرباء المضخة" : "Pump Electricity",
          icon: Zap,
          color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
        };
      case "repairs":
        return {
          label: isRtl ? "إصلاحات الشبكة" : "Network Repairs",
          icon: Wrench,
          color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        };
      case "pump":
        return {
          label: isRtl ? "صيانة المضخة والبئر" : "Pump Maintenance",
          icon: Activity,
          color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
        };
      case "admin":
        return {
          label: isRtl ? "مصاريف إدارية" : "Administrative",
          icon: FileText,
          color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        };
      default:
        return {
          label: isRtl ? "أخرى" : "Other",
          icon: HelpCircle,
          color: "text-slate-600 bg-slate-500/10 border-slate-500/20",
        };
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(isRtl ? "هل أنت متأكد من حذف هذا المصروف؟" : "Delete this expense?")) {
      try {
        await deleteExpense(id);
        toast.success(isRtl ? "تم حذف المصروف بنجاح" : "Expense deleted");
        loadData();
      } catch (err) {
        toast.error(isRtl ? "فشل حذف المصروف" : "Failed to delete expense");
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-rose-600" />
            <span>{isRtl ? "مصاريف ونفقات الجمعية" : "Association Expenses"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isRtl
              ? "تتبع فواتير كهرباء المضخة، صيانة البئر، وأشغال شبكة التوزيع"
              : "Track electricity bills, pump maintenance, and distribution network repairs"}
          </p>
        </div>

        <Button
          onClick={() => setFormOpen(true)}
          className="h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>{isRtl ? "تسجيل مصروف جديد" : "Record New Expense"}</span>
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Button
          size="sm"
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className="h-8 rounded-full text-xs font-semibold px-3"
        >
          {isRtl ? `الكل (${expenses.length})` : `All (${expenses.length})`}
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "electricity" ? "default" : "outline"}
          onClick={() => setSelectedCategory("electricity")}
          className="h-8 rounded-full text-xs font-semibold px-3"
        >
          {isRtl ? "الكهرباء" : "Electricity"}
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "repairs" ? "default" : "outline"}
          onClick={() => setSelectedCategory("repairs")}
          className="h-8 rounded-full text-xs font-semibold px-3"
        >
          {isRtl ? "إصلاحات" : "Repairs"}
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "pump" ? "default" : "outline"}
          onClick={() => setSelectedCategory("pump")}
          className="h-8 rounded-full text-xs font-semibold px-3"
        >
          {isRtl ? "المضخة" : "Pump"}
        </Button>
        <Button
          size="sm"
          variant={selectedCategory === "admin" ? "default" : "outline"}
          onClick={() => setSelectedCategory("admin")}
          className="h-8 rounded-full text-xs font-semibold px-3"
        >
          {isRtl ? "إدارية" : "Admin"}
        </Button>
      </div>

      {/* Total Card */}
      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
        <div>
          <span className="text-muted-foreground text-[11px] block">
            {isRtl ? "مجموع المصاريف المعروضة:" : "Total Filtered Expenses:"}
          </span>
          <span className="text-lg font-black text-rose-700 dark:text-rose-400">
            {formatCurrency(totalExpenseAmount, locale)}
          </span>
        </div>
        <Badge variant="outline" className="border-rose-500/30 font-bold">
          {filteredExpenses.length} {isRtl ? "مصروف" : "items"}
        </Badge>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-card">
          <TrendingDown className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-xs text-muted-foreground">
            {isRtl ? "لا توجد مصاريف مسجلة في هذا الصنف" : "No expenses recorded in this category"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((exp) => {
            const meta = getCategoryMeta(exp.category);
            const CatIcon = meta.icon;
            return (
              <div
                key={exp.id}
                className="p-3.5 rounded-2xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.color}`}
                  >
                    <CatIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">
                      {exp.description}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-foreground/80">{meta.label}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        {exp.date}
                      </span>
                    </div>
                    {exp.note && (
                      <div className="text-[10px] text-muted-foreground/90 italic truncate mt-0.5">
                        {exp.note}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-end">
                    <div className="font-black text-sm text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount, locale)}
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(exp.id)}
                    title={isRtl ? "حذف" : "Delete"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expense Form Dialog */}
      <ExpenseFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onExpenseAdded={() => loadData()}
      />
    </div>
  );
}
