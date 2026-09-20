"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendCode, verifyCode, type AuthState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

const initial: AuthState = { status: "idle" };

function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full">
      {pending ? "One moment..." : children}
    </Button>
  );
}

export function LoginForm() {
  const [emailState, sendAction] = useActionState(sendCode, initial);
  const [codeState, verifyAction] = useActionState(verifyCode, initial);

  const awaitingCode = emailState.status === "code-sent";
  const error = codeState.status === "error" ? codeState.message : emailState.status === "error" ? emailState.message : null;

  if (!awaitingCode) {
    return (
      <form action={sendAction} className="flex flex-col gap-4">
        <label htmlFor="email" className="font-mono text-[11.5px] tracking-[0.12em] text-meta">
          EMAIL
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="h-[52px] rounded-[14px] border border-ink/15 bg-surface px-4 text-[15.5px] outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
        />
        {error ? (
          <p role="alert" className="text-[13.5px] text-body">
            {error}
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
      <label htmlFor="code" className="font-mono text-[11.5px] tracking-[0.12em] text-meta">
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
        className="h-[52px] rounded-[14px] border border-ink/15 bg-surface px-4 font-mono text-[20px] tracking-[0.3em] outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
      />
      {error ? (
        <p role="alert" className="text-[13.5px] text-body">
          {error}
        </p>
      ) : null}
      <Submit>Sign in</Submit>
    </form>
  );
}
