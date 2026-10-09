import type { Metadata } from "next";
import { SmoothScroll } from "@/case-study/lib/scroll";
import { Marquee, PullQuote } from "@/case-study/patterns/Blocks";
import Chrome from "@/case-study/patterns/Chrome";
import Hook from "@/case-study/scenes/academic-portal-disclosure/Hook";
import Q01WhatHappened from "@/case-study/scenes/academic-portal-disclosure/Q01WhatHappened";
import Q02System from "@/case-study/scenes/academic-portal-disclosure/Q02System";
import Q03Weaknesses from "@/case-study/scenes/academic-portal-disclosure/Q03Weaknesses";
import Q04WhoAffected from "@/case-study/scenes/academic-portal-disclosure/Q04WhoAffected";
import Q05Problems from "@/case-study/scenes/academic-portal-disclosure/Q05Problems";
import Q06Organisation from "@/case-study/scenes/academic-portal-disclosure/Q06Organisation";
import Q07Actions from "@/case-study/scenes/academic-portal-disclosure/Q07Actions";
import Q08Lessons from "@/case-study/scenes/academic-portal-disclosure/Q08Lessons";
import Q09Protect from "@/case-study/scenes/academic-portal-disclosure/Q09Protect";
import Q10Personal from "@/case-study/scenes/academic-portal-disclosure/Q10Personal";
import TheLine from "@/case-study/scenes/academic-portal-disclosure/TheLine";
import Closing from "@/case-study/scenes/Closing";
import FrontPage from "@/case-study/scenes/FrontPage";
import References from "@/case-study/scenes/References";
import { portalClosing, portalFront, portalLesson, portalMarquees, portalNav, portalRefsNote } from "@/case-study/studies/academic-portal-disclosure";

export const metadata: Metadata = {
  title: "Knowing where to stop — Case study",
  description: portalFront.deck,
};

export default function AcademicPortalDisclosurePage() {
  return (
    <>
      <SmoothScroll />
      <Chrome title="Responsible disclosure" nav={portalNav} />
      <main>
        <FrontPage front={portalFront} />
        <Marquee items={portalMarquees.front} caseId="c5" />

        <Hook />
        <Q01WhatHappened />
        <Q02System />
        <Q03Weaknesses />
        <Q04WhoAffected />
        <Q05Problems />
        <Q06Organisation />
        <Q07Actions />
        <TheLine />
        <Marquee items={portalMarquees.middle} caseId="c5" />
        <Q08Lessons />
        <Q09Protect />
        <Q10Personal />

        <PullQuote id={portalLesson.id} caseId="c5" label="The lesson" quote={portalLesson.quote} />
        <Closing closing={portalClosing} related="mongodb-ransomware-attack" />
        <References ids={[]} caseId="c5" note={portalRefsNote} />
      </main>
    </>
  );
}
