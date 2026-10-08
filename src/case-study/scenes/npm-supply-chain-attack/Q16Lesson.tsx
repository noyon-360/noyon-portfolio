import { PullQuote } from "../../patterns/Blocks";
import { npmLesson } from "../../studies/npm-supply-chain-attack";

/** 16 — the lesson learned, as a full-screen pull quote. */
export default function Q16Lesson() {
  return <PullQuote id={npmLesson.id} n={npmLesson.n} caseId="c3b" label={npmLesson.question} quote={npmLesson.quote} />;
}
