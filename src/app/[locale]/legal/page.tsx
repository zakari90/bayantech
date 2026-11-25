"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import MarketingFooter from "@/components/MarketingFooter";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  FileText,
  Globe,
  HardDrive,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";

const LEGAL_COPY = {
  en: {
    badge: "Legal Notice & Terms of Use",
    title: "Legal Information & Terms",
    subtitle:
      "Transparent legal terms, data sovereignty commitments, and global privacy principles governing Bayyane digital solutions.",
    lastUpdated: "Last updated: November 2026",
    backHome: "Back to Home",
    privacyLink: "Read Privacy Policy",
    sections: [
      {
        icon: "scale",
        title: "1. Publisher & Service Operator",
        body: [
          "This platform and its software solutions are developed and operated under the name Bayyane, an independent digital solutions initiative based in Salé, Morocco.",
          "Bayyane provides browser-based, offline-first, and cloud-assisted software tools for organizations, businesses, and community associations worldwide.",
          "For any legal, compliance, or data-protection inquiry, please contact us directly at: bayyanedigital@gmail.com.",
        ],
      },
      {
        icon: "file",
        title: "2. Terms of Use",
        body: [
          "By accessing or using any Bayyane application (including free offline editions, instant tools, or cloud/pro portals), you agree to use the software lawfully and in good faith.",
          "You may not attempt to reverse-engineer, disrupt, overload, or gain unauthorized access to any hosted infrastructure, APIs, or other users' accounts.",
          "Software is provided on an \"as-is\" and \"as-available\" basis. While we strive for maximum reliability, Bayyane is not liable for indirect damages, data loss caused by clearing browser storage in local-only editions, or external service interruptions.",
        ],
      },
      {
        icon: "harddrive",
        title: "3. Local-First Data Ownership & Backups",
        body: [
          "All data you enter into Bayyane applications remains 100% your property. In our offline-first / local editions, records are stored directly on your device (via browser IndexedDB) and are never transmitted to our servers.",
          "Because local data resides solely on your device, you are responsible for exporting and safeguarding regular backups using the built-in backup/export tools.",
        ],
      },
      {
        icon: "globe",
        title: "4. Global Privacy & Data Protection Alignment (GDPR & International)",
        body: [
          "Bayyane is designed around privacy-by-default principles aligned with international standards (including EU GDPR principles, Moroccan Law 09-08, and similar global frameworks):",
          "• Data Minimization: Offline editions collect zero personal data on our servers. Hosted/Pro editions process only the account and operational data strictly necessary to deliver the service.",
          "• User Rights: For any hosted account data, you have the right to request access, correction, export, or deletion at any time by contacting bayyanedigital@gmail.com.",
          "• Cookies & Local Storage: We use only essential technical storage (such as language preference and offline application cache) and do not sell your data or run invasive third-party advertising trackers.",
        ],
      },
      {
        icon: "shield",
        title: "5. Intellectual Property",
        body: [
          "All Bayyane branding, logos, interface designs, source code, and documentation are the intellectual property of Bayyane. You are granted a non-exclusive, revocable right to use the software for your organization's internal operations.",
        ],
      },
    ],
    contactTitle: "Legal & Compliance Contact",
    contactText:
      "Have a question about these terms, data deletion, or international compliance?",
  },
  fr: {
    badge: "Mentions Légales & Conditions d'Utilisation",
    title: "Informations Légales & CGU",
    subtitle:
      "Conditions d'utilisation transparentes, souveraineté des données et principes internationaux de confidentialité pour les solutions Bayyane.",
    lastUpdated: "Dernière mise à jour : Novembre 2026",
    backHome: "Retour à l'accueil",
    privacyLink: "Consulter la Politique de Confidentialité",
    sections: [
      {
        icon: "scale",
        title: "1. Éditeur & Opérateur du Service",
        body: [
          "Cette plateforme et ses solutions logicielles sont développées et exploitées sous le nom Bayyane, une initiative indépendante de solutions digitales basée à Salé, Maroc.",
          "Bayyane propose des outils logiciels hors-ligne et cloud destinés aux organisations, entreprises et associations dans le monde entier.",
          "Pour toute demande légale, de conformité ou relative à la protection des données, contactez-nous à : bayyanedigital@gmail.com.",
        ],
      },
      {
        icon: "file",
        title: "2. Conditions Générales d'Utilisation",
        body: [
          "En accédant à une application Bayyane (éditions gratuites hors-ligne, outils instantanés ou portails Pro), vous acceptez d'utiliser le service de manière légale et loyale.",
          "Il est interdit de tenter de contourner la sécurité, de perturber l'infrastructure ou d'accéder sans autorisation aux données d'autres utilisateurs.",
          "Le logiciel est fourni « en l'état ». Bien que nous visions une fiabilité maximale, Bayyane ne saurait être tenu responsable des dommages indirects ou d'une perte de données locale liée à la suppression du cache du navigateur.",
        ],
      },
      {
        icon: "harddrive",
        title: "3. Propriété des Données & Sauvegardes",
        body: [
          "Toutes les données saisies dans les applications Bayyane restent à 100% votre propriété. Dans nos éditions locales hors-ligne, les données sont stockées uniquement sur votre appareil (IndexedDB) sans envoi vers nos serveurs.",
          "Les données locales restant sur votre appareil, il vous appartient d'effectuer des sauvegardes régulières via les fonctions d'exportation intégrées.",
        ],
      },
      {
        icon: "globe",
        title: "4. Conformité Internationale & Confidentialité (RGPD / Monde)",
        body: [
          "Bayyane respecte les principes internationaux de protection des données (principes du RGPD européen, loi marocaine 09-08 et standards internationaux) :",
          "• Minimisation des données : Les éditions hors-ligne ne collectent aucune donnée personnelle sur nos serveurs. Les éditions Cloud/Pro ne traitent que les données strictement nécessaires au service.",
          "• Droits des utilisateurs : Pour toute donnée hébergée, vous disposez d'un droit d'accès, de rectification, d'exportation et de suppression via bayyanedigital@gmail.com.",
          "• Stockage technique : Seuls des stockages techniques essentiels (langue, cache hors-ligne) sont utilisés, sans vente de données ni traceurs publicitaires intrusifs.",
        ],
      },
      {
        icon: "shield",
        title: "5. Propriété Intellectuelle",
        body: [
          "La marque Bayyane, les logos, interfaces, codes sources et documentations sont la propriété intellectuelle de Bayyane. Un droit d'utilisation non exclusif vous est accordé pour vos opérations internes.",
        ],
      },
    ],
    contactTitle: "Contact Légal & Conformité",
    contactText:
      "Une question sur ces conditions, la suppression de données ou la conformité ?",
  },
  ar: {
    badge: "الإشعار القانوني وشروط الاستخدام",
    title: "المعلومات القانونية والشروط",
    subtitle:
      "شروط استخدام واضحة، التزام كامل بسيادة البيانات، ومبادئ حماية الخصوصية المعتمدة عالمياً لخدمات بيان.",
    lastUpdated: "آخر تحديث: نوفمبر 2026",
    backHome: "العودة للرئيسية",
    privacyLink: "قراءة سياسة الخصوصية",
    sections: [
      {
        icon: "scale",
        title: "1. الجهة المشغلة للخدمة",
        body: [
          "يتم تطوير وتشغيل هذه المنصة وحلولها البرمجية تحت اسم «بيان» (Bayyane)، وهي مبادرة مستقلة للحلول الرقمية مقرها في سلا، المغرب.",
          "توفر بيان برمجيات تعمل دون إنترنت وأنظمة سحابية للمؤسسات والشركات والجمعيات في مختلف دول العالم.",
          "لأي استفسار قانوني أو متعلق بحماية البيانات، يمكنكم التواصل معنا مباشرة عبر البريد: bayyanedigital@gmail.com.",
        ],
      },
      {
        icon: "file",
        title: "2. شروط الاستخدام",
        body: [
          "باستخدامك لأي تطبيق من تطبيقات بيان (النسخ المجانية دون إنترنت، الأدوات الفورية، أو بوابات Pro)، فإنك توافق على استخدامه بشكل قانوني وسليم.",
          "يُمنع محاولة اختراق أو تعطيل الخوادم أو الوصول غير المصرح به إلى بيانات المستخدمين الآخرين.",
          "تُقدَّم البرمجيات «كما هي» وحسب التوفر. ورغم حرصنا على أعلى مستويات الموثوقية، لا تتحمل بيان مسؤولية الأضرار غير المباشرة أو فقدان البيانات المحلية الناتج عن مسح بيانات المتصفح.",
        ],
      },
      {
        icon: "harddrive",
        title: "3. ملكية البيانات والنسخ الاحتياطي",
        body: [
          "تظل جميع البيانات التي تدخلها في تطبيقات بيان ملكاً لك بنسبة 100%. في النسخ المحلية التي تعمل دون إنترنت، تُحفظ البيانات مباشرة على جهازك (عبر IndexedDB) ولا تُرسل إلى خوادمنا.",
          "نظراً لبقاء البيانات المحلية على جهازك فقط، تقع على عاتقك مسؤولية أخذ نسخ احتياطية دورية باستخدام أدوات التصدير المدمجة.",
        ],
      },
      {
        icon: "globe",
        title: "4. التوافق مع قوانين الخصوصية العالمية (GDPR والمبادئ الدولية)",
        body: [
          "صُممت بيان وفق مبادئ الخصوصية الافتراضية المتوافقة مع المعايير الدولية (مبادئ اللائحة الأوروبية GDPR، والقانون المغربي 09-08، والمعايير العالمية المماثلة):",
          "• تقليل البيانات: النسخ دون إنترنت لا تجمع أي بيانات شخصية على خوادمنا. أما النسخ السحابية فتُعالج فقط البيانات الضرورية لتشغيل الخدمة.",
          "• حقوق المستخدم: بالنسبة لأي بيانات حساب مستضافة، يحق لك طلب الوصول إليها أو تعديلها أو تصديرها أو حذفها في أي وقت عبر bayyanedigital@gmail.com.",
          "• التخزين التقني: نستخدم فقط التخزين التقني الضروري (مثل تفضيل اللغة وذاكرة العمل دون إنترنت)، ولا نبيع بياناتك أو نستخدم متتبعات إعلانية.",
        ],
      },
      {
        icon: "shield",
        title: "5. الملكية الفكرية",
        body: [
          "العلامة التجارية بيان والشعارات وواجهات الاستخدام والشفرة المصدرية مملوكة لبيان. يُمنح لك حق استخدام غير حصري لتشغيل التطبيق في أنشطتك.",
        ],
      },
    ],
    contactTitle: "التواصل القانوني",
    contactText:
      "هل لديك استفسار حول الشروط أو حذف البيانات أو الامتثال القانوني؟",
  },
} as const;

