import type { Metadata } from "next";
import { SmoothScroll } from "@/case-study/lib/scroll";
import { Marquee } from "@/case-study/patterns/Blocks";
import Chrome from "@/case-study/patterns/Chrome";
import Closing from "@/case-study/scenes/Closing";
import FrontPage from "@/case-study/scenes/FrontPage";
import AttackHook from "@/case-study/scenes/npm-supply-chain-attack/AttackHook";
import Evidence from "@/case-study/scenes/npm-supply-chain-attack/Evidence";
import FixHeader from "@/case-study/scenes/npm-supply-chain-attack/FixHeader";
import Q01WhatHappened from "@/case-study/scenes/npm-supply-chain-attack/Q01WhatHappened";
import Q02WhoAffected from "@/case-study/scenes/npm-supply-chain-attack/Q02WhoAffected";
import Q03SupplyChain from "@/case-study/scenes/npm-supply-chain-attack/Q03SupplyChain";
import Q04WhatItDid from "@/case-study/scenes/npm-supply-chain-attack/Q04WhatItDid";
import Q05WhereCalling from "@/case-study/scenes/npm-supply-chain-attack/Q05WhereCalling";
import Q06MalwareType from "@/case-study/scenes/npm-supply-chain-attack/Q06MalwareType";
import Q07Symptoms from "@/case-study/scenes/npm-supply-chain-attack/Q07Symptoms";
import Q08HowFound from "@/case-study/scenes/npm-supply-chain-attack/Q08HowFound";
import Q09Cleanup from "@/case-study/scenes/npm-supply-chain-attack/Q09Cleanup";
import Q10Blocking from "@/case-study/scenes/npm-supply-chain-attack/Q10Blocking";
import Q11SourceFound from "@/case-study/scenes/npm-supply-chain-attack/Q11SourceFound";
import Q12WentWrong from "@/case-study/scenes/npm-supply-chain-attack/Q12WentWrong";
import Q13SecondDoor from "@/case-study/scenes/npm-supply-chain-attack/Q13SecondDoor";
import Q14WhatTaken from "@/case-study/scenes/npm-supply-chain-attack/Q14WhatTaken";
import Q15Cost from "@/case-study/scenes/npm-supply-chain-attack/Q15Cost";
import Q16Lesson from "@/case-study/scenes/npm-supply-chain-attack/Q16Lesson";
import Q17Lessons from "@/case-study/scenes/npm-supply-chain-attack/Q17Lessons";
import Q18EarlyWarning from "@/case-study/scenes/npm-supply-chain-attack/Q18EarlyWarning";
import ResponseHook from "@/case-study/scenes/npm-supply-chain-attack/ResponseHook";
import TheGap from "@/case-study/scenes/npm-supply-chain-attack/TheGap";
import Timeline from "@/case-study/scenes/npm-supply-chain-attack/Timeline";
import References from "@/case-study/scenes/References";
import WhoDidIt from "@/case-study/scenes/WhoDidIt";
import { npmClosing, npmFront, npmMarquees, npmNav, npmRefs, npmRefsNote, npmWho } from "@/case-study/studies/npm-supply-chain-attack";

export const metadata: Metadata = {
  title: "One install command, four servers — Case study",
  description: npmFront.deck,
};

export default function NpmSupplyChainPage() {
  return (
    <>
      <SmoothScroll />
      <Chrome title="npm supply-chain incident" nav={npmNav} />
      <main>
        <FrontPage front={npmFront} />
        <Marquee items={npmMarquees.front} caseId="c3a" />

        {/* Part 01 — the attack */}
        <AttackHook />
        <Q01WhatHappened />
        <Q02WhoAffected />
        <Q03SupplyChain />
        <Q04WhatItDid />
        <Q05WhereCalling />
        <Q06MalwareType />
        <Q07Symptoms />
        <WhoDidIt who={npmWho} caseId="c3a" />
        <Marquee items={npmMarquees.attack} caseId="c3a" />

        {/* Part 02 — the response */}
        <ResponseHook />
        <Q08HowFound />
        <Q09Cleanup />
        <Q10Blocking />
        <Q11SourceFound />
        <Q12WentWrong />
        <Q13SecondDoor />
        <Q14WhatTaken />
        <Q15Cost />
        <Q16Lesson />
        <Marquee items={npmMarquees.response} caseId="c3b" />

        {/* Part 03 — the fix */}
        <FixHeader />
        <Q17Lessons />
        <Q18EarlyWarning />
        <TheGap />
        <Timeline />

        <Closing closing={npmClosing} related="shwapno-data-breach" />
        <Evidence />
        <References ids={npmRefs} caseId="c3c" note={npmRefsNote} />
      </main>
    </>
  );
}
