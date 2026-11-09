"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  CreditCard,
  Plus,
  Search,
  Calendar,
  Printer,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getPayments,
  getMembers,
  deletePayment,
  formatCurrency,
} from "@/app/waterdexiedb";
import { Payment, Member } from "@/app/waterdexiedb/types";
import { PaymentFormDialog } from "@/components/watermanagemtcomponents/PaymentFormDialog";
import { PrintableReceiptDialog } from "@/components/watermanagemtcomponents/PrintableReceiptDialog";
import { toast } from "sonner";

export default function PaymentsHistoryPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allPayments, allMembers] = await Promise.all([
        getPayments(),
        getMembers(),
      ]);
      setPayments(allPayments);
      setMembers(allMembers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const membersMap = useMemo(() => {
    const map = new Map<string, Member>();
    for (const m of members) map.set(m.id, m);
    return map;
  }, [members]);

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      const m = membersMap.get(p.memberId);
      const matchSearch =
        !q ||
        (m && m.name.toLowerCase().includes(q)) ||
        (m && m.meterNumber.toLowerCase().includes(q)) ||
        (p.receiptNumber && p.receiptNumber.toLowerCase().includes(q));

      const matchMonth = !monthFilter || p.date.startsWith(monthFilter);
      return matchSearch && matchMonth;
    });
  }, [payments, search, monthFilter, membersMap]);

  const totalCollected = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleDelete = async (id: string) => {
    if (confirm(isRtl ? "هل أنت متأكد من حذف هذا الأداء؟ سيتم إعادة احتساب رصيد المنخرط تلقائياً." : "Delete this payment record?")) {
      try {
        await deletePayment(id);
        toast.success(isRtl ? "تم حذف الأداء بنجاح" : "Payment deleted");
        loadData();
      } catch (err) {
        toast.error(isRtl ? "فشل حذف الأداء" : "Delete failed");
      }
    }
  };

  const handleOpenReceipt = (p: Payment) => {
    setReceiptPayment(p);
    setReceiptOpen(true);
  };

  const currentMember = receiptPayment ? membersMap.get(receiptPayment.memberId) : null;

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
            <span>{isRtl ? "سجل استخلاص الأداءات" : "Collections & Payments"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isRtl
              ? `إجمالي ${payments.length} عملية أداء مسجلة`
              : `Total of ${payments.length} payments recorded`}
          </p>
        </div>

        <Button
          onClick={() => setFormOpen(true)}
          className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>{isRtl ? "استخلاص دفعة جديدة" : "Record New Payment"}</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2 relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? "ابحث بالاسم، رقم العداد، أو رقم الوصل..." : "Search member, meter no, receipt no..."}
            className="ps-9 h-11 rounded-xl text-xs bg-card"
          />
        </div>

        <div>
          <Input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="h-11 rounded-xl text-xs bg-card"
          />
        </div>
      </div>

      {/* Summary Stat for filtered list */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
        <div>
          <span className="text-muted-foreground text-[11px] block">
            {isRtl ? "مجموع المبالغ المستخلصة المعروضة:" : "Total Filtered Collections:"}
          </span>
          <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
            {formatCurrency(totalCollected, locale)}
          </span>
        </div>
        <Badge variant="outline" className="border-emerald-500/30 font-bold">
          {filteredPayments.length} {isRtl ? "أداء" : "payments"}
        </Badge>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-card">
          <CreditCard className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-xs text-muted-foreground">
            {isRtl ? "لا توجد أداءات مسجلة مطابقة" : "No payments match this search"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPayments.map((p) => {
            const m = membersMap.get(p.memberId);
            return (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                    {m?.meterNumber || "—"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">
                      {m?.name || (isRtl ? "منخرط غير معروف" : "Unknown")}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {p.date}
                      </span>
                      <span className="font-mono text-muted-foreground/80">
                        {p.receiptNumber}
                      </span>
                    </div>
                    {p.note && (
                      <div className="text-[10px] text-muted-foreground/90 italic truncate mt-0.5">
                        {p.note}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-end">
                    <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(p.amount, locale)}
                    </div>
                  </div>

                  {/* Print Receipt */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => handleOpenReceipt(p)}
                    title={isRtl ? "معاينة وطباعة الوصل" : "Print receipt"}
                  >
                    <Printer className="h-3.5 w-3.5 text-primary" />
                  </Button>

                  {/* Delete payment */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(p.id)}
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

      {/* Payment Form Dialog */}
      <PaymentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onPaymentRecorded={() => loadData()}
        onOpenReceipt={handleOpenReceipt}
      />

      {/* Printable Receipt Dialog */}
      {receiptPayment && currentMember && (
        <PrintableReceiptDialog
          open={receiptOpen}
          onOpenChange={setReceiptOpen}
          member={currentMember}
          payment={receiptPayment}
        />
      )}
    </div>
  );
}
