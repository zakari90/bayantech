"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseCategory, Expense } from "@/app/waterdexiedb/types";
import { addExpense } from "@/app/waterdexiedb/repositories/expensesRepo";
import { madToCentimes } from "@/app/waterdexiedb/billing";
import { toast } from "sonner";
import { TrendingDown, CheckCircle2 } from "lucide-react";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: (expense: Expense) => void;
}

export function ExpenseFormDialog({
  open,
  onOpenChange,
  onExpenseAdded,
}: ExpenseFormDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("electricity");
  const [amountMAD, setAmountMAD] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountMAD);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error(isRtl ? "يرجى إدخال مبلغ صحيح للمصروف" : "Please enter a valid expense amount");
      return;
    }

    try {
      setIsSubmitting(true);
      const centimes = madToCentimes(numAmount);
      const exp = await addExpense({
        description: description.trim(),
        category,
        amount: centimes,
        date,
        note: note.trim() || undefined,
      });

      toast.success(isRtl ? "تم تسجيل المصروف بنجاح" : "Expense recorded successfully");
      onExpenseAdded(exp);
      onOpenChange(false);
      setDescription("");
      setAmountMAD("");
      setNote("");
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء حفظ المصروف" : "Failed to record expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="text-start pb-2 border-b">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <span>{isRtl ? "تسجيل مصروف جديد" : "Record Expense"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isRtl
              ? "تسجيل نفقات تسيير الشبكة، كهرباء المضخة، الإصلاحات والصيانة"
              : "Record network operations, pump electricity, and maintenance expenses"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="exp-desc" className="text-xs font-semibold">
              {isRtl ? "بيان المصروف" : "Description"} *
            </Label>
            <Input
              id="exp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRtl ? "مثال: شراء صمام جديد لقناة التوزيع" : "e.g. Pump electricity bill"}
              required
              className="h-10 text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              {isRtl ? "صنف المصروف" : "Category"} *
            </Label>
            <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
              <SelectTrigger className="h-10 text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electricity">{isRtl ? "كهرباء المضخة (ONE)" : "Pump Electricity"}</SelectItem>
                <SelectItem value="repairs">{isRtl ? "إصلاحات وشبكة التوزيع" : "Network Repairs"}</SelectItem>
                <SelectItem value="pump">{isRtl ? "صيانة المضخة والبئر" : "Pump & Well Maintenance"}</SelectItem>
                <SelectItem value="admin">{isRtl ? "مصاريف إدارية ومكتبية" : "Administrative"}</SelectItem>
                <SelectItem value="other">{isRtl ? "أخرى" : "Other"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="exp-amount" className="text-xs font-semibold">
                {isRtl ? "المبلغ (درهم)" : "Amount (MAD)"} *
              </Label>
              <Input
                id="exp-amount"
                type="number"
                step="0.5"
                min="0.5"
                inputMode="decimal"
                value={amountMAD}
                onChange={(e) => setAmountMAD(e.target.value)}
                placeholder="0.00"
                required
                className="h-10 text-sm font-bold text-rose-600 dark:text-rose-400"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="exp-date" className="text-xs font-semibold">
                {isRtl ? "التاريخ" : "Date"} *
              </Label>
              <Input
                id="exp-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-10 text-xs font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="exp-note" className="text-xs font-semibold">
              {isRtl ? "ملاحظة أو رقم الفاتورة" : "Note / Invoice Number"}
            </Label>
            <Input
              id="exp-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isRtl ? "مثال: فاتورة رقم 458" : "e.g. Invoice #458"}
              className="h-10 text-xs"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl text-xs"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              <CheckCircle2 className="h-4 w-4 me-1.5" />
              <span>{isRtl ? "تسجيل المصروف" : "Save Expense"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
