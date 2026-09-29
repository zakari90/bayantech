"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  MessageSquare,
  Database,
  UserCheck,
  Mail,
  ArrowLeft,
  Globe,
  CheckCircle2,
} from "lucide-react";

type Language = "en" | "fr" | "ar";

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<Language>("en");

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans"
    >
      {/* Ambient background lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight">
              BayanTech <span className="text-slate-500 font-normal">| بيان تك</span>
            </span>
          </Link>

          {/* Language Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                lang === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                lang === "fr"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Français
            </button>
            <button
              onClick={() => setLang("ar")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                lang === "ar"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title banner */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" />
            {lang === "en" && "Official Privacy Policy"}
            {lang === "fr" && "Politique de Confidentialité Officielle"}
            {lang === "ar" && "سياسة الخصوصية الرسمية"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            {lang === "en" && "Privacy Policy"}
            {lang === "fr" && "Politique de Confidentialité"}
            {lang === "ar" && "سياسة الخصوصية"}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            {lang === "en" &&
              "Last updated: September 29, 2026. This policy outlines how BayanTech collects, uses, protects, and handles your personal information."}
            {lang === "fr" &&
              "Dernière mise à jour : 29 septembre 2026. Cette politique décrit comment BayanTech recueille, utilise et protège vos informations personnelles."}
            {lang === "ar" &&
              "آخر تحديث: 29 سبتمبر 2026. توضح هذه الوثيقة كيفية جمع واستخدام وحماية معلوماتكم الشخصية في منصة بيان تك."}
          </p>
        </div>

        {/* English Content */}
        {lang === "en" && (
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                1. Overview & Service Scope
              </h2>
              <p className="text-sm sm:text-base">
                BayanTech (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides an educational center management
                software platform accessible via <strong className="text-white">bayyane.com</strong>. We are committed
                to safeguarding the privacy of students, teachers, parents, and administrative staff who use our platform.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                2. Information We Collect
              </h2>
              <p className="text-sm sm:text-base mb-3">
                When you use BayanTech or register for educational programs, we may collect the following personal details:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Student & Teacher full names</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Phone numbers & WhatsApp contacts</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Parent/Guardian contact information</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Academic level, grades & enrolled subjects</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Attendance records & payment receipt metadata</span>
                </li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                3. WhatsApp & Automated Communications
              </h2>
              <p className="text-sm sm:text-base mb-3">
                BayanTech integrates with the official <strong>Meta WhatsApp Business Cloud API</strong> to deliver essential
                operational updates. These notifications include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2 mb-3">
                <li>Confirmation of new student and teacher registrations.</li>
                <li>Instant administrative alerts to center managers when a new student enrolls.</li>
                <li>Digital payment receipts and invoices upon request.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-400">
                We never use WhatsApp for unsolicited marketing or spam. Messages are sent exclusively in connection
                with your active relationship with your learning center.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                4. Data Protection & Security
              </h2>
              <p className="text-sm sm:text-base mb-3">
                We employ industry-standard technical measures to protect your personal data:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2">
                <li>HTTPS / TLS 1.3 encryption in transit for all web and API communications.</li>
                <li>Role-Based Access Control (RBAC) restricting student data access strictly to authorized administrators.</li>
                <li>Secure database isolation and credential protection.</li>
                <li>We do not sell, rent, or trade your personal information to any third parties.</li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                5. User Rights & Data Deletion
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Under applicable privacy laws, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2">
                <li>Request access to your stored personal records.</li>
                <li>Correct inaccurate or outdated contact information.</li>
                <li>Request permanent deletion of your profile and data upon leaving the center.</li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                6. Contact Information
              </h2>
              <p className="text-sm sm:text-base mb-2">
                If you have questions regarding this Privacy Policy or wish to exercise your data rights, please contact us:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                <p><strong>Platform:</strong> BayanTech (bayyane.com)</p>
                <p><strong>Email:</strong> zakarizinedine@gmail.com</p>
                <p><strong>Support Phone:</strong> +212 768 276 772</p>
              </div>
            </section>
          </div>
        )}

        {/* French Content */}
        {lang === "fr" && (
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                1. Présentation et champ d&apos;application
              </h2>
              <p className="text-sm sm:text-base">
                BayanTech (&quot;nous&quot; ou &quot;notre&quot;) édite la plateforme de gestion des centres éducatifs accessible
                via <strong className="text-white">bayyane.com</strong>. Nous accordons une importance primordiale à la
                protection de la vie privée des étudiants, enseignants, parents et administrateurs.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                2. Données collectées
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Dans le cadre de l&apos;inscription et de la scolarité, nous collectons les informations suivantes :
              </p>
              <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nom et prénom des élèves et enseignants</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Numéros de téléphone & WhatsApp</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Coordonnées des parents / tuteurs</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Niveau scolaire et matières choisies</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Historique des paiements et reçus</span>
                </li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                3. Utilisation de WhatsApp et notifications
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Notre plateforme utilise l&apos;API officielle <strong>Meta WhatsApp Business Cloud API</strong> pour
                transmettre des notifications de service opérationnelles :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2 mb-3">
                <li>Confirmation d&apos;inscription pour les élèves et les enseignants.</li>
                <li>Notification immédiate à l&apos;administration lors d&apos;une nouvelle inscription.</li>
                <li>Envoi des reçus de paiement et alertes d&apos;absence.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-400">
                Nous ne diffusons aucun message publicitaire ou spam. Les messages sont strictement limités au suivi éducatif.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                4. Sécurité des données
              </h2>
              <p className="text-sm sm:text-base">
                Toutes les transmissions sont sécurisées par chiffrement HTTPS/TLS. Les accès sont strictement limités aux
                responsables pédagogiques habilités. Vos données ne sont en aucun cas vendues ni partagées à des fins commerciales.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                5. Contact
              </h2>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                <p><strong>Plateforme :</strong> BayanTech (bayyane.com)</p>
                <p><strong>Email :</strong> zakarizinedine@gmail.com</p>
                <p><strong>Téléphone :</strong> +212 768 276 772</p>
              </div>
            </section>
          </div>
        )}

        {/* Arabic Content */}
        {lang === "ar" && (
          <div className="space-y-8 text-slate-300 leading-relaxed text-right">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                1. نظرة عامة ونطاق الخدمة
              </h2>
              <p className="text-sm sm:text-base">
                تُدير منصة بيان تك (<strong className="text-white">bayyane.com</strong>) نظاماً رقمياً لإدارة مراكز الدعم
                التربوي والتعليمي. نلتزم بأقصى معايير حماية البيانات الشخصية للطلاب، أولياء الأمور، الأساتذة وإدارة المراكز.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <Database className="w-5 h-5 text-blue-400" />
                2. البيانات التي نجمعها
              </h2>
              <p className="text-sm sm:text-base mb-3">
                عند التسجيل أو استخدام المنصة، يتم جمع البيانات الضرورية للعملية التعليمية فقط:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>الاسم الكامل للطالب والأستاذ</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>رقم الهاتف والتواصل عبر واتساب</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>معلومات ولي الأمر (الاسم ورقم الهاتف)</span>
                </li>
                <li className="flex items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>المستوى الدراسي والمواد المسجلة</span>
                </li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                3. إشعارات تطبيق واتساب (WhatsApp)
              </h2>
              <p className="text-sm sm:text-base mb-3">
                تعتمد المنصة على واجهة برمجة التطبيقات الرسمية <strong>Meta WhatsApp Cloud API</strong> لإرسال الإشعارات
                الخدمية والتشغيلية حصراً:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mr-2 mb-3">
                <li>إشعار الإدارة فور تسجيل طالب أو أستاذ جديد.</li>
                <li>تأكيد التسجيل وإرسال إيصالات الأداء الشهرية لأولياء الأمور.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-400">
                لا نرسل أي رسائل دعائية أو غير مرغوب فيها، ولا نشارك أرقام الهواتف مع أي جهة خارجية.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <Lock className="w-5 h-5 text-blue-400" />
                4. حماية وأمن البيانات
              </h2>
              <p className="text-sm sm:text-base">
                يتم حماية جميع البيانات بتقنيات التشفير الحديثة (HTTPS / TLS). الوصول إلى سجلات الطلاب مقتصر على إدارة المركز
                المصرح لها فقط، ولا يتم بيع أو تأجير أي بيانات شخصية لأي طرف ثالث.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <Mail className="w-5 h-5 text-blue-400" />
                5. معلومات الاتصال
              </h2>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                <p><strong>المنصة:</strong> بيان تك (bayyane.com)</p>
                <p><strong>البريد الإلكتروني:</strong> zakarizinedine@gmail.com</p>
                <p><strong>الهاتف:</strong> 772 276 768 212+</p>
              </div>
            </section>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {lang === "en" && "Back to Home"}
              {lang === "fr" && "Retour à l'accueil"}
              {lang === "ar" && "العودة إلى الصفحة الرئيسية"}
            </span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} BayanTech. All rights reserved.
      </footer>
    </div>
  );
}
