"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { submitQuote, type SubmitState } from "@/lib/quotes/actions";
import { MAX_AUTHOR, MAX_BODY, type Quote } from "@/lib/quotes/types";

const initial: SubmitState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-bone px-7 font-semibold text-ink transition hover:bg-olive-light disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light"
    >
      {pending ? "Sending..." : "Put it on the wall"}
    </button>
  );
}

export function SubmitDialog({
  open,
  onClose,
  onPosted
}: {
  open: boolean;
  onClose: () => void;
  onPosted: (quote: Quote) => void;
}) {
  const [state, action] = useActionState(submitQuote, initial);
  const [count, setCount] = useState(0);
  const [anonymous, setAnonymous] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setCount(0);
      if (state.quote) onPosted(state.quote);
    }
    // onPosted is stable enough; re-running on state alone avoids double-adds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!open) return null;

  const done = state.status === "success";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#14150E]/90 px-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] rounded-[26px] border border-bone/12 bg-[#1C1E16] p-7 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 inline-flex size-10 items-center justify-center rounded-full border border-bone/20 text-bone/70 transition hover:border-bone hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light"
        >
          <X className="size-[16px]" />
        </button>

        {done ? (
          <div className="py-6 text-center">
            <p className="mb-3 font-display text-[34px] italic leading-none text-olive-light">
              {state.held ? "Thank you." : "It's on the wall."}
            </p>
            <p className="mx-auto mb-8 max-w-[380px] text-[15px] leading-[1.6] text-bone/70">
              {state.held ? state.message : "The wall has turned to your line. Close this to see it."}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[46px] items-center rounded-full bg-bone px-6 text-[14px] font-semibold text-ink transition hover:bg-olive-light"
            >
              {state.held ? "Back to the wall" : "Show me"}
            </button>
          </div>
        ) : (
          <>
            <p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-olive-light">ADD YOURS</p>
            <h2 id="submit-title" className="mb-7 font-display text-[clamp(28px,4.4vw,40px)] font-normal leading-[1.05] text-bone">
              Leave something behind.
            </h2>

            <form ref={formRef} action={action} className="flex flex-col gap-5">
              <div>
                <textarea
                  name="body"
                  required
                  rows={3}
                  maxLength={MAX_BODY}
                  autoFocus
                  onChange={(e) => setCount(e.target.value.length)}
                  placeholder="A line you wrote, or one that stuck with you."
                  aria-label="Your quote"
                  className="w-full resize-none rounded-[16px] border border-bone/15 bg-bone/[0.04] px-4 py-3.5 font-display text-[21px] leading-[1.35] text-bone outline-none transition placeholder:text-bone/35 focus:border-olive-light focus:ring-2 focus:ring-olive-light/25"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span aria-live="polite" className="font-mono text-[11px] text-bone/40">
                    {count}/{MAX_BODY}
                  </span>
                  {state.fieldErrors?.body ? (
                    <span role="alert" className="font-mono text-[11px] text-olive-light">
                      {state.fieldErrors.body}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Two separate questions: who said it, and who is posting.
                  Conflating them would make a visitor posting Rumi look like
                  they are claiming to be Rumi. */}
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-2">
                  <span className="font-mono text-[10.5px] tracking-[0.12em] text-bone/45">
                    WHO SAID IT <span className="normal-case tracking-normal">— leave blank if these are your own words</span>
                  </span>
                  <input
                    name="author_name"
                    maxLength={MAX_AUTHOR}
                    placeholder="Rumi, Seneca, your grandmother..."
                    className="h-[46px] rounded-[14px] border border-bone/15 bg-bone/[0.04] px-4 text-[14.5px] text-bone outline-none transition placeholder:text-bone/30 focus:border-olive-light focus:ring-2 focus:ring-olive-light/20"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAnonymous((a) => !a)}
                    aria-pressed={anonymous}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 font-mono text-[10.5px] tracking-[0.08em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-light ${
                      anonymous
                        ? "border-olive-light bg-olive-light/15 text-olive-light"
                        : "border-bone/20 text-bone/55 hover:border-bone/40"
                    }`}
                  >
                    <span aria-hidden className="text-[12px]">{anonymous ? "●" : "○"}</span>
                    POST ANONYMOUSLY
                  </button>

                  {!anonymous ? (
                    <input
                      name="posted_by"
                      maxLength={MAX_AUTHOR}
                      autoComplete="name"
                      placeholder="Posted by — your name"
                      aria-label="Your name"
                      className="h-[44px] min-w-[190px] flex-1 rounded-full border border-bone/15 bg-bone/[0.04] px-4 text-[14px] text-bone outline-none transition placeholder:text-bone/30 focus:border-olive-light"
                    />
                  ) : null}
                </div>
              </div>

              {/* Honeypot: off-screen rather than display:none, which bots detect. */}
              <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor="website">Leave this empty</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Submit />
                {state.status === "error" && state.message ? (
                  <p role="alert" className="text-[13.5px] text-olive-light">
                    {state.message}
                  </p>
                ) : null}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
