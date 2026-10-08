import WordReveal from "../../patterns/WordReveal";
import { mongoHook } from "../../studies/mongodb-ransomware-attack";

/** The hook sentence, revealed word by word. */
export default function Hook() {
  return <WordReveal id={mongoHook.id} caseId={mongoHook.caseId} eyebrow={mongoHook.eyebrow} title={mongoHook.title} text={mongoHook.text} />;
}
