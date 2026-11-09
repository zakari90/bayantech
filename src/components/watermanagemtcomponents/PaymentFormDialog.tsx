"use client";

import React, { useState, useEffect } from "react";
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
import { Member, MemberFinancialSummary, Payment } from "@/app/waterdexiedb/types";
import { getMembers, getAllMembersSummaries } from "@/app/waterdexiedb/repositories/membersRepo";
import { addPayment } from "@/app/waterdexiedb/repositories/paymentsRepo";
import { madToCentimes, centimesToMad, formatCurrency } from "@/app/waterdexiedb/billing";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Printer } from "lucide-react";

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedMemberId?: string;
  onPaymentRecorded: (payment: Payment) => void;
  onOpenReceipt?: (payment: Payment) => void;
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  preSelectedMemberId,
  onPaymentRecorded,
  onOpenReceipt,
}: PaymentFormDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [summaries, setSummaries] = useState<MemberFinancialSummary[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(preSelectedMemberId || "");
  const [amountMAD, setAmountMAD] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getAllMembersSummaries();
      setSummaries(data);
      if (preSelectedMemberId) {
        setSelectedMemberId(preSelectedMemberId);
        const current = data.find((s) => s.member.id === preSelectedMemberId);
        if (current && current.balance > 0) {
          setAmountMAD(centimesToMad(current.balance).toFixed(2));
        }
      }
    }
    if (open) {
      load();
    }
  }, [open, preSelectedMemberId]);

  const selectedSummary = summaries.find((s) => s.member.id === selectedMemberId);

  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const sum = summaries.find((s) => s.member.id === id);
    if (sum && sum.balance > 0) {
      setAmountMAD(centimesToMad(sum.balance).toFixed(2));
    } else {
      setAmountMAD("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) {
      toast.error(isRtl ? "يرجى اختيار المنخرط" : "Please select a member");
      return;
    }

    const numAmount = parseFloat(amountMAD);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error(isRtl ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount");
      return;
    }

    try {
      setIsSubmitting(true);
      const centimes = madToCentimes(numAmount);
      const payment = await addPayment({
        memberId: selectedMemberId,
        amount: centimes,
        date,
        note: note.trim() || undefined,
      });

      toast.success(isRtl ? "تم تسجيل الأداء بنجاح" : "Payment recorded successfully", {
        action: onOpenReceipt ? {
          label: isRtl ? "طباعة الوصل" : "Print Receipt",
          onClick: () => onOpenReceipt(payment),
        } : undefined,
      });

      onPaymentRecorded(payment);
      onOpenChange(false);
      setAmountMAD("");
      setNote("");
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء تسجيل الأداء" : "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="text-start pb-2 border-b">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <span>{isRtl ? "استخلاص دفعة / أداء فاتورة" : "Record Payment"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isRtl
              ? "تسجيل استخلاص واجبات استهلاك الماء مع إمكانية استخراج وصل فوري"
              : "Record member payment and generate a printable receipt"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Member Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isRtl ? "اختيار المنخرط" : "Select Member"} *
            </Label>
            <Select value={selectedMemberId} onValueChange={handleMemberChange}>
              <SelectTrigger className="h-11 text-sm font-medium">
                <SelectValue placeholder={isRtl ? "ابحث أو اختر المنخرط..." : "Select a member..."} />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {summaries.map((s) => (
                  <SelectItem key={s.member.id} value={s.member.id}>
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="font-semibold">{s.member.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">[{s.member.meterNumber}]</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Debt Preview Badge */}
          {selectedSummary && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                selectedSummary.balance > 0
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                  : selectedSummary.balance === 0
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400"
              }`}
            >
              <div>
                <span className="font-semibold">
                  {selectedSummary.balance > 0
                    ? isRtl ? "المبلغ المتبقي بذمته (دين):" : "Outstanding Debt:"
                    : selectedSummary.balance === 0
                    ? isRtl ? "الوضعية:" : "Status:"
                    : isRtl ? "رصيد فائض للمنخرط:" : "Credit Balance:"}
                </span>
                <span className="text-[11px] block text-muted-foreground">
                  {isRtl ? `العداد: ${selectedSummary.member.meterNumber}` : `Meter: ${selectedSummary.member.meterNumber}`}
                </span>
              </div>
              <div className="text-sm font-black">
                {selectedSummary.balance === 0
                  ? isRtl ? "خالص ✓" : "Paid Up ✓"
                  : formatCurrency(Math.abs(selectedSummary.balance), locale)}
              </div>
            </div>
          )}

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="payment-amount" className="text-xs font-semibold">
                {isRtl ? "المبلغ المؤدى (درهم)" : "Amount (MAD)"} *
              </Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.5"
                min="0.5"
                inputMode="decimal"
                value={amountMAD}
                onChange={(e) => setAmountMAD(e.target.value)}
                placeholder="0.00"
                required
                className="h-11 text-base font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="payment-date" className="text-xs font-semibold">
                {isRtl ? "تاريخ الأداء" : "Date"} *
              </Label>
              <Input
                id="payment-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-11 text-xs font-medium"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <Label htmlFor="payment-note" className="text-xs font-semibold">
              {isRtl ? "ملاحظة أو طريقة الأداء" : "Payment Note / Method"}
            </Label>
            <Input
              id="payment-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isRtl ? "مثال: نقداً، تسبيق، تحويل..." : "e.g. Cash, Advance..."}
              className="h-10 text-xs"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl text-xs"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              <CheckCircle2 className="h-4 w-4 me-1.5" />
              <span>{isRtl ? "تأكيد واستخلاص" : "Confirm Payment"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
