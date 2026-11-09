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
import { AlertTriangle, Trash2 } from "lucide-react";

interface AdminDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  warningText?: string;
  requiredCode?: string;
  confirmButtonText?: string;
  onConfirm: () => Promise<void> | void;
}

export function AdminDeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  warningText,
  requiredCode = "admin",
  confirmButtonText,
  onConfirm,
}: AdminDeleteConfirmDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [inputCode, setInputCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setInputCode("");
      setIsSubmitting(false);
    }
  }, [open]);

  const isCodeMatch = inputCode.trim() === requiredCode;

  const handleConfirm = async () => {
    if (!isCodeMatch || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-6 rounded-2xl">
        <DialogHeader className="text-start space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black text-foreground">
                {title || (isRtl ? "تأكيد الحذف (مطلوب رمز المشرف)" : "Confirm Delete (Admin Code Required)")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {description ||
                  (isRtl
                    ? "هذا الإجراء نهائي ولا يمكن التراجع عنه."
                    : "This action is permanent and cannot be undone.")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Warning banner */}
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium leading-relaxed">
            {warningText ||
              (isRtl
                ? "تنبيه: لتفادي الحذف العرضي أو غير المصرح به، يرجى إدخال رمز المشرف (admin) لتأكيد العملية."
                : "Warning: To prevent accidental or unauthorized deletion, please enter the administrator code (admin) to confirm.")}
          </div>

          {/* Code input field */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-code-input" className="text-xs font-bold text-foreground">
              {isRtl ? (
                <span>
                  أدخل رمز المشرف: <code className="text-destructive font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-xs">{requiredCode}</code>
                </span>
              ) : (
                <span>
                  Enter admin code: <code className="text-destructive font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-xs">{requiredCode}</code>
                </span>
              )}
            </Label>
            <Input
              id="admin-code-input"
              type="text"
              autoFocus
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isCodeMatch) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              placeholder={isRtl ? `اكتب ${requiredCode} هنا...` : `Type ${requiredCode} here...`}
              className="h-10 text-sm font-mono border-destructive/30 focus-visible:ring-destructive"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold"
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={!isCodeMatch || isSubmitting}
            className="h-9 px-4 text-xs font-bold gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>
              {confirmButtonText || (isRtl ? "تأكيد الحذف" : "Confirm Delete")}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

