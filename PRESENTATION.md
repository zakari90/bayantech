# 🌟 BayanTech (إدارة المركز) — Product Presentation & Overview

> **A modern, bilingual, offline-first management platform for educational institutions, tutoring centres, and training academies.**

---

## 📌 Executive Summary

**BayanTech** (`www.bayantech.ma`) is an all-in-one Management Platform (SaaS & PWA) designed specifically for private education centres, tutoring institutes, language academies, and training centres in Morocco and the MENA region.

It eliminates manual paper receipts, confusing spreadsheets, and timetable scheduling conflicts by providing an intuitive, multi-lingual (Arabic, French, English) digital platform with **two complementary deployment models**:

1. **🆓 Local-First Free Edition (PWA):** Zero-install, works 100% offline, saves data securely on the device (IndexedDB/Dexie), free forever.
2. **💎 Cloud Pro SaaS Edition:** Real-time multi-device cloud synchronization (MongoDB), multi-user staff permissions (Admin + Managers), public student registration links, and automated cloud backups.

---

## 🎯 The Problems We Solve

| Traditional Problem | BayanTech Solution |
|---|---|
| **Spreadsheet Chaos & Data Loss** | Centralized, relational management of students, teachers, classes, and rooms with automated backups. |
| **Schedule Clashes & Room Overlaps** | Real-time visual conflict detection for teacher hours, student groups, and classroom occupancy. |
| **Uncollected Fees & Disputed Payments** | Automated payment status tracking, digital payment receipts, and automated teacher percentage split calculations. |
| **Poor Internet Connectivity** | Built with an **Offline-First PWA architecture** — operations never stop even if the internet goes down. |
| **Language & Orientation Barriers** | Native Arabic with full Right-to-Left (RTL) typography, alongside French and English interfaces. |

---

## 🖥️ Platform Architecture & Public Pages

