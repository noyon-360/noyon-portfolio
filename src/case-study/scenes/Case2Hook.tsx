import { case2 } from "../content";
import WordReveal from "../patterns/WordReveal";

/** Case 02 opener: the hook sentence, revealed word by word. */
export default function Case2Hook() {
  return <WordReveal id={case2.id} caseId="c2" eyebrow={case2.eyebrow} title={`${case2.title} (${case2.year})`} text={case2.hook} />;
}
