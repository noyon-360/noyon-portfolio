import { case1 } from "../content";
import WordReveal from "../patterns/WordReveal";

/** Case 01 opener: the hook sentence, revealed word by word. */
export default function Case1Hook() {
  return <WordReveal id={case1.id} caseId="c1" eyebrow={case1.eyebrow} title={`${case1.title} (${case1.year})`} text={case1.hook} note={case1.spellingNote} />;
}