function SectionIcon({ name }: { name: string }) {
  switch (name) {
    case "scale":
      return <Scale className="w-5 h-5 text-indigo-400" />;
    case "file":
      return <FileText className="w-5 h-5 text-cyan-400" />;
    case "harddrive":
      return <HardDrive className="w-5 h-5 text-emerald-400" />;
    case "globe":
      return <Globe className="w-5 h-5 text-violet-400" />;
    default:
      return <ShieldCheck className="w-5 h-5 text-amber-400" />;
  }
}

export default function LegalPage() {
  const locale = useLocale();
  const lang = (locale === "ar" || locale === "fr" ? locale : "en") as "en" | "fr" | "ar";
  const isRtl = lang === "ar";
  const c = LEGAL_COPY[lang];

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0A0A0A] text-slate-100 selection:bg-indigo-500/30 font-sans flex flex-col"
    >
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white font-bold tracking-tight"
          >
            <Image
              src="/bayyane-logo.webp"
              alt="Bayyane"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover border border-white/15"
            />
            <span>Bayyane</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy-policy"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>{c.privacyLink}</span>
            </Link>
            <div className="text-slate-900 dark:text-white">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>{c.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            {c.title}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-3">
            {c.subtitle}
          </p>
          <p className="text-xs text-slate-500">{c.lastUpdated}</p>
        </div>

        <div className="space-y-6">
          {c.sections.map((sec, idx) => (
            <section
              key={idx}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2.5">
                <SectionIcon name={sec.icon} />
                <span>{sec.title}</span>
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                {sec.body.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact & Navigation Card */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-linear-to-br from-indigo-950/40 to-cyan-950/30 border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{c.contactTitle}</h3>
            <p className="text-sm text-slate-300 mb-2">{c.contactText}</p>
            <a
              href="mailto:bayyanedigital@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
            >
              <Mail className="w-4 h-4" />
              <span>bayyanedigital@gmail.com</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/privacy-policy"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold text-white transition-colors"
            >
              {c.privacyLink}
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-colors inline-flex items-center gap-2"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{c.backHome}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <MarketingFooter />
    </main>
  );
}
