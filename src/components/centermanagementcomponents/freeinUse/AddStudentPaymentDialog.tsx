/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/freelib/context/freeauthContext";
import { ReceiptType } from "@/freelib/dexie/dbSchema";
import {
  centerActions,
  receiptActions,
  studentActions,
  studentSubjectActions,
  subjectActions,
} from "@/freelib/dexie/freedexieaction";
import { checkPaymentStatus, PaymentStatus } from "@/freelib/payment-utils";
import { generateObjectId } from "@/freelib/utils/generateObjectId";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Loader2,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface StudentSubject {
  id: string;
  subject: { id: string; name: string; grade: string; price: number };
}

interface Student {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  grade: string | null;
  studentSubjects: StudentSubject[];
}

interface FormData {
  paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "CHECK" | "MOBILE_PAYMENT";
  description: string;
  date: string;
  selectedSubjects: string[];
}

interface AddStudentPaymentDialogProps {
  onPaymentCreated?: () => void;
  studentId?: string;
  trigger?: React.ReactNode;
}

// Step Indicator for mobile
const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const icons = [User, BookOpen, CreditCard];
  return (
    <div className="flex items-center justify-center gap-2 py-3 md:hidden">
      {Array.from({ length: totalSteps }, (_, i) => {
        const Icon = icons[i];
        const isActive = i + 1 === currentStep;
        const isCompleted = i + 1 < currentStep;
        return (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all ${isActive ? "bg-primary text-white scale-110" : isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${isCompleted ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function AddStudentPaymentDialog({
  onPaymentCreated,
  studentId,
  trigger,
}: AddStudentPaymentDialogProps) {
  const t = useTranslations("CreateStudentPaymentForm");
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const isSubmittingRef = useRef(false);
  const [studentPaymentStatus, setStudentPaymentStatus] =
    useState<PaymentStatus | null>(null);
  const [allReceipts, setAllReceipts] = useState<any[]>([]);
  const [centerSettings, setCenterSettings] = useState<{
    paymentStartDay: number;
    paymentEndDay: number;
  }>({ paymentStartDay: 1, paymentEndDay: 30 });

  const [formData, setFormData] = useState<FormData>({
    paymentMethod: "CASH",
    description: "",
    date: new Date().toISOString().split("T")[0],
    selectedSubjects: [],
  });

  useEffect(() => {
    if (!open) {
      setSelectedStudent(null);
      setSearchTerm("");
      setError("");
      setCurrentStep(1);
      setFormData({
        paymentMethod: "CASH",
        description: "",
        date: new Date().toISOString().split("T")[0],
        selectedSubjects: [],
      });
    }
  }, [open]);

  const fetchStudents = useCallback(async () => {
    try {
      const [
        allStudents,
        allStudentSubjects,
        allSubjects,
        receipts,
        allCenters,
      ] = await Promise.all([
        studentActions.getAll(),
        studentSubjectActions.getAll(),
        subjectActions.getAll(),
        receiptActions.getAll(),
        centerActions.getAll(),
      ]);

      // Store receipts and center settings for payment status calculation
      setAllReceipts(receipts);
      const currentCenter = allCenters[0];
      setCenterSettings({
        paymentStartDay: currentCenter?.paymentStartDay ?? 1,
        paymentEndDay: currentCenter?.paymentEndDay ?? 30,
      });
      if (!user) {
        setError("Unauthorized");
        setLoadingStudents(false);
        return;
      }
      const activeStudents = allStudents;
      const studentsWithSubjects: Student[] = activeStudents.map((student) => {
        const studentSubjectsForStudent = allStudentSubjects
          .filter((ss) => ss.studentId === student.id)
          .map((ss) => {
            const subject = allSubjects.find((s) => s.id === ss.subjectId);
            return subject
              ? {
                  id: ss.id,
                  subject: {
                    id: subject.id,
                    name: subject.name,
                    grade: subject.grade,
                    price: subject.price,
                  },
                }
              : null;
          })
          .filter((ss) => ss !== null) as StudentSubject[];
        return {
          id: student.id,
          name: student.name,
          email: student.email ?? null,
          phone: student.phone ?? null,
          parentName: student.parentName ?? null,
          parentPhone: student.parentPhone ?? null,
          grade: student.grade ?? null,
          studentSubjects: studentSubjectsForStudent,
        };
      });
      setStudents(studentsWithSubjects);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open, fetchStudents]);

  const calculateAmount = useCallback(() => {
    if (!selectedStudent) return 0;
    return selectedStudent.studentSubjects
      .filter((ss) => formData.selectedSubjects.includes(ss.subject.id))
      .reduce((total, ss) => total + ss.subject.price, 0);
  }, [selectedStudent, formData.selectedSubjects]);

  const totalAmount = calculateAmount();

  const handleSubjectToggle = useCallback((subjectId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
  }, []);

  const handleSelectAllSubjects = useCallback(() => {
    if (!selectedStudent) return;
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: selectedStudent.studentSubjects.map(
        (ss) => ss.subject.id,
      ),
    }));
  }, [selectedStudent]);

  const handleStudentSelect = useCallback(
    (student: Student) => {
      setSelectedStudent(student);
      setSearchTerm("");
      setFormData((prev) => ({
        ...prev,
        selectedSubjects: student.studentSubjects.map((ss) => ss.subject.id),
      }));

      // Calculate payment status for this student
      const studentReceipts = allReceipts.filter(
        (r) => r.studentId === student.id,
      );
      const totalFee = student.studentSubjects.reduce(
        (sum, ss) => sum + (ss.subject?.price ?? 0),
        0,
      );
      const status = checkPaymentStatus(
        studentReceipts,
        centerSettings.paymentStartDay,
        centerSettings.paymentEndDay,
        totalFee,
      );
      setStudentPaymentStatus(status);
    },
    [allReceipts, centerSettings],
  );

  useEffect(() => {
    if (open && studentId && students.length > 0 && !selectedStudent) {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        handleStudentSelect(student);
      }
    }
  }, [open, studentId, students, selectedStudent, handleStudentSelect]);

  const nextStep = () => {
    if (currentStep === 1 && !selectedStudent) {
      setError(t("findStudent"));
      return;
    }
    if (currentStep === 2 && formData.selectedSubjects.length === 0) {
      setError(t("errorSelectSubject"));
      return;
    }
    setError("");
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError("");
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Unified behavior: If not on final step, act as "Next"
      if (currentStep < totalSteps) {
        nextStep();
        return;
      }

      // Immediate guard - prevents double submission
      if (isSubmittingRef.current || isLoading) {
        console.warn("Student payment submission already in progress");
        return;
      }

      isSubmittingRef.current = true;
      setIsLoading(true);
      setError("");
      if (!user) {
        setError("Unauthorized");
        setIsLoading(false);
        isSubmittingRef.current = false;
        return;
      }
      try {
        if (!selectedStudent) throw new Error("Please select a student");
        if (formData.selectedSubjects.length === 0)
          throw new Error("Please select at least one subject");
        const allStudentSubjects = await studentSubjectActions.getAll();
        const allSubjects = await subjectActions.getAll();
        const studentSubjects = allStudentSubjects.filter(
          (ss) =>
            ss.studentId === selectedStudent.id &&
            formData.selectedSubjects.includes(ss.subjectId),
        );
        if (studentSubjects.length === 0)
          throw new Error("No valid subjects found");
        const total = studentSubjects.reduce((sum, ss) => {
          const subject = allSubjects.find((s) => s.id === ss.subjectId);
          return sum + (subject?.price || 0);
        }, 0);
        const subjectNames = studentSubjects
          .map((ss) => {
            const subject = allSubjects.find((s) => s.id === ss.subjectId);
            return subject?.name;
          })
          .filter(Boolean)
          .join(", ");
        const finalDescription = formData.description || `${subjectNames}`;
        const now = Date.now();
        const receiptId = generateObjectId();
        const receiptDate = formData.date
          ? new Date(formData.date).getTime()
          : now;
        const newReceipt = {
          id: receiptId,
          receiptNumber: `RCP-${now}`,
          amount: total,
          type: ReceiptType.STUDENT_PAYMENT,
          paymentMethod: formData.paymentMethod || undefined,
          description: finalDescription,
          date: receiptDate,
          studentId: selectedStudent.id,
          adminId: user.id,
          createdAt: now,
          updatedAt: now,
        };
        await receiptActions.putLocal(newReceipt);
        // Server sync removed in local-only mode
        toast.success(
          t("paymentCreatedSuccess") || "Payment created successfully!",
        );
        setOpen(false);
        onPaymentCreated?.();
        router.refresh();
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
    },
    [selectedStudent, formData, user, onPaymentCreated, currentStep],
  );

  const filteredStudents = students
    .filter((student) => {
      const search = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search) ||
        student.phone?.includes(search) ||
        student.grade?.toLowerCase().includes(search)
      );
    })
    .slice(0, 5);

  // Step 1: Student Selection
  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground hidden md:block">
        {t("findStudent")}
      </h3>
      {!selectedStudent ? (
        <>
          <div className="flex gap-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-10 md:h-9"
            />
          </div>
          <div className="border rounded-lg">
            {filteredStudents.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground p-4">
                {t("noStudentsFound")}
              </p>
            ) : (
              <div className="divide-y">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    className="w-full p-3 text-left hover:bg-muted transition-colors"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <p className="font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.email || student.phone || ""}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold text-lg">{selectedStudent.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedStudent.email || selectedStudent.phone}
              </p>
              {selectedStudent.grade && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedStudent.grade}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedStudent(null);
                setFormData((prev) => ({ ...prev, selectedSubjects: [] }));
                setStudentPaymentStatus(null);
              }}
            >
              {t("change")}
            </Button>
          </div>
          {/* Warning if student already paid */}
          {studentPaymentStatus?.status === "PAID" && (
            <Alert className="mt-3 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                {t("studentAlreadyPaid") ||
                  "This student has already paid for this billing period."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );

  // Step 2: Subject Selection
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-muted-foreground hidden md:block">
          {t("selectSubjects")}
        </h3>
        {selectedStudent && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAllSubjects}
          >
            {t("selectAll")}
          </Button>
        )}
      </div>
      {selectedStudent?.studentSubjects.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("noSubjects")}</AlertDescription>
        </Alert>
      ) : selectedStudent ? (
        <div className="space-y-2">
          {selectedStudent.studentSubjects.map((ss) => (
            <Card
              key={ss.id}
              onClick={() => handleSubjectToggle(ss.subject.id)}
              className={`cursor-pointer transition-colors ${formData.selectedSubjects.includes(ss.subject.id) ? "border-primary bg-primary/5" : "hover:border-gray-400"}`}
            >
              <CardContent className="p-3 sm:p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.selectedSubjects.includes(ss.subject.id)}
                    onChange={() => {}}
                    className="h-4 w-4 rounded"
                  />
                  <div>
                    <p className="font-semibold">{ss.subject.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ss.subject.grade}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  MAD {ss.subject.price.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("selectStudentFirst")}</p>
        </div>
      )}
      {formData.selectedSubjects.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t md:hidden">
          <span className="text-sm text-muted-foreground">
            {formData.selectedSubjects.length} {t("subjects")}
          </span>
          <span className="text-lg font-bold text-primary">
            MAD {totalAmount.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );

  // Step 3: Payment Details & Summary
  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground hidden md:block">
        {t("paymentDetails")}
      </h3>
      <div className="space-y-2">
        <Label htmlFor="paymentMethod" className="sr-only md:not-sr-only">
          {t("paymentMethod")}
        </Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              paymentMethod: value as FormData["paymentMethod"],
            }))
          }
        >
          <SelectTrigger id="paymentMethod" className="h-10 md:h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">{t("cash")}</SelectItem>
            <SelectItem value="CARD">{t("card")}</SelectItem>
            <SelectItem value="BANK_TRANSFER">{t("bankTransfer")}</SelectItem>
            <SelectItem value="CHECK">{t("check")}</SelectItem>
            <SelectItem value="MOBILE_PAYMENT">{t("mobilePayment")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date" className="sr-only md:not-sr-only">
          {t("date")}
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          className="h-10 md:h-9"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="sr-only md:not-sr-only">
          {t("description")}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder={t("descriptionPlaceholder")}
          rows={2}
        />
      </div>
      {selectedStudent && formData.selectedSubjects.length > 0 && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t("paymentSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("student")}:</span>
              <span className="font-medium">{selectedStudent.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("subjects")}:</span>
              <span className="font-medium">
                {formData.selectedSubjects.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("method")}:</span>
              <span className="font-medium">
                {
                  {
                    CASH: t("cash"),
                    CARD: t("card"),
                    BANK_TRANSFER: t("bankTransfer"),
                    CHECK: t("check"),
                    MOBILE_PAYMENT: t("mobilePayment"),
                  }[formData.paymentMethod]
                }
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">{t("total")}:</span>
              <span className="text-xl font-bold text-primary">
                MAD {totalAmount.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/45">
            {t("studentPayment") || "Student Payment"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] md:max-w-[900px] lg:max-w-[1000px] w-full max-h-[96vh] flex flex-col overflow-hidden p-1">
        <div className="p-4 sm:p-6 pb-2 sm:pb-3 border-b shrink-0">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription className="hidden md:block">
              {t("subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-2 sm:pt-3">
          {loadingStudents ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          ) : (
            <form
              id="add-payment-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex-1 space-y-4">
                {/* Unified Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1: Find Student */}
                  <Card
                    className={`border-0 shadow-none md:border md:shadow-sm ${currentStep !== 1 ? "hidden md:block" : ""}`}
                  >
                    <CardHeader className="hidden md:flex" />
                    <CardContent className="p-0 md:p-6">
                      {renderStep1()}
                    </CardContent>
                  </Card>

                  {/* Column 2: Select Subjects */}
                  <Card
                    className={`border-0 shadow-none md:border md:shadow-sm ${!selectedStudent ? "opacity-60 pointer-events-none" : ""} ${currentStep !== 2 ? "hidden md:block" : ""}`}
                  >
                    <CardHeader className="hidden md:flex">
                      {!selectedStudent && (
                        <CardDescription className="text-xs mt-1">
                          {t("selectStudentFirst")}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-0 md:p-6">
                      {renderStep2()}
                    </CardContent>
                  </Card>

                  {/* Column 3: Payment Details */}
                  <Card
                    className={`border-0 shadow-none md:border md:shadow-sm ${formData.selectedSubjects.length === 0 ? "opacity-60 pointer-events-none" : ""} ${currentStep !== 3 ? "hidden md:block" : ""}`}
                  >
                    <CardHeader className="hidden md:flex">
                      {formData.selectedSubjects.length === 0 && (
                        <CardDescription className="text-xs">
                          {t("selectSubjectsFirst")}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="p-0 md:p-6">
                      {renderStep3()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="p-4 sm:p-6 pt-2 sm:pt-3 border-t shrink-0 bg-muted/5">
          {/* Mobile Navigation */}
          <div className="flex justify-between gap-3 md:hidden">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? () => setOpen(false) : prevStep}
              disabled={isLoading}
              className="flex-1"
            >
              {currentStep === 1 ? t("cancel") : <>{t("previous")}</>}
            </Button>
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading || (currentStep === 1 && !selectedStudent)}
                className="flex-1"
              >
                {t("next")}
              </Button>
            ) : (
              <Button
                form="add-payment-form"
                type="submit"
                disabled={
                  isLoading ||
                  !selectedStudent ||
                  formData.selectedSubjects.length === 0 ||
                  studentPaymentStatus?.status === "PAID"
                }
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("createPayment")}
              </Button>
            )}
          </div>
          {/* Desktop Buttons */}
          <div className="hidden md:flex flex-col-reverse sm:flex-row justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              form="add-payment-form"
              type="submit"
              disabled={
                isLoading ||
                !selectedStudent ||
                formData.selectedSubjects.length === 0 ||
                studentPaymentStatus?.status === "PAID"
              }
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("createPayment")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
