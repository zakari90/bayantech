import { redirect } from "next/navigation";

// Instantly redirect server-side to the default locale.
// Previously this was a client component with a 2-second spinner delay —
// now it resolves in <50ms via HTTP 307 without any JS.
export default function RootPage() {
  redirect("/ar");
}
