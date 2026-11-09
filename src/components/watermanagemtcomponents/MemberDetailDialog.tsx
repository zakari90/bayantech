"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Member, Reading, Payment, MemberFinancialSummary } from "@/app/waterdexiedb/types";
import { getMemberFinancialSummary, deleteMember } from "@/app/waterdexiedb/repositories/membersRepo";
import { getReadingsForMember } from "@/app/waterdexiedb/repositories/readingsRepo";
import { getPayments } from "@/app/waterdexiedb/repositories/paymentsRepo";
import { getSettings } from "@/app/waterdexiedb/repositories/settingsRepo";
import {
  formatCurrency,
  generateWhatsAppReminderUrl,
  centimesToMad,
} from "@/app/waterdexiedb/billing";
import {
  Phone,
  MessageCircle,
  CreditCard,
  Gauge,
  Printer,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { PrintableReceiptDialog } from "./PrintableReceiptDialog";
import { AdminDeleteConfirmDialog } from "./AdminDeleteConfirmDialog";

interface MemberDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: string | null;
  onEditMember: (member: Member) => void;
  onRecordPayment: (memberId: string) => void;
  onMemberDeleted?: () => void;
}

export function MemberDetailDialog({
  open,
  onOpenChange,
  memberId,
  onEditMember,
  onRecordPayment,
  onMemberDeleted,
}: MemberDetailDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [summary, setSummary] = useState<MemberFinancialSummary | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [assocName, setAssocName] = useState("جمعية مستخدمي مياه الشرب");
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!memberId) return;
      const [sum, rds, pays, setts] = await Promise.all([
        getMemberFinancialSummary(memberId),
        getReadingsForMember(memberId),
        getPayments(memberId),
        getSettings(),
      ]);
      setSummary(sum);
      setReadings(rds);
      setPayments(pays);
      if (setts?.associationName) setAssocName(setts.associationName);
    }
    if (open && memberId) {
      loadData();
    }
  }, [open, memberId]);

  if (!summary) return null;
  const { member, balance, totalBilled, totalPaid, lastReading } = summary;

  const handleWhatsApp = () => {
    if (!member.phone) {
      toast.error(isRtl ? "لا يوجد رقم هاتف مسجل لهذا المنخرط" : "No phone number registered for this member");
      return;
    }
    const currentMonth = lastReading?.month || new Date().toISOString().substring(0, 7);
    const url = generateWhatsAppReminderUrl({
      phone: member.phone,
      memberName: member.name,
      meterNumber: member.meterNumber,
      associationName: assocName,
      month: currentMonth,
      consumptionM3: lastReading?.consumption,
      currentBillMAD: lastReading ? centimesToMad(lastReading.billAmount) : undefined,
      totalDueMAD: Math.max(0, centimesToMad(balance)),
      locale,
    });
    window.open(url, "_blank");
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMember(member.id);
      toast.success(isRtl ? "تم حذف المنخرط بنجاح" : "Member deleted successfully");
      setIsDeleteDialogOpen(false);
      onOpenChange(false);
      if (onMemberDeleted) onMemberDeleted();
    } catch (err) {
      toast.error(isRtl ? "فشل حذف المنخرط" : "Failed to delete member");
    }
  };

  const openReceiptModal = (p: Payment) => {
    setSelectedPaymentForReceipt(p);
    setReceiptOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-4 sm:p-6 overflow-hidden rounded-2xl max-h-[92vh] flex flex-col">
          {/* Header Profile */}
          <DialogHeader className="text-start pb-3 border-b space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg sm:text-xl font-bold">{member.name}</DialogTitle>
                  <Badge variant="outline" className="font-mono font-bold text-xs">
                    {member.meterNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  {member.sector && <span>{member.sector}</span>}
                  {member.phone && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 text-end">
                {balance > 0 ? (
                  <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs py-1">
                    {isRtl ? "مدين بـ: " : "Owes: "}
                    {formatCurrency(balance, locale)}
                  </Badge>
                ) : balance === 0 ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs py-1">
                    {isRtl ? "خالص ✓" : "Paid Up ✓"}
                  </Badge>
                ) : (
                  <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs py-1">
                    {isRtl ? "رصيد فائض: " : "Credit: "}
                    {formatCurrency(Math.abs(balance), locale)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button
                size="sm"
                className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-xs"
                onClick={() => {
                  onRecordPayment(member.id);
                  onOpenChange(false);
                }}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>{isRtl ? "استخلاص" : "Collect"}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs gap-1.5"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isRtl ? "واتساب" : "WhatsApp"}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-xl text-xs gap-1.5"
                onClick={() => {
                  onEditMember(member);
                  onOpenChange(false);
                }}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>{isRtl ? "تعديل" : "Edit"}</span>
              </Button>
            </div>
          </DialogHeader>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 py-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-muted/40 border">
              <div className="text-muted-foreground text-[11px]">{isRtl ? "مجموع الفواتير" : "Total Billed"}</div>
              <div className="font-bold text-sm text-foreground mt-0.5">{formatCurrency(totalBilled, locale)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border">
              <div className="text-muted-foreground text-[11px]">{isRtl ? "مجموع الأداءات" : "Total Paid"}</div>
              <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatCurrency(totalPaid, locale)}
              </div>
            </div>
          </div>

          {/* Tabs for Readings & Payments */}
          <Tabs defaultValue="readings" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-2 w-full h-9 rounded-xl bg-muted/60 p-1">
              <TabsTrigger value="readings" className="text-xs rounded-lg">
                <Gauge className="h-3.5 w-3.5 me-1.5" />
                <span>{isRtl ? `القراءات (${readings.length})` : `Readings (${readings.length})`}</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs rounded-lg">
                <History className="h-3.5 w-3.5 me-1.5" />
                <span>{isRtl ? `الأداءات (${payments.length})` : `Payments (${payments.length})`}</span>
              </TabsTrigger>
            </TabsList>

            {/* Readings History */}
            <TabsContent value="readings" className="flex-1 overflow-y-auto mt-2 space-y-2 pe-1">
              {readings.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  {isRtl ? "لا توجد قراءات مسجلة بعد لهذا المنخرط" : "No readings recorded yet for this member"}
                </div>
              ) : (
                readings.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl border bg-card/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm">{r.month}</div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {r.previousIndex} ➔ {r.index} m³
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-cyan-600 dark:text-cyan-400">{r.consumption} m³</div>
                      <div className="text-[10px] text-muted-foreground">{isRtl ? "استهلاك" : "usage"}</div>
                    </div>
                    <div className="text-end">
                      <div className="font-bold text-sm">{formatCurrency(r.billAmount, locale)}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {centimesToMad(r.pricePerM3Applied)} DH/m³ + {centimesToMad(r.fixedFeeApplied)} DH
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Payments History */}
            <TabsContent value="payments" className="flex-1 overflow-y-auto mt-2 space-y-2 pe-1">
              {payments.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  {isRtl ? "لا توجد أداءات مسجلة بعد" : "No payments recorded yet"}
                </div>
              ) : (
                payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border bg-card/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        +{formatCurrency(p.amount, locale)}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{p.date}</span>
                      </div>
                    </div>
                    <div className="text-end flex items-center gap-2">
                      <div className="hidden sm:block text-[11px] font-mono text-muted-foreground">
                        {p.receiptNumber}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => openReceiptModal(p)}
                        title={isRtl ? "طباعة الوصل" : "Print Receipt"}
                      >
                        <Printer className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Footer Delete Action */}
          <div className="pt-2 border-t flex justify-between items-center text-xs">
            <span className="text-[11px] text-muted-foreground">
              {isRtl ? `تاريخ الانخراط: ${member.createdAt.substring(0, 10)}` : `Joined: ${member.createdAt.substring(0, 10)}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive hover:bg-destructive/10 h-8 px-2 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 me-1" />
              <span>{isRtl ? "حذف المنخرط" : "Delete"}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Delete Confirmation Dialog */}
      <AdminDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        requiredCode="admin"
        title={isRtl ? `حذف المنخرط: ${member.name}` : `Delete Member: ${member.name}`}
        description={
          isRtl
            ? `سيتم حذف المنخرط "${member.name}"، ورقم عداده (${member.meterNumber})، وجميع قراءاته وأداءاته نهائياً.`
            : `Permanently delete "${member.name}", meter (${member.meterNumber}), and all associated readings and payments.`
        }
        warningText={
          isRtl
            ? "تحذير: لا يمكن التراجع عن حذف المنخرط وسجلاته. يرجى إدخال رمز المشرف admin في الحقل أسفله لتأكيد الحذف:"
            : "Warning: Member deletion cannot be undone. Please type the admin code admin below to confirm:"
        }
        confirmButtonText={isRtl ? "تأكيد حذف المنخرط" : "Confirm Delete"}
        onConfirm={handleConfirmDelete}
      />

      {/* Printable Receipt Modal */}
      {selectedPaymentForReceipt && (
        <PrintableReceiptDialog
          open={receiptOpen}
          onOpenChange={setReceiptOpen}
          member={member}
          payment={selectedPaymentForReceipt}
          reading={lastReading}
          currentBalance={balance}
        />
      )}
    </>
  );
}
