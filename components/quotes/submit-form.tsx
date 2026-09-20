"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuote, type SubmitState } from "@/lib/quotes/actions";
import { MAX_AUTHOR, MAX_BODY } from "@/lib/quotes/types";
import { Button } from "@/components/ui/button";

const initial: SubmitState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending}>
      {pending ? "Sending..." : "Add to the wall"}
    </Button>
  );
}

export function SubmitForm({ accepting }: { accepting: boolean }) {
  const [state, action] = useActionState(submitQuote, initial);
  const [count, setCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setCount(0);
    }
  }, [state.status]);

  if (!accepting) {
    return (
      <p className="rounded-[18px] border border-dashed border-ink/20 px-6 py-8 text-center text-[15px] leading-[1.6] text-body">
        The wall is closed to new quotes right now. Check back soon.
      </p>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="body" className="mb-2.5 block font-mono text-[11.5px] tracking-[0.12em] text-meta">
          YOUR WORDS
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={3}
          maxLength={MAX_BODY}
          onChange={(e) => setCount(e.target.value.length)}
          placeholder="Something worth keeping."
          aria-describedby="body-count"
          className="w-full resize-none rounded-[14px] border border-ink/15 bg-surface px-4 py-3.5 font-display text-[20px] leading-[1.35] outline-none transition placeholder:text-muted/60 focus:border-olive focus:ring-2 focus:ring-olive/20"
        />
        <div className="mt-2 flex items-center justify-between">
          <p id="body-count" aria-live="polite" className="font-mono text-[11px] text-meta">
            {count}/{MAX_BODY}
          </p>
          {state.fieldErrors?.body ? (
            <p role="alert" className="font-mono text-[11px] text-body">
              {state.fieldErrors.body}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="author_name" className="mb-2.5 block font-mono text-[11.5px] tracking-[0.12em] text-meta">
          NAME <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="author_name"
          name="author_name"
          maxLength={MAX_AUTHOR}
          autoComplete="name"
          placeholder="Anonymous"
          className="h-[50px] w-full rounded-[14px] border border-ink/15 bg-surface px-4 text-[15px] outline-none transition placeholder:text-muted/60 focus:border-olive focus:ring-2 focus:ring-olive/20"
        />
      </div>

      {/* Honeypot: positioned off-screen rather than display:none, which some
          bots detect. Never announced, never tabbable. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Submit />
        {state.message ? (
          <p
            role="status"
            className={`text-[13.5px] ${state.status === "error" ? "text-body" : "text-olive"}`}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
