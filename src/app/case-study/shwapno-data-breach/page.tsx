import type { Metadata } from "next";
import { marqueeC1, shwapnoClosing, shwapnoFront, shwapnoNav, shwapnoRefs } from "@/case-study/content";
import { SmoothScroll } from "@/case-study/lib/scroll";
import { Marquee } from "@/case-study/patterns/Blocks";
import Chrome from "@/case-study/patterns/Chrome";
import Case1Hook from "@/case-study/scenes/Case1Hook";
import ClaimedBy from "@/case-study/scenes/ClaimedBy";
import Closing from "@/case-study/scenes/Closing";
import FrontPage from "@/case-study/scenes/FrontPage";
import Q01WhatHappened from "@/case-study/scenes/Q01WhatHappened";
import Q02Organization from "@/case-study/scenes/Q02Organization";
import Q03DataExposed from "@/case-study/scenes/Q03DataExposed";
import Q04WhoAffected from "@/case-study/scenes/Q04WhoAffected";
import Q05CustomerProblems from "@/case-study/scenes/Q05CustomerProblems";
import Q06Reputation from "@/case-study/scenes/Q06Reputation";
import Q07CompanyActions from "@/case-study/scenes/Q07CompanyActions";
import Q08Lessons from "@/case-study/scenes/Q08Lessons";
import Q09ProtectData from "@/case-study/scenes/Q09ProtectData";
import Q10Lesson from "@/case-study/scenes/Q10Lesson";
import References from "@/case-study/scenes/References";
import WhoDidIt from "@/case-study/scenes/WhoDidIt";

export const metadata: Metadata = {
  title: "The Shwapno data breach — Case study",
  description: shwapnoFront.deck,
};

export default function ShwapnoPage() {
  return (
    <>
      <SmoothScroll />
      <Chrome title={shwapnoFront.masthead} nav={shwapnoNav} />
      <main>
        <FrontPage front={shwapnoFront} />
        <Marquee items={marqueeC1} caseId="c1" />

        <Case1Hook />
        <Q01WhatHappened />
        <Q02Organization />
        <Q03DataExposed />
        <Q04WhoAffected />
        <Q05CustomerProblems />
        <Q06Reputation />
        <Q07CompanyActions />
        <ClaimedBy />
        <Q08Lessons />
        <Q09ProtectData />
        <Q10Lesson />
        <WhoDidIt />

        <Closing closing={shwapnoClosing} related="wannacry-eternalblue" />
        <References ids={shwapnoRefs} />
      </main>
    </>
  );
}
