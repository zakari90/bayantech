"use client";

import { getMembers, getSettings } from "@/app/waterdexiedb";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import PublicFooter from "@/components/PublicFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WaterRegistrationDialog } from "@/components/watermanagemtcomponents/WaterRegistrationDialog";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Compass,
  CreditCard,
  Droplets,
  FileSpreadsheet,
  Gauge,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Users
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function WaterAssociationPresentationPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [registerOpen, setRegisterOpen] = useState(false);
  const [existingAssociation, setExistingAssociation] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "features" | "workflow" | "faq">("overview");

  useEffect(() => {
    async function checkExisting() {
      try {
        const s = await getSettings();
        const onboarded = Boolean(s.onboardingCompleted);
        setIsOnboarded(onboarded);

        if (onboarded && s?.associationName) {
          setExistingAssociation(s.associationName);
        } else {
          setExistingAssociation(null);
        }
        const members = await getMembers();
        setMemberCount(members.length);

        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("setup") === "true") {
            setRegisterOpen(true);
          }
        }
      } catch (e) {
        console.error("Error reading association state:", e);
      }
    }
    checkExisting();
  }, []);

  const content = {
    ar: {
      badge: "النسخة المحلية 100% دون إنترنت • مجانية ومستقلة",
      heroTitle: "المنظومة الرقمية الشاملة لتسيير جمعيات الماء الصالح للشرب",
      heroSubtitle:
        "حل متكامل، سريع وآمن مصمم خصيصاً للمكاتب المسيرة لجمعيات الماء بالقرى والدواوير بالمغرب والعالم العربي. إدارة المنخرطين، احتساب استهلاك العدادات، تتبع المداخيل والمصاريف، وإصدار الوصولات بلمسة زر.",
      ctaStart: "تسجيل الجمعية والبدء الآن",
      ctaDemo: "تجربة الجمعية النموذجية",
      ctaDashboard: "الدخول للوحة التسيير",
      ctaHowItWorks: "دليل: كيف يعمل التطبيق؟",
      stat1: { num: "100%", label: "بدون أنترنت" },
      stat2: { num: "0 درهم", label: "مجاني ومستقل محلياً" },
      stat3: { num: "1 ثانية", label: "احتساب فوري للاستهلاك" },

      pillarsTitle: "كل ما تحتاجه جمعية الماء في شاشة واحدة",
      pillarsSubtitle: "وداعاً للدفاتر الورقية والحسابات المعقدة وأخطاء الفواتير",

      features: [
        {
          icon: <Users className="w-6 h-6 text-blue-500" />,
          title: "سجل المنخرطين والأحياء",
          desc: "إدارة قاعدة بيانات أرباب الأسر، أرقام العدادات، أرقام الهواتف، توزيع الأحياء مع إمكانية البحث والفلترة السريعة.",
          badge: "شامل",
          gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
        },
        {
          icon: <Gauge className="w-6 h-6 text-cyan-500" />,
          title: "الجولة الشهرية وقراءة العدادات",
          desc: "تدوين مؤشرات العدادات بنقرة زر، حساب فوري للاستهلاك بالمتر المكعب، وكشف تلقائي للتسربات أو الاستهلاك غير المعتاد.",
          badge: "ذكي",
          gradient: "from-cyan-500/10 to-teal-500/10 border-cyan-500/20",
        },
        {
          icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
          title: "الاستخلاص والوصولات الفورية",
          desc: "تسجيل الأداءات الجزئية والكلية، تسليم وصولات دفع رسمية قابلة للطباعة فوراً، وتتبع دقيق للمداخيل والديون المتبقية.",
          badge: "فوري",
          gradient: "from-emerald-500/10 to-green-500/10 border-emerald-500/20",
        },
        {
          icon: <TrendingDown className="w-6 h-6 text-rose-500" />,
          title: "تتبع مصاريف المضخة والصيانة",
          desc: "توثيق كل درهم يُنفق: فاتورة كهرباء المضخة (ONEE)، الغازوال، قطع الغيار، أجرة حارس البئر والصيانة الدورية.",
          badge: "شفافية",
          gradient: "from-rose-500/10 to-orange-500/10 border-rose-500/20",
        },
        {
          icon: <FileSpreadsheet className="w-6 h-6 text-purple-500" />,
          title: "التقرير المالي للجمع العام (GA)",
          desc: "تقرير محاسباتي متكامل جاهز بضغطة زر: المداخيل، المصاريف، الفائض الصافي، وبواقي الديون لعرضه في الجمع العام السنوي.",
          badge: "جاهز",
          gradient: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
        },
        {
          icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
          title: "حفظ محلي آمن ونسخ احتياطي",
          desc: "بيانات الجمعية محفوظة بأمان تام في متصفح حاسوبك أو هاتفك. تصدير نسخة احتياطية JSON بنقرة واحدة لحمايتها دائماً.",
          badge: "أمان 100%",
          gradient: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
        },
      ],

      workflowSteps: [
        {
          num: "01",
          title: "تسجيل المنخرطين والتعريفة",
          desc: "إدخال ثمن المتر المكعب وواجب الصيانة الشهري وتسجيل أرباب الأسر وأرقام عداداتهم.",
        },
        {
          num: "02",
          title: "الجولة الشهرية",
          desc: "تدوين رقم العداد الظاهر لكل منزل، ليقوم النظام باحتساب الفاتورة تلقائياً.",
        },
        {
          num: "03",
          title: "الاستخلاص والوصل",
          desc: "تسجيل الأداء وطباعة وصل الدفع للمنخرط وتوثيق العملية فوراً في سجل الحسابات.",
        },
        {
          num: "04",
          title: "التقرير المالي للجمع العام",
          desc: "عرض ميزانية الجمعية وحجم المياه المستهلكة وبواقي ديون المنخرطين في تقرير احترافي.",
        },
      ],

      faqs: [
        {
          q: "هل يحتاج التطبيق إلى إنترنت ليعمل؟",
          a: "كلا، التطبيق يعمل بنسبة 100% دون الحاجة إلى صبيب إنترنت. كل الحسابات وقواعد البيانات تُخزن مباشرة ومحلياً على جهازك باستخدام تقنية IndexedDB الحديثة.",
        },
        {
          q: "هل يمكنني تشغيل التطبيق من الهاتف والكمبيوتر؟",
          a: "نعم! التطبيق مصمم ليكون متجاوباً تماماً، يمكنك استخدامه على الحاسوب، اللوحة الإلكترونية، أو الهاتف الذكي بسهولة.",
        },
        {
          q: "كيف أضمن عدم ضياع بيانات الجمعية؟",
          a: "يتضمن التطبيق زر تصدير النسخ الاحتياطي (Backup JSON) في الإعدادات. نوصي بتنزيل نسخة احتياطية شهرياً أو حفظها على مفتاح USB أو إرسالها لبريدك.",
        },
        {
          q: "هل يمكن تعديل ثمن المتر المكعب أو واجب الصيانة لاحقاً؟",
          a: "نعم، من خلال صفحة الإعدادات يمكنك في أي وقت تعديل سعر المتر المكعب أو واجب الصيانة الشهري بعد مصادقة الجمع العام.",
        },
      ],

      bottomCtaTitle: "جاهز لتحديث إدارة جمعية الماء في دواركم؟",
      bottomCtaDesc: "ابدأ الآن مجاناً دون الحاجة لأي اشتراك أو إنشاء حساب سحابي معقد.",
    },

    fr: {
      badge: "Édition Locale 100% Hors-ligne • Gratuite & Autonome",
      heroTitle: "Plateforme Digitale Intégrée pour les Associations d'Eau Potable",
      heroSubtitle:
        "Une solution complète, rapide et sécurisée conçue sur mesure pour les comités d'associations d'eau en milieu rural. Gestion des adhérents, relevé des compteurs, suivi des cotisations et reçus officiels instantanés.",
      ctaStart: "Inscrire l'association & Démarrer",
      ctaDemo: "Charger la démo du village",
      ctaDashboard: "Accéder au tableau de bord",
      ctaHowItWorks: "Guide : Comment ça marche ?",
      stat1: { num: "100%", label: "Hors-ligne" },
      stat2: { num: "0 DH", label: "Gratuit & Indépendant" },
      stat3: { num: "1 sec", label: "Calcul instantané" },

      pillarsTitle: "Toute la gestion de l'eau en un seul endroit",
      pillarsSubtitle: "Fini les registres papier égarés, les calculs manuels et les litiges de facturation",

      features: [
        {
          icon: <Users className="w-6 h-6 text-blue-500" />,
          title: "Registre des Adhérents & Quartiers",
          desc: "Base de données complète des chefs de ménage, numéros de compteurs, téléphones, quartiers avec filtres et recherche instantanés.",
          badge: "Complet",
          gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
        },
        {
          icon: <Gauge className="w-6 h-6 text-cyan-500" />,
          title: "Tournée Mensuelle des Compteurs",
          desc: "Saisie rapide des index, calcul automatique de la consommation en m³, et détection immédiate des fuites anormales.",
          badge: "Intelligent",
          gradient: "from-cyan-500/10 to-teal-500/10 border-cyan-500/20",
        },
        {
          icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
          title: "Paiements & Reçus Instantanés",
          desc: "Enregistrement des paiements partiels/totaux, édition de reçus officiels imprimables et suivi précis des arriérés.",
          badge: "Instantané",
          gradient: "from-emerald-500/10 to-green-500/10 border-emerald-500/20",
        },
        {
          icon: <TrendingDown className="w-6 h-6 text-rose-500" />,
          title: "Dépenses de Pompe & Maintenance",
          desc: "Traçabilité complète : factures électricité pompe (ONEE), gasoil, pièces de rechange, salaire gardien et réparations.",
          badge: "Transparence",
          gradient: "from-rose-500/10 to-orange-500/10 border-rose-500/20",
        },
        {
          icon: <FileSpreadsheet className="w-6 h-6 text-purple-500" />,
          title: "Rapport Financier pour l'Assemblée Générale",
          desc: "Bilan comptable clair généré en un clic : recettes, dépenses, excédent net et état des arriérés pour l'AG annuelle.",
          badge: "Prêt pour l'AG",
          gradient: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
        },
        {
          icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
          title: "Sauvegarde Sécurisée en Local",
          desc: "Vos données restent strictement sur votre machine. Export et import de sauvegardes JSON à tout moment en un clic.",
          badge: "100% Sûr",
          gradient: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
        },
      ],

      workflowSteps: [
        {
          num: "01",
          title: "Configuration & Adhérents",
          desc: "Définition du tarif au m³, forfait d'entretien mensuel et enregistrement des compteurs.",
        },
        {
          num: "02",
          title: "Tournée des Compteurs",
          desc: "Saisie de l'index affiché à la fin du mois ; l'application calcule la facture automatiquement.",
        },
        {
          num: "03",
          title: "Encaissement & Reçu",
          desc: "Paiement en espèces, impression du reçu et enregistrement instantané dans les comptes.",
        },
        {
          num: "04",
          title: "Bilan de l'Assemblée Générale",
          desc: "Présentation transparente des comptes, des volumes d'eau et des créances restantes.",
        },
      ],

      faqs: [
        {
          q: "L'application fonctionne-t-elle sans internet ?",
          a: "Oui, à 100%. L'application est autonome et stocke toutes les informations dans votre navigateur avec IndexedDB.",
        },
        {
          q: "Puis-je l'utiliser sur mobile et ordinateur ?",
          a: "Absolument. L'interface s'adapte parfaitement aux smartphones pour la tournée sur le terrain et aux écrans d'ordinateurs pour les rapports.",
        },
        {
          q: "Comment protéger les données contre une panne ?",
          a: "Un bouton d'export JSON est disponible dans les paramètres. Téléchargez simplement une sauvegarde mensuelle sur clé USB.",
        },
        {
          q: "Peut-on modifier le tarif du m³ ou le forfait mensuel ?",
          a: "Oui très facilement, depuis les paramètres vous pouvez ajuster à tout moment le prix du m³ ou la cotisation mensuelle après accord de l'assemblée.",
        },
      ],

      bottomCtaTitle: "Prêt à moderniser la gestion de l'eau de votre village ?",
      bottomCtaDesc: "Commencez dès aujourd'hui sans abonnement ni création de compte complexe.",
    },

    en: {
      badge: "100% Offline Local Edition • Free & Independent",
      heroTitle: "Digital Management Suite for Community Water Associations",
      heroSubtitle:
        "A comprehensive, fast, and secure local application designed specifically for village drinking water associations. Manage subscribers, meter tour readings, bill collections, pump expenses, and annual financial reports.",
      ctaStart: "Register Association & Start",
      ctaDemo: "Load Village Demo",
      ctaDashboard: "Open Dashboard",
      ctaHowItWorks: "User Guide & Workflow",
      stat1: { num: "100%", label: "Offline Ready" },
      stat2: { num: "0 DH", label: "Free & Self-Contained" },
      stat3: { num: "1 sec", label: "Instant Billing" },

      pillarsTitle: "Everything Your Water Committee Needs",
      pillarsSubtitle: "Say goodbye to paper logbooks, calculation errors, and billing disputes",

      features: [
        {
          icon: <Users className="w-6 h-6 text-blue-500" />,
          title: "Subscriber Registry & Districts",
          desc: "Complete member database with household head names, meter serials, phone numbers, and districts with fast instant lookup.",
          badge: "Complete",
          gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
        },
        {
          icon: <Gauge className="w-6 h-6 text-cyan-500" />,
          title: "Monthly Meter Tour & Readings",
          desc: "Quick index input, automatic m³ volume calculation, and instant anomaly warning for high consumption or leaks.",
          badge: "Smart",
          gradient: "from-cyan-500/10 to-teal-500/10 border-cyan-500/20",
        },
        {
          icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
          title: "Instant Collections & Receipts",
          desc: "Record full or partial payments, generate printable official receipts on the spot, and track member balances accurately.",
          badge: "Instant",
          gradient: "from-emerald-500/10 to-green-500/10 border-emerald-500/20",
        },
        {
          icon: <TrendingDown className="w-6 h-6 text-rose-500" />,
          title: "Pump Expenses & Maintenance Tracking",
          desc: "Track every single cent: electricity pump utility bills, diesel fuel, maintenance parts, operator allowance, and emergency repairs.",
          badge: "Transparency",
          gradient: "from-rose-500/10 to-orange-500/10 border-rose-500/20",
        },
        {
          icon: <FileSpreadsheet className="w-6 h-6 text-purple-500" />,
          title: "General Assembly Financial Report",
          desc: "Professional accounting statement generated in one click: total revenue, expenses, net surplus, and outstanding member debt.",
          badge: "GA Ready",
          gradient: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
        },
        {
          icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
          title: "Private Local Storage & Backup",
          desc: "All records are securely maintained in your browser database. Instant one-click JSON export and restore at any time.",
          badge: "100% Private",
          gradient: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
        },
      ],

      workflowSteps: [
        {
          num: "01",
          title: "Configure & Enroll",
          desc: "Define tariff per m³, monthly maintenance fee, and enroll village households with meter numbers.",
        },
        {
          num: "02",
          title: "Monthly Meter Tour",
          desc: "Input month-end meter numbers; consumption and billing are calculated automatically.",
        },
        {
          num: "03",
          title: "Payment & Receipt",
          desc: "Collect dues, issue printable receipts, and log transactions instantly in the register.",
        },
        {
          num: "04",
          title: "Annual GA Presentation",
          desc: "Present full fiscal clarity, water volume stats, and transparent accounts to the community.",
        },
      ],

      faqs: [
        {
          q: "Does this app need an active internet connection?",
          a: "No, it functions 100% offline. All databases and computations execute locally within your browser using client-side IndexedDB technology.",
        },
        {
          q: "Can I use it on both smartphone and laptop?",
          a: "Yes! It is built as a fully responsive web application, offering optimal layouts on mobile phones for field tours and desktops for detailed reports.",
        },
        {
          q: "How do I secure my association data against hardware loss?",
          a: "Use the Backup JSON feature in settings to save your entire database to a USB drive or cloud drive whenever you record monthly updates.",
        },
        {
          q: "Can we update the tariff per m³ or the monthly fee later?",
          a: "Yes, you can easily update the price per m³ or fixed monthly maintenance fee at any time in the settings page.",
        },
      ],

      bottomCtaTitle: "Ready to Upgrade Your Community Water Management?",
      bottomCtaDesc: "Get started immediately for free with no recurring subscriptions or cloud locks.",
    },
  };

  const t = content[locale as "ar" | "fr" | "en"] || content.ar;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-cyan-500/20">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80" suppressHydrationWarning>
        <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-6xl mx-auto">
          {/* Logo & Brand */}
          <Link
            href="/waterassociation"
            className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Droplets className="h-5 w-5 fill-white/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5" suppressHydrationWarning>
                <span className="font-black text-base sm:text-lg tracking-tight bg-linear-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {isRtl ? "بيان لتدبير الماء" : "Bayyane Water"}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                {isRtl ? "تسيير جمعيات الماء الصالح للشرب" : "Drinking Water Association Manager"}
              </p>
            </div>
          </Link>

          {/* Quick Nav Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/waterassociation/how-it-works"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted"
            >
              <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t.ctaHowItWorks}</span>
            </Link>

            {isOnboarded ? (
              <Link href="/waterassociation/waterassociationmanager">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3.5 rounded-xl border-border hover:bg-muted font-bold text-xs"
                >
                  <Compass className="h-3.5 w-3.5 me-1 text-blue-600 dark:text-cyan-400" />
                  <span>{t.ctaDashboard}</span>
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={() => setRegisterOpen(true)}
                className="h-9 px-3.5 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs hover:scale-[1.02] cursor-pointer"
              >
                <Building2 className="h-3.5 w-3.5 me-1" />
                <span>{t.ctaStart}</span>
              </Button>
            )}

            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border/40">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-linear-to-tr from-cyan-500/15 via-blue-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-500/10 blur-2xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-cyan-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
            <span>{t.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-[1.15]">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            {t.heroSubtitle}
          </p>

          {/* Active Association Banner if already configured */}
          {isOnboarded && existingAssociation && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Check className="h-4 w-4" />
              <span>
                {locale === "ar"
                  ? `جمعية "${existingAssociation}" مسجلة على هذا الجهاز (${memberCount} منخرط)`
                  : locale === "fr"
                    ? `Association "${existingAssociation}" configurée sur cet appareil (${memberCount} adhérent${memberCount > 1 ? "s" : ""})`
                    : `Association "${existingAssociation}" active on this device (${memberCount} member${memberCount !== 1 ? "s" : ""})`}
              </span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto" suppressHydrationWarning>
            {isOnboarded ? (
              <Link href="/waterassociation/waterassociationmanager" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Compass className="h-5 w-5 me-2" />
                  <span>{t.ctaDashboard}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => setRegisterOpen(true)}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Building2 className="h-5 w-5 me-2" />
                <span>{t.ctaStart}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
              </Button>
            )}

            <Link href="/waterassociation/how-it-works" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full h-13 px-4 rounded-2xl text-muted-foreground hover:text-foreground font-semibold text-xs"
              >
                <HelpCircle className="h-4 w-4 me-1.5 text-cyan-600" />
                <span>{t.ctaHowItWorks}</span>
              </Button>
            </Link>
          </div>

          {/* Highlight Stats Ribbon */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[t.stat1, t.stat2, t.stat3].map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-xs flex flex-col items-center justify-center text-center"
              >
                <span className="font-black text-xl sm:text-2xl text-foreground bg-linear-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {stat.num}
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mockup & Live Preview Card */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="rounded-3xl border border-border/80 bg-linear-to-b from-card to-muted/20 p-6 sm:p-10 shadow-lg shadow-black/5">
          <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-lg text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-xs font-bold">
                <Gauge className="w-3.5 h-3.5" />
                <span>{isRtl ? "دورة التسيير الشهرية مبسطة" : "Simplified Monthly Cycle"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {isRtl ? "من قراءة العداد إلى تقرير الجمع العام في دقائق" : "From meter tour to GA report in minutes"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isRtl
                  ? "صُمم النظام ليلائم طبيعة عمل مكاتب الجمعيات في القرى: إدخال سهل برقم العداد، طباعة وصولات الدفع الورقية بالأبعاد المناسبة للمستفيدين، وتوثيق المعاملات بشفافية تامة."
                  : "Engineered specifically for rural community water management: seamless meter input, localized printable receipts, and transparent financial tracking."}
              </p>
              <div className="space-y-2 pt-2">
                {[
                  isRtl ? "احتساب دقيق للأشطر وتعريفة المتر المكعب" : "Exact m³ tiered consumption & fixed fee calculation",
                  isRtl ? "طباعة وصل الدفع بصيغة صغيرة موفرة للورق" : "Print-friendly compact receipts for members",
                  isRtl ? "كشف فوري للمتأخرين عن الأداء والديون" : "Real-time arrears detection and debt tracking",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Simulated Bill & Meter Badge Card */}
            <div className="w-full lg:w-auto shrink-0 max-w-sm">
              <Card className="rounded-2xl border-cyan-500/25 shadow-xl bg-card/95 backdrop-blur-md overflow-hidden">
                <div className="bg-linear-to-r from-cyan-600 to-blue-600 p-4 text-white">
                  <div className="flex items-center justify-between text-xs opacity-90">
                    <span>{isRtl ? "وصل أداء نموذج" : "Sample Water Receipt"}</span>
                    <span>#REC-2026-0042</span>
                  </div>
                  <div className="mt-2 text-xl font-black">
                    {isRtl ? "دوار عين الخير • جمعية الأمل" : "Ain El Kheir Water Assoc."}
                  </div>
                </div>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">{isRtl ? "المنخرط:" : "Subscriber:"}</span>
                    <span className="font-bold text-foreground">الحاج عمر السالمي (عداد #12)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">{isRtl ? "فترة الاستهلاك:" : "Period:"}</span>
                    <span className="font-semibold text-foreground">شتمبر 2026</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">{isRtl ? "الاستهلاك (الجديد - السابق):" : "Consumption:"}</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">14 م³</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">{isRtl ? "المبلغ الإجمالي:" : "Total Bill:"}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">80.00 درهم</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ✓ {isRtl ? "مؤدى بالكامل" : "Paid in Full"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isRtl ? "جاهز للطباعة والواتساب" : "Print & WhatsApp Ready"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Functional Modules (Features Grid) */}
      <section className="py-12 sm:py-16 bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t.pillarsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.pillarsSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.map((feature, idx) => (
              <Card
                key={idx}
                className={`rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 bg-card ${feature.gradient}`}
              >
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                  <div className="p-2.5 rounded-xl bg-background border border-border shadow-xs">
                    {feature.icon}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-background/50">
                    {feature.badge}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <h3 className="font-bold text-base text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Association Workflow */}
      <section className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="outline" className="text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs">
            {isRtl ? "منهجية العمل اليومية" : "Daily Workflow"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            {isRtl ? "كيف تسير جمعيتك خطوة بخطوة؟" : "How It Works Step-by-Step"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isRtl
              ? "أربعة مراحل واضحة وسريعة تجعل تسيير شبكة الماء منتظماً وشفافاً للجميع."
              : "Four clear phases ensuring transparent, fast, and dispute-free water management."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl border border-border bg-card/60 hover:bg-card transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black text-blue-600/25 dark:text-cyan-400/20 font-mono">
                  {step.num}
                </span>
                <h3 className="font-bold text-sm text-foreground mt-2 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/waterassociation/how-it-works">
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>{isRtl ? "قراءة الشرح التفصيلي مع صور توضيحية للعدادات والوصولات" : "Read Full Illustrated Guide"}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Button>
          </Link>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="py-12 sm:py-16 bg-muted/20 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isRtl ? "الأسئلة الأكثر شيوعاً" : "Frequently Asked Questions"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isRtl ? "كل ما تود معرفته حول الخصوصية والعمل بدون إنترنت وتثبيت التطبيق" : "Everything you need to know about privacy, offline capabilities, and installation"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {t.faqs.map((faq, i) => (
              <Card key={i} className="rounded-2xl border-border/70 p-4 space-y-2 bg-card">
                <h3 className="font-bold text-sm text-foreground flex items-start gap-2">
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed ps-5">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-linear-to-b from-background to-cyan-500/5 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25">
            <Droplets className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            {t.bottomCtaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            {t.bottomCtaDesc}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3" suppressHydrationWarning>
            {isOnboarded ? (
              <Link href="/waterassociation/waterassociationmanager" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 cursor-pointer"
                >
                  <Compass className="w-4 h-4 me-2" />
                  <span>{t.ctaDashboard}</span>
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => setRegisterOpen(true)}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 cursor-pointer"
              >
                <Building2 className="w-4 h-4 me-2" />
                <span>{t.ctaStart}</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Reusable Registration Dialog for First-Time Setup & Demo Load */}
      <WaterRegistrationDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSuccess={() => setIsOnboarded(true)}
      />

      {/* Public Global Footer */}
      <PublicFooter />
    </div>
  );
}
