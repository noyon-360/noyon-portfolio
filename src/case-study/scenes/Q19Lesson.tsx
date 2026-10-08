import { c2Lesson } from "../content";
import { PullQuote } from "../patterns/Blocks";

/** 19 — the lesson learned, as a full-screen pull quote. */
export default function Q19Lesson() {
  return <PullQuote id={c2Lesson.id} n={c2Lesson.n} caseId="c2" label={c2Lesson.question} quote={c2Lesson.quote} />;
}
