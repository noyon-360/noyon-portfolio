import { c1Lesson } from "../content";
import { PullQuote } from "../patterns/Blocks";

/** 10 — the lesson learned, as a full-screen pull quote. */
export default function Q10Lesson() {
  return <PullQuote id={c1Lesson.id} n={c1Lesson.n} caseId="c1" label={c1Lesson.question} quote={c1Lesson.quote} />;
}
