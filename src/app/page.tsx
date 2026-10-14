import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "بيان للتقنية | تطوير حلول رقمية ذكية ومبتكرة",
  description:
    "شركة تقنية متخصصة في ابتكار وتطوير برمجيات ذكية، آمنة ومتاحة للجميع. نبتكر حلولاً رقمية عملية تعمل بسلاسة في مختلف ظروف الاتصال.",
  keywords: [
    "بيان",
    "شركة تقنية",
    "حلول رقمية ذكية",
    "تطوير برمجيات",
    "تطبيقات سحابية",
    "أنظمة ذكية",
  ],
  alternates: {
    canonical: "https://bayyane.com/ar",
  },
  openGraph: {
    title: "بيان للتقنية | تطوير حلول رقمية ذكية ومبتكرة",
    description:
      "شركة تقنية متخصصة في ابتكار وتطوير برمجيات ذكية، آمنة ومتاحة للجميع. نبتكر حلولاً رقمية عملية تعمل بسلاسة في مختلف ظروف الاتصال.",
    url: "https://bayyane.com",
    siteName: "Bayyane - بيان",
    locale: "ar_AR",
    type: "website",
  },
};

export default function RootPage() {
  redirect("/ar");
}
