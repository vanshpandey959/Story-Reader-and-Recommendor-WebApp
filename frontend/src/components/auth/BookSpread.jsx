import { ArrowLeft, ArrowRight } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const PAPER = "bg-white";

/** The static page that is revealed when the leaf turns away */
function BlurbPage({ side, title, text, cta, onClick }) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute inset-y-0 flex w-1/2 flex-col items-center justify-center gap-4 px-10 text-center ${PAPER} ${
        isLeft ? "left-0 rounded-l-lg" : "right-0 rounded-r-lg"
      }`}
    >
      <h2 className="font-display text-3xl font-bold text-zinc-800">{title}</h2>
      <p className="max-w-xs text-sm text-zinc-500">{text}</p>
      <button
        onClick={onClick}
        className="flex items-center gap-2 rounded-full border border-green-900 px-5 py-2 text-sm font-medium text-green-900 transition hover:bg-green-200"
      >
        {isLeft ? null : <ArrowLeft className="h-4 w-4" />}
        {cta}
        {isLeft ? <ArrowRight className="h-4 w-4" /> : null}
      </button>
      <div
        className={`pointer-events-none absolute inset-y-0 w-10 from-black/15 to-transparent ${
          isLeft ? "right-0 bg-linear-to-l" : "left-0 bg-linear-to-r"
        }`}
      />
    </div>
  );
}

/**
 * Open book. The right-hand page is a "leaf" hinged on the spine:
 *   login  -> leaf lies on the right, its front side shows the login form
 *   signup -> leaf is turned over to the left, its back side shows the signup form
 */
export default function BookSpread({ mode, onToggle }) {
  const flipped = mode === "signup";

  return (
    <div className="book-scene hidden w-full max-w-4xl md:block">
      <div className="rounded-2xl bg-green-950 p-3 shadow-2xl">
        <div className="relative aspect-[16/10] min-h-[28rem]">
          <BlurbPage
            side="left"
            title="New here?"
            text="Create an account to save stories, track what you read and get picks made for you."
            cta="Create an account"
            onClick={onToggle}
          />
          <BlurbPage
            side="right"
            title="Welcome back"
            text="Already a reader? Log in and carry on reading."
            cta="Log in"
            onClick={onToggle}
          />

          <div className="book-leaf absolute inset-y-0 left-1/2 z-20 w-1/2" data-flipped={flipped}>
            <div className={`leaf-face leaf-front flex flex-col justify-center rounded-r-lg px-10 ${PAPER}`}>
              <LoginForm />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-black/15 to-transparent" />
            </div>

            <div className={`leaf-face leaf-back flex flex-col justify-center rounded-l-lg px-10 ${PAPER}`}>
              <SignupForm />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-black/15 to-transparent" />
            </div>
          </div>

          {/* spine */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-px -translate-x-1/2 bg-black/20" />
        </div>
      </div>
    </div>
  );
}