```
                     ┌───────────────────────────────────┐
                     │     BayanTech Web Platform        │
                     │       (www.bayantech.ma)          │
                     └─────────────────┬─────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  Marketing Site  │          │   Public Tools   │          │  App Editions    │
│  - Landing Page  │          │  - /schedule     │          │  - /free (Local) │
│  - Pricing Tiers │          │  - Attendance    │          │  - /pro (Cloud)  │
│  - Contact & WA  │          │  - Export Excel  │          │  - /admin portal │
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

### Key Website Routes:
- **`/[locale]` (Landing Page):** Modern dark-mode marketing showcase with interactive pricing calculator, WhatsApp quick contact, and feature breakdown.
- **`/[locale]/free` (Free Edition Portal):** Zero-friction onboarding for single-branch centres. Runs directly in the browser with offline capability.
- **`/[locale]/schedule` (Standalone Timetable Tool):** Free public tool allowing teachers and directors to build, color-code, print, and export weekly schedules to Excel without signing up.
- **`/[locale]/free/admin` & `/[locale]/pro/admin`:** Dedicated dashboards for centre directors, teachers, students, receipts, and classroom allocations.

---

## ⚡ Core Feature Modules

### 1. 📅 Interactive Timetable & Conflict Engine
- **Visual Weekly Grid:** 7-day schedule with configurable hour slots (e.g. 08:00 to 21:00).
- **Sticky Time & Day Headers:** Full cross-browser sticky navigation that supports RTL (Arabic) and LTR (French/English) layouts.
- **Smart Conflict Detection:** Alerts immediately when a teacher is assigned to two rooms at the same time, or when a classroom is double-booked.
- **One-Click Export & Print:**
  - Dynamic Excel export (`.xlsx`) generated client-side.
  - Dedicated print view (`Ctrl+P` / Print Button) optimized for paper timetables.
- **Deterministic Color-Coding:** Automatically groups slots with consistent hues for quick visual scanning.

### 2. 👨‍🎓 Student Management & Enrollment
- Comprehensive student profiles (contact info, grade level, guardian details).
- Multi-subject enrollment with flexible monthly fee structures.
- Attendance history and payment balance tracking per student.

### 3. 👩‍🏫 Teacher Allocation & Remuneration
- Weekly availability management and assigned subjects.
- Automated calculation of teacher commissions (fixed hourly rates or percentage-based revenue sharing).
- Detailed payout logs and payment vouchers.

### 4. 🧾 Payment & Receipt System
- Instant generation of printable student payment receipts.
- Payment status indicators (Paid, Pending, Overdue, Partial).
- Search and filter receipts by date range, student, teacher, or grade level.

### 5. 📊 Executive Dashboard & Analytics
- Live overview of active students, active teachers, and monthly revenue.
- Visual revenue charts showing monthly and annual financial trends.
- Quick action shortcuts for registration, schedule addition, and database backups.

---

## 🥊 Product Comparison: Free vs. Pro

| Capability | 🆓 Free Edition | 💎 Pro Cloud Edition |
|---|:---:|:---:|
| **Cost** | 100% Free | Subscription (MAD / Month) |
| **Data Storage** | Local IndexedDB (Dexie) | Secure Cloud Database (MongoDB) |
| **Internet Required** | ❌ No (Works 100% Offline) | ✅ Yes |
| **User Roles** | Single Director / Admin | Multi-user (Director + Multiple Managers) |
| **Public Registration Link** | ❌ | ✅ Self-service student registration |
| **Multi-Device Sync** | ❌ Device-locked | ✅ Real-time sync across phones, tablets & PCs |
| **Data Backup** | Manual JSON Export & Import | Automated Daily Cloud Backups |
| **Print & Excel Export** | ✅ Yes | ✅ Yes |
| **PWA Installable** | ✅ Yes (App icon on home screen) | ✅ Yes |

---

## 🛠️ Technology Stack & Engineering Standards

- **Frontend Framework:** Next.js 15 (App Router, React 19)
- **Language:** TypeScript 5.x with strict type validation
- **Styling:** Tailwind CSS 4, Radix UI Primitives, Lucide Icons, Framer Motion
- **Internationalization (i18n):** `next-intl` (Arabic, French, English) with full bidirectional layout (`dir="rtl"` / `dir="ltr"`)
- **Offline & Storage Engine:**
  - **Local:** Dexie.js (IndexedDB wrapper) with schema migrations
  - **Cloud:** Prisma ORM 6 with MongoDB
- **Progressive Web App (PWA):** Serwist Service Worker with background sync, asset caching, and standalone desktop/mobile installation.
- **Performance Optimizations:**
  - Dynamic on-demand loading of heavy dependencies (ExcelJS, Lottie).
  - Intelligent route prefetching for instant zero-latency transitions.
  - Sub-50ms server-side locale redirects.

---

## 💬 3-Minute Presentation Pitch Script (For Sales & Demos)

> *"Hello! Managing a training or tutoring centre usually means juggling paper receipts, Excel files that someone accidentally overwrites, and frequent timetable schedule conflicts between classrooms and teachers.*
>
> *With **BayanTech**, you can streamline your entire centre in one place:*
>
> 1. *First, you can start today for free with our **Local Edition** — it runs right inside your browser, requires no internet connection, and your student data stays 100% confidential on your computer.*
> 2. *You can create your weekly timetable in minutes: if a teacher or room is double-booked, the system warns you immediately. You can print the timetable or export it to Excel with a single click.*
> 3. *You can track every student payment, print professional receipts, and automatically calculate teacher shares without manual math errors.*
> 4. *When you're ready to expand, our **Pro Cloud Edition** lets you and your receptionists manage the centre together across multiple computers, phones, and branches in real-time.*
>
> *Let's open the live demo and see how it works!"*

---

## 📞 Contact & Inquiries

- **Website:** [www.bayantech.ma](https://www.bayantech.ma)
- **WhatsApp Support & Sales:** [+212 768 276 772](https://wa.me/212768276772)
- **Repository / Tech:** BayanTech Center Management System
- **Location:** Morocco (MENA)
