"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { sendCode, signInWithPassword, verifyCode, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

const initial: AuthState = { status: "idle" };

const FIELD =
  "h-[52px] w-full rounded-[14px] border border-ink/15 bg-surface px-4 text-[15.5px] outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20";

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full">
      {pending ? "One moment..." : children}
    </Button>
  );
}

export function LoginForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [mode, setMode] = useState<"password" | "code">("password");

  return (
    <div className="flex flex-col gap-7">
      {mode === "password" ? <PasswordForm defaultEmail={defaultEmail} /> : <CodeForm defaultEmail={defaultEmail} />}

      <button
        type="button"
        onClick={() => setMode((m) => (m === "password" ? "code" : "password"))}
        className="self-start font-mono text-[11.5px] tracking-[0.1em] text-meta underline underline-offset-4 transition hover:text-olive"
      >
        {mode === "password" ? "USE AN EMAILED CODE INSTEAD" : "USE A PASSWORD INSTEAD"}
      </button>
    </div>
  );
}

function PasswordForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, action] = useActionState(signInWithPassword, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-2.5 block font-mono text-[11.5px] tracking-[0.12em] text-meta">
          EMAIL
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" defaultValue={defaultEmail} className={FIELD} />
      </div>
      <div>
        <label htmlFor="password" className="mb-2.5 block font-mono text-[11.5px] tracking-[0.12em] text-meta">
          PASSWORD
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={FIELD} />
      </div>
      {state.status === "error" && state.message ? (
        <p role="alert" className="text-[13.5px] text-body">
          {state.message}
        </p>
      ) : null}
      <Submit>Sign in</Submit>
    </form>
  );
}

function CodeForm({ defaultEmail }: { defaultEmail: string }) {
  const [emailState, sendAction] = useActionState(sendCode, initial);
  const [codeState, verifyAction] = useActionState(verifyCode, initial);

  if (emailState.status !== "code-sent") {
    return (
      <form action={sendAction} className="flex flex-col gap-4">
        <div>
          <label htmlFor="otp-email" className="mb-2.5 block font-mono text-[11.5px] tracking-[0.12em] text-meta">
            EMAIL
          </label>
          <input id="otp-email" name="email" type="email" required autoComplete="email" defaultValue={defaultEmail} className={FIELD} />
        </div>
        {emailState.status === "error" && emailState.message ? (
          <p role="alert" className="text-[13.5px] text-body">
            {emailState.message}
          </p>
        ) : null}
        <Submit>Send code</Submit>
      </form>
    );
  }

  return (
    <form action={verifyAction} className="flex flex-col gap-4">
      <input type="hidden" name="email" value={emailState.email ?? ""} />
      <p className="text-[14px] leading-[1.6] text-body">{emailState.message}</p>
      <div>
        <label htmlFor="code" className="mb-2.5 block font-mono text-[11.5px] tracking-[0.12em] text-meta">
          SIX-DIGIT CODE
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          autoComplete="one-time-code"
          autoFocus
          className={`${FIELD} font-mono text-[20px] tracking-[0.3em]`}
        />
      </div>
      {codeState.status === "error" && codeState.message ? (
        <p role="alert" className="text-[13.5px] text-body">
          {codeState.message}
        </p>
      ) : null}
      <Submit>Sign in</Submit>
    </form>
  );
}
