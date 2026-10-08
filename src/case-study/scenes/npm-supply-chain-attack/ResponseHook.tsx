import WordReveal from "../../patterns/WordReveal";
import { npmParts } from "../../studies/npm-supply-chain-attack";

const part = npmParts.response;

/** Part 02 opener: the hook sentence, revealed word by word. */
export default function ResponseHook() {
  return <WordReveal id={part.id} caseId={part.caseId} eyebrow={part.eyebrow} title={`${part.title} — (${part.label})`} text={part.hook} />;
}
