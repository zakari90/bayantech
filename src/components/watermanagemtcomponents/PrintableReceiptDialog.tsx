"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Member, Payment, Reading, WaterSettings } from "@/app/waterdexiedb/types";
import { getSettings } from "@/app/waterdexiedb/repositories/settingsRepo";
import { formatCurrency, centimesToMad } from "@/app/waterdexiedb/billing";
import { Printer, Check, Droplets, Share2 } from "lucide-react";

interface PrintableReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  payment?: Payment | null;
  reading?: Reading | null;
  currentBalance?: number;
}

export function PrintableReceiptDialog({
  open,
  onOpenChange,
  member,
  payment,
  reading,
  currentBalance = 0,
}: PrintableReceiptDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [settings, setSettings] = useState<WaterSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, [open]);

  const handlePrint = () => {
    window.print();
  };

  const receiptDate = payment?.date
    ? new Date(payment.date).toLocaleDateString(locale === "ar" ? "ar-MA" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString(locale === "ar" ? "ar-MA" : "en-US");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="text-start pb-2 border-b">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Printer className="h-4 w-4 text-primary" />
            <span>{isRtl ? "معاينة وطباعة الوصل" : "Receipt Preview & Print"}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto p-1">
          <div
            id="water-receipt-print-area"
            className="p-5 border-2 border-dashed border-border/80 rounded-xl bg-card text-card-foreground font-sans text-xs space-y-4 shadow-xs"
          >
            {/* Header */}
            <div className="text-center border-b pb-3 space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-foreground">
                <Droplets className="h-4 w-4 text-cyan-600 inline" />
                <span>{settings?.associationName || (isRtl ? "جمعية مستخدمي مياه الشرب" : "Water Association")}</span>
              </div>
              {settings?.villageName && (
                <div className="text-[11px] text-muted-foreground">{settings.villageName}</div>
              )}
              {settings?.creationDate && (
                <div className="text-[9px] text-muted-foreground/80">
                  {isRtl ? `مرجع التأسيس: ${settings.creationDate}` : `Ref Date: ${settings.creationDate}`}
                </div>
              )}
              <div className="text-sm font-black text-primary mt-1">
                {isRtl ? "وصل استخلاص واجبات استهلاك الماء" : "WATER CONSUMPTION PAYMENT RECEIPT"}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {payment?.receiptNumber || `REC-${Date.now().toString().slice(-6)}`}
              </div>
            </div>

            {/* Subscriber & Meter Info */}
            <div className="space-y-1.5 py-1 border-b pb-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? "اسم المنخرط:" : "Subscriber Name:"}</span>
                <span className="font-bold">{member.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? "رقم العداد:" : "Meter Number:"}</span>
                <span className="font-mono font-bold text-primary">{member.meterNumber}</span>
              </div>
              {member.sector && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRtl ? "الحي / القطاع:" : "Sector:"}</span>
                  <span>{member.sector}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? "تاريخ الأداء:" : "Payment Date:"}</span>
                <span>{receiptDate}</span>
              </div>
            </div>

            {/* Reading Details if available */}
            {reading && (
              <div className="space-y-1 py-1 border-b pb-3 bg-muted/20 p-2 rounded-lg">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{isRtl ? "شهر الاستهلاك:" : "Period:"}</span>
                  <span className="font-semibold">{reading.month}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{isRtl ? "السابق / الحالي:" : "Prev / Current Index:"}</span>
                  <span className="font-mono">{reading.previousIndex} m³ ➔ {reading.index} m³</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{isRtl ? "حجم الاستهلاك:" : "Consumption:"}</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{reading.consumption} m³</span>
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="space-y-2 py-1">
              <div className="flex justify-between items-center text-sm font-bold bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <span>{isRtl ? "المبلغ المستخلص المؤدى:" : "Amount Paid:"}</span>
                <span className="text-base font-black">
                  {payment ? formatCurrency(payment.amount, locale) : "0.00 درهم"}
                </span>
              </div>

              {currentBalance !== undefined && (
                <div className="flex justify-between text-[11px] px-1 text-muted-foreground">
                  <span>{isRtl ? "الرصيد المتبقي بذمته بعد هذا الأداء:" : "Remaining Balance:"}</span>
                  <span className={`font-bold ${currentBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {currentBalance === 0
                      ? isRtl ? "خالص تماماً ✓" : "Fully Settled ✓"
                      : formatCurrency(currentBalance, locale)}
                  </span>
                </div>
              )}
            </div>

            {/* Signatures */}
            <div className="pt-4 border-t flex justify-between text-[10px] text-muted-foreground">
              <div className="text-center">
                <p>{isRtl ? "توقيع المنخرط" : "Subscriber Signature"}</p>
                <div className="h-8"></div>
              </div>
              <div className="text-center">
                <p>{isRtl ? "توقيع وخاتم أمين المال" : "Treasurer Signature / Stamp"}</p>
                <div className="h-8"></div>
              </div>
            </div>

            <div className="text-center text-[9px] text-muted-foreground/60 pt-1">
              {isRtl ? "شكراً لكم على الحفاظ على الماء وترشيد استعماله" : "Thank you for saving water"}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-0 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl text-xs"
          >
            {isRtl ? "إغلاق" : "Close"}
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs gap-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>{isRtl ? "طباعة الوصل الآن" : "Print Receipt"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
