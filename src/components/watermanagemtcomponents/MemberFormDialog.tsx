"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Member } from "@/app/waterdexiedb/types";
import { addMember, updateMember } from "@/app/waterdexiedb/repositories/membersRepo";
import { toast } from "sonner";
import { UserCheck, UserPlus } from "lucide-react";

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberToEdit?: Member | null;
  onSaved: () => void;
}

export function MemberFormDialog({
  open,
  onOpenChange,
  memberToEdit,
  onSaved,
}: MemberFormDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [name, setName] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [startIndex, setStartIndex] = useState("0");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setMeterNumber(memberToEdit.meterNumber);
      setStartIndex(String(memberToEdit.startIndex || 0));
      setPhone(memberToEdit.phone || "");
      setSector(memberToEdit.sector || "");
      setNotes(memberToEdit.notes || "");
      setActive(memberToEdit.active ?? true);
      setErrors({});
    } else {
      setName("");
      setMeterNumber("");
      setStartIndex("0");
      setPhone("");
      setSector("");
      setNotes("");
      setActive(true);
      setErrors({});
    }
  }, [memberToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = isRtl ? "الاسم الكامل مطلوب (حرفين على الأقل)" : "Full name is required (min 2 characters)";
    }
    if (!meterNumber.trim()) {
      newErrors.meterNumber = isRtl ? "رقم العداد مطلوب" : "Meter number is required";
    }
    const parsedStart = parseFloat(startIndex);
    if (isNaN(parsedStart) || parsedStart < 0) {
      newErrors.startIndex = isRtl ? "بداية العداد يجب أن تكون 0 أو أكثر" : "Starting index must be >= 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      if (memberToEdit) {
        await updateMember(memberToEdit.id, {
          name: name.trim(),
          meterNumber: meterNumber.trim(),
          startIndex: parsedStart,
          phone: phone.trim(),
          sector: sector.trim() || undefined,
          notes: notes.trim() || undefined,
          active,
        });
        toast.success(isRtl ? "تم تعديل بيانات المنخرط بنجاح" : "Member updated successfully");
      } else {
        await addMember({
          name: name.trim(),
          meterNumber: meterNumber.trim(),
          startIndex: parsedStart,
          phone: phone.trim(),
          sector: sector.trim() || undefined,
          notes: notes.trim() || undefined,
          active,
        });
        toast.success(isRtl ? "تمت إضافة المنخرط بنجاح" : "Member added successfully");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء الحفظ" : "Failed to save member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="text-start pb-2 border-b">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            {memberToEdit ? (
              <UserCheck className="h-5 w-5 text-blue-600" />
            ) : (
              <UserPlus className="h-5 w-5 text-cyan-600" />
            )}
            <span>
              {memberToEdit
                ? isRtl
                  ? "تعديل بيانات المنخرط"
                  : "Edit Member"
                : isRtl
                ? "إضافة منخرط جديد"
                : "Add New Member"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isRtl
              ? "أدخل بيانات العداد واسم المستفيد لتتبع استهلاك الماء"
              : "Enter meter and subscriber information to track water billing"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="mem-name" className="text-xs font-semibold">
              {isRtl ? "الاسم الكامل للمنخرط" : "Full Name"} *
            </Label>
            <Input
              id="mem-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder={isRtl ? "مثال: عبد الله أيت سعيد" : "e.g. Abdellah Ait Said"}
              className="h-10 text-sm"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">{errors.name}</p>
            )}
          </div>

          {/* Meter Number & Starting Index */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="mem-meter" className="text-xs font-semibold">
                {isRtl ? "رقم العداد" : "Meter No"} *
              </Label>
              <Input
                id="mem-meter"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value);
                  if (errors.meterNumber) setErrors((prev) => ({ ...prev, meterNumber: "" }));
                }}
                placeholder={isRtl ? "A-12" : "M-01"}
                className="h-10 text-sm font-semibold"
              />
              {errors.meterNumber && (
                <p className="text-[11px] text-destructive font-medium">{errors.meterNumber}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mem-start" className="text-xs font-semibold">
                {isRtl ? "بداية العداد (m³)" : "Start Index (m³)"} *
              </Label>
              <Input
                id="mem-start"
                type="number"
                min="0"
                inputMode="decimal"
                value={startIndex}
                onChange={(e) => {
                  setStartIndex(e.target.value);
                  if (errors.startIndex) setErrors((prev) => ({ ...prev, startIndex: "" }));
                }}
                className="h-10 text-sm font-semibold"
              />
              {errors.startIndex && (
                <p className="text-[11px] text-destructive font-medium">{errors.startIndex}</p>
              )}
            </div>
          </div>

          {/* Phone & Sector */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="mem-phone" className="text-xs font-semibold">
                {isRtl ? "رقم الهاتف" : "Phone"}
              </Label>
              <Input
                id="mem-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0612345678"
                className="h-10 text-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mem-sector" className="text-xs font-semibold">
                {isRtl ? "الحي / القطاع" : "Sector / Douar"}
              </Label>
              <Input
                id="mem-sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder={isRtl ? "الحي الفوقاني" : "Sector A"}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
            <div>
              <div className="text-xs font-semibold">{isRtl ? "حالة الاشتراك" : "Subscription Status"}</div>
              <div className="text-[11px] text-muted-foreground">
                {active
                  ? isRtl ? "نشط (يتم تسجيل قراءاته شهرياً)" : "Active (included in monthly readings)"
                  : isRtl ? "معطل مؤقتاً" : "Inactive"}
              </div>
            </div>
            <Switch
              checked={active}
              onCheckedChange={setActive}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="mem-notes" className="text-xs font-semibold">
              {isRtl ? "ملاحظات إضافية" : "Notes"}
            </Label>
            <Textarea
              id="mem-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder={isRtl ? "أي معلومات إضافية..." : "Any additional notes..."}
              className="text-xs resize-none"
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
              className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              {memberToEdit
                ? isRtl ? "حفظ التعديلات" : "Save Changes"
                : isRtl ? "إضافة المنخرط" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
