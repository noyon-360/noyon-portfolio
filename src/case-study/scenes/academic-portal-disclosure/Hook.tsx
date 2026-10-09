import WordReveal from "../../patterns/WordReveal";
import { portalHook } from "../../studies/academic-portal-disclosure";

/** The hook sentence, revealed word by word. */
export default function Hook() {
  return <WordReveal id={portalHook.id} caseId={portalHook.caseId} eyebrow={portalHook.eyebrow} title={portalHook.title} text={portalHook.text} />;
}
