import type { Metadata } from "next";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = { title: "Account" };

export default function Login() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-5xl">Walk it together</h1>
      <p className="mt-3 max-w-xl text-night/75">
        Sign in so your progress follows you across devices, and so your friend on this journey can see how you are
        doing, and you them.
      </p>
      <div className="mt-8">
        <AccountView />
      </div>
    </div>
  );
}
