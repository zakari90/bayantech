"use client";

import { useState } from "react";
import Link from "next/link";
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
  Layers,
  Server,
  HardDrive,
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
              "Last updated: September 29, 2026. This policy outlines how BayanTech operates across our Free and Pro editions, data collection practices, and user privacy."}
            {lang === "fr" &&
              "Dernière mise à jour : 29 septembre 2026. Cette politique détaille le fonctionnement de nos éditions Gratuite et Pro, la gestion des données et la protection de la vie privée."}
            {lang === "ar" &&
              "آخر تحديث: 29 سبتمبر 2026. توضح هذه الوثيقة سياسة الخصوصية عبر نسختنا المجانية والاحترافية، وكيفية التعامل مع البيانات ومسؤولية إدارتها."}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ENGLISH CONTENT */}
        {/* ========================================================================= */}
        {lang === "en" && (
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                1. Overview & Service Scope
              </h2>
              <p className="text-sm sm:text-base">
                BayanTech (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) provides an educational management platform accessible
                via <strong className="text-white">bayyane.com</strong>. We are committed to transparency and privacy for all
                learning centers, students, teachers, and parents.
              </p>
            </section>

            {/* Service Editions & Data Responsibility */}
            <section className="bg-linear-to-b from-blue-950/30 to-slate-900/60 border border-blue-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                2. Service Editions & Data Responsibility (Free vs. Pro)
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Free Edition */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base mb-2">
                    <HardDrive className="w-4 h-4" />
                    <span>Free Edition (Zero Data Collection)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3">
                    Our Free tier operates entirely on an <strong>offline-first local architecture</strong>:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>All student records, teacher schedules, and attendances are saved <strong>exclusively in your device&apos;s local browser storage (IndexedDB)</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>BayanTech does not collect, receive, or store any of your data</strong> on our remote servers in the Free version.</span>
                    </li>
                  </ul>
                </div>

                {/* Pro Edition */}
                <div className="bg-slate-950/70 border border-blue-500/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2">
                    <Server className="w-4 h-4" />
                    <span>Pro Edition (Dedicated Client Platforms)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3">
                    The current website acts as an interactive <strong>demonstration (demo)</strong> of the Pro system:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>When a client decides to subscribe, <strong>we publish and host an independent, dedicated website under their own name and custom domain</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Client Data Controller Responsibility:</strong> Once published, the client (center owner) acts as the sole <em>Data Controller</em> and is fully responsible for managing, protecting, and maintaining consent for their students&apos; and teachers&apos; data. BayanTech acts solely as the technical software provider.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                3. Information Collected in Pro Instances & Demo Registrations
              </h2>
              <p className="text-sm sm:text-base mb-3">
                In Pro demo testing or on dedicated client platforms, the following records may be processed:
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
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                4. WhatsApp & Automated Service Communications
              </h2>
              <p className="text-sm sm:text-base mb-3">
                BayanTech integrates with the official <strong>Meta WhatsApp Business Cloud API</strong> to deliver essential
                operational updates:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2 mb-3">
                <li>Instant administrative alerts to center managers when a new student or teacher registers.</li>
                <li>Registration receipts and administrative service confirmations.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-400">
                We strictly prohibit the use of WhatsApp for spam or advertising. Messages are strictly transactional and
                service-related.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                5. Data Security & Storage
              </h2>
              <p className="text-sm sm:text-base mb-3">
                We employ industry-standard technical measures:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2">
                <li>HTTPS / TLS 1.3 encryption in transit for all communications.</li>
                <li>Role-Based Access Control (RBAC) restricting student data access strictly to authenticated managers.</li>
                <li>We do not sell, rent, or trade your personal information to any third parties.</li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                6. User Rights & Data Deletion
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Under applicable privacy laws, users have the right to request access, correction, or permanent deletion of their data at any time.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                7. Contact Information
              </h2>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                <p><strong>Platform:</strong> BayanTech (bayyane.com)</p>
                <p><strong>Email:</strong> zakarizinedine@gmail.com</p>
                <p><strong>Support Phone:</strong> +212 768 276 772</p>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FRENCH CONTENT */}
        {/* ========================================================================= */}
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

            {/* Service Editions & Data Responsibility */}
            <section className="bg-linear-to-b from-blue-950/30 to-slate-900/60 border border-blue-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                2. Éditions du Service et Responsabilité des Données (Gratuit vs. Pro)
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Free Edition */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base mb-2">
                    <HardDrive className="w-4 h-4" />
                    <span>Version Gratuite (Zéro Collecte de Données)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3">
                    Notre version gratuite fonctionne sur une <strong>architecture locale hors-ligne (offline-first)</strong> :
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Toutes les données relatives aux élèves, plannings et présences sont stockées <strong>exclusivement dans la mémoire locale de votre navigateur (IndexedDB)</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>BayanTech ne collecte, ne stocke et ne transmet aucune donnée</strong> vers ses serveurs dans la version gratuite.</span>
                    </li>
                  </ul>
                </div>

                {/* Pro Edition */}
                <div className="bg-slate-950/70 border border-blue-500/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2">
                    <Server className="w-4 h-4" />
                    <span>Version Pro (Démonstration & Sites Dédiés)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3">
                    Le site actuel sert de <strong>version de démonstration (démo)</strong> du système Pro :
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>Lorsqu&apos;un client choisit d&apos;adopter la solution Pro, <strong>nous déployons et publions un site web indépendant dédié au nom de son centre et sous son propre nom de domaine</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Responsabilité Légale du Client :</strong> Une fois la plateforme déployée, le client (centre éducatif) agit en qualité de <em>Responsable du Traitement</em> légal et assume la responsabilité pleine et entière des données de ses élèves et enseignants. BayanTech intervient uniquement comme éditeur et prestataire technique.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                3. Données traitées dans les instances Pro
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Dans le cadre des inscriptions et de la scolarité, les informations suivantes peuvent être traitées :
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
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                4. Utilisation de WhatsApp et notifications
              </h2>
              <p className="text-sm sm:text-base mb-3">
                Notre plateforme utilise l&apos;API officielle <strong>Meta WhatsApp Business Cloud API</strong> pour
                transmettre des alertes de service opérationnelles :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 ml-2 mb-3">
                <li>Alerte administrative instantanée aux gestionnaires lors d&apos;une nouvelle inscription.</li>
                <li>Envoi des confirmations d&apos;inscription et reçus.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-400">
                Nous ne diffusons aucun message publicitaire ou spam. Les messages sont strictement limités au suivi du service.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                5. Sécurité des données
              </h2>
              <p className="text-sm sm:text-base">
                Toutes les transmissions sont sécurisées par chiffrement HTTPS/TLS. Les accès sont strictement limités aux
                responsables habilités. Vos données ne sont en aucun cas vendues ni partagées à des fins commerciales.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                6. Contact
              </h2>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                <p><strong>Plateforme :</strong> BayanTech (bayyane.com)</p>
                <p><strong>Email :</strong> zakarizinedine@gmail.com</p>
                <p><strong>Téléphone :</strong> +212 768 276 772</p>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ARABIC CONTENT */}
        {/* ========================================================================= */}
        {lang === "ar" && (
          <div className="space-y-8 text-slate-300 leading-relaxed text-right">
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                1. نظرة عامة ونطاق الخدمة
              </h2>
              <p className="text-sm sm:text-base">
                تُدير منصة بيان تك (<strong className="text-white">bayyane.com</strong>) نظاماً رقمياً لإدارة مراكز الدعم
                التربوي والتعليمي. نلتزم بالشفافية التامة وحماية خصوصية بيانات الطلاب، أولياء الأمور، الأساتذة وإدارات المراكز.
              </p>
            </section>

            {/* Service Editions & Data Responsibility */}
            <section className="bg-linear-to-b from-blue-950/30 to-slate-900/60 border border-blue-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 justify-start">
                <Layers className="w-5 h-5 text-blue-400" />
                2. إصدارات النظام ومسؤولية إدارة البيانات (النسخة المجانية مقابل النسخة الاحترافية Pro)
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-4 text-right">
                {/* Free Edition */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-base mb-2 justify-start">
                    <HardDrive className="w-4 h-4" />
                    <span>النسخة المجانية (بدون جمع أي بيانات إطلاقاً)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3">
                    تعمل نسختنا المجانية بنظام <strong>التخزين المحلي المستقل (Offline-First)</strong>:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>تُحفظ كافة بيانات الطلاب والأساتذة والحصص <strong>حصراً على الذاكرة المحلية لمتصفح المستخدم (IndexedDB)</strong> على جهازه الخاص.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>لا تقوم بيان تك بجمع أو استقبال أو تخزين أي بيانات</strong> على خوادمها المركزية في النسخة المجانية.</span>
                    </li>
                  </ul>
                </div>

                {/* Pro Edition */}
                <div className="bg-slate-950/70 border border-blue-500/30 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-base mb-2 justify-start">
                    <Server className="w-4 h-4" />
                    <span>النسخة الاحترافية Pro (النسخة التجريبية والمواقع المخصصة)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-3">
                    الموقع الحالي يُقدم <strong>نسخة تجريبية (Demo)</strong> لميزات النظام الاحترافي:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>عند رغبة العميل (مركز الدعم أو المؤسسة) في اعتماد النظام الاحترافي، <strong>نقوم بنشر موقع ونظام سحابي مستقل ومخصص بالكامل باسم المركز وعلامته التجارية ورابطه الخاص</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>المسؤولية القانونية الحصرية للعميل:</strong> يُعد المركز التعليمي هو <em>المتحكم الحصري والمسؤول القانوني</em> عن جمع وحفظ وحماية بيانات طلابه وأساتذته، بينما ينحصر دور بيان تك في توفير التطوير التقني والبنية التحتية البرمجية فقط.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <Database className="w-5 h-5 text-blue-400" />
                3. البيانات التي يتم التعامل معها في النسخ المخصصة
              </h2>
              <p className="text-sm sm:text-base mb-3">
                في النسخ السحابية المخصصة للمراكز، يتم تسجيل البيانات الضرورية للعملية التعليمية:
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
                4. إشعارات تطبيق واتساب (WhatsApp)
              </h2>
              <p className="text-sm sm:text-base mb-3">
                تعتمد المنصة على واجهة برمجة التطبيقات الرسمية <strong>Meta WhatsApp Cloud API</strong> لإرسال الإشعارات
                الخدمية والتشغيلية حصراً:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mr-2 mb-3">
                <li>إشعار الإدارة فور تسجيل طالب أو أستاذ جديد.</li>
                <li>تأكيد التسجيل وإرسال الإشعارات التشغيلية للطلاب.</li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-400">
                لا نرسل أي رسائل دعائية أو غير مرغوب فيها، ولا نشارك أرقام الهواتف مع أي جهة خارجية.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <Lock className="w-5 h-5 text-blue-400" />
                5. حماية وأمن البيانات
              </h2>
              <p className="text-sm sm:text-base">
                يتم حماية جميع البيانات بتقنيات التشفير الحديثة (HTTPS / TLS). الوصول إلى سجلات الطلاب مقتصر على إدارة المركز
                المصرح لها فقط، ولا يتم بيع أو تأجير أي بيانات شخصية لأي طرف ثالث.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-start">
                <Mail className="w-5 h-5 text-blue-400" />
                6. معلومات الاتصال
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
