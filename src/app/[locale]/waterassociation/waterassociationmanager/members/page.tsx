"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Droplets,
  CreditCard,
  MessageCircle,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberDetailDialog } from "@/components/watermanagemtcomponents/MemberDetailDialog";
import { MemberFormDialog } from "@/components/watermanagemtcomponents/MemberFormDialog";
import { PaymentFormDialog } from "@/components/watermanagemtcomponents/PaymentFormDialog";
import {
  getAllMembersSummaries,
  formatCurrency,
  centimesToMad,
  generateWhatsAppReminderUrl,
  getSettings,
} from "@/app/waterdexiedb";
import { MemberFinancialSummary, Member, Payment, WaterSettings } from "@/app/waterdexiedb/types";
import { toast } from "sonner";

export default function MembersListPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [summaries, setSummaries] = useState<MemberFinancialSummary[]>([]);
  const [settings, setSettings] = useState<WaterSettings | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "debt" | "clean">("all");
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMemberId, setPaymentMemberId] = useState<string | undefined>(undefined);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sums, setts] = await Promise.all([
        getAllMembersSummaries(),
        getSettings(),
      ]);
      setSummaries(sums);
      setSettings(setts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered members
  const filteredSummaries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return summaries.filter((s) => {
      // Search match
      const matchSearch =
        !q ||
        s.member.name.toLowerCase().includes(q) ||
        s.member.meterNumber.toLowerCase().includes(q) ||
        (s.member.phone && s.member.phone.includes(q)) ||
        (s.member.sector && s.member.sector.toLowerCase().includes(q));

      if (!matchSearch) return false;

      // Status filter
      if (filter === "debt") return s.balance > 0;
      if (filter === "clean") return s.balance <= 0;
      return true;
    });
  }, [summaries, search, filter]);

  const debtCount = summaries.filter((s) => s.balance > 0).length;
  const cleanCount = summaries.filter((s) => s.balance <= 0).length;

  const handleOpenDetail = (id: string) => {
    setSelectedMemberId(id);
    setDetailOpen(true);
  };

  const handleEdit = (m: Member) => {
    setMemberToEdit(m);
    setFormOpen(true);
  };

  const handleCollect = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    setPaymentMemberId(memberId);
    setPaymentOpen(true);
  };

  const handleWhatsApp = (e: React.MouseEvent, s: MemberFinancialSummary) => {
    e.stopPropagation();
    if (!s.member.phone) {
      toast.error(isRtl ? "لا يوجد رقم هاتف مسجل لهذا المنخرط" : "No phone number registered");
      return;
    }
    const url = generateWhatsAppReminderUrl({
      phone: s.member.phone,
      memberName: s.member.name,
      meterNumber: s.member.meterNumber,
      associationName: settings?.associationName || "جمعية الماء",
      month: s.lastReading?.month || new Date().toISOString().substring(0, 7),
      consumptionM3: s.lastReading?.consumption,
      currentBillMAD: s.lastReading ? centimesToMad(s.lastReading.billAmount) : undefined,
      totalDueMAD: Math.max(0, centimesToMad(s.balance)),
      locale,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>{isRtl ? "سجل المنخرطين والعدادات" : "Subscribers & Meters"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isRtl
              ? `إجمالي ${summaries.length} منخرط مسجل في الجمعية`
              : `Total of ${summaries.length} subscribers registered`}
          </p>
        </div>

        <Button
          onClick={() => {
            setMemberToEdit(null);
            setFormOpen(true);
          }}
          className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>{isRtl ? "إضافة منخرط جديد" : "Add New Member"}</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRtl ? "ابحث بالاسم، رقم العداد (A-01)، أو رقم الهاتف..." : "Search by name, meter no, or phone..."}
          className="ps-9 h-11 rounded-xl text-sm bg-card border-border shadow-2xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="h-8 rounded-full text-xs font-semibold px-3"
        >
          {isRtl ? `الجميع (${summaries.length})` : `All (${summaries.length})`}
        </Button>

        <Button
          size="sm"
          variant={filter === "debt" ? "default" : "outline"}
          onClick={() => setFilter("debt")}
          className={`h-8 rounded-full text-xs font-semibold px-3 ${
            filter === "debt"
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
          }`}
        >
          <AlertCircle className="h-3.5 w-3.5 me-1" />
          <span>{isRtl ? `مدينون (${debtCount})` : `In Debt (${debtCount})`}</span>
        </Button>

        <Button
          size="sm"
          variant={filter === "clean" ? "default" : "outline"}
          onClick={() => setFilter("clean")}
          className={`h-8 rounded-full text-xs font-semibold px-3 ${
            filter === "clean"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 me-1" />
          <span>{isRtl ? `خالصون (${cleanCount})` : `Paid Up (${cleanCount})`}</span>
        </Button>
      </div>

      {/* Members Grid / List */}
      {filteredSummaries.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-card">
          <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <h3 className="font-bold text-sm text-foreground">
            {isRtl ? "لم يتم العثور على أي منخرط" : "No members found"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {search
              ? isRtl ? "جرب البحث بكلمة أخرى" : "Try a different search query"
              : isRtl ? "ابدأ بإضافة أول منخرط للجمعية" : "Start by adding your first member"}
          </p>
          {!search && (
            <Button
              onClick={() => {
                setMemberToEdit(null);
                setFormOpen(true);
              }}
              className="mt-4 h-9 rounded-xl text-xs font-bold"
            >
              <UserPlus className="h-3.5 w-3.5 me-1" />
              <span>{isRtl ? "إضافة أول منخرط" : "Add First Member"}</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSummaries.map((item) => (
            <div
              key={item.member.id}
              onClick={() => handleOpenDetail(item.member.id)}
              className="p-3.5 rounded-2xl border bg-card hover:bg-muted/40 transition-all flex flex-col justify-between gap-3 cursor-pointer shadow-2xs group relative"
            >
              {/* Top Row: Name, Meter badge, and Balance Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                    {item.member.meterNumber}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {item.member.name}
                    </h3>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      {item.member.sector && <span>{item.member.sector}</span>}
                      {item.member.phone && (
                        <span className="font-mono flex items-center gap-0.5">
                          <Phone className="h-2.5 w-2.5" />
                          {item.member.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-end">
                  {item.balance > 0 ? (
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold text-xs py-0.5">
                      {formatCurrency(item.balance, locale)}
                    </Badge>
                  ) : item.balance === 0 ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold text-xs py-0.5">
                      {isRtl ? "خالص ✓" : "Paid ✓"}
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold text-xs py-0.5">
                      +{formatCurrency(Math.abs(item.balance), locale)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Bottom Row: Last Reading info and Action shortcuts */}
              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Droplets className="h-3 w-3 text-cyan-600" />
                  <span>
                    {item.lastReading
                      ? `${item.lastReading.month}: ${item.lastReading.index} m³ (${item.lastReading.consumption} m³)`
                      : isRtl
                      ? `البداية: ${item.member.startIndex} m³`
                      : `Start: ${item.member.startIndex} m³`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {item.balance > 0 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-500/10"
                      onClick={(e) => handleWhatsApp(e, item)}
                      title={isRtl ? "تذكير عبر واتساب" : "WhatsApp reminder"}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                    onClick={(e) => handleCollect(e, item.member.id)}
                  >
                    <CreditCard className="h-3 w-3 me-1" />
                    <span>{isRtl ? "استخلاص" : "Pay"}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Detail Dialog */}
      <MemberDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        memberId={selectedMemberId}
        onEditMember={handleEdit}
        onRecordPayment={(id) => {
          setPaymentMemberId(id);
          setPaymentOpen(true);
        }}
        onMemberDeleted={loadData}
      />

      {/* Add / Edit Form Dialog */}
      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        memberToEdit={memberToEdit}
        onSaved={loadData}
      />

      {/* Payment Dialog */}
      <PaymentFormDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        preSelectedMemberId={paymentMemberId}
        onPaymentRecorded={() => loadData()}
      />
    </div>
  );
}
