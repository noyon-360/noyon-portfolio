import type { Metadata } from "next";
import { SmoothScroll } from "@/case-study/lib/scroll";
import { Marquee, PullQuote } from "@/case-study/patterns/Blocks";
import Chrome from "@/case-study/patterns/Chrome";
import Closing from "@/case-study/scenes/Closing";
import FrontPage from "@/case-study/scenes/FrontPage";
import Comparison from "@/case-study/scenes/mongodb-ransomware-attack/Comparison";
import Evidence from "@/case-study/scenes/mongodb-ransomware-attack/Evidence";
import Hook from "@/case-study/scenes/mongodb-ransomware-attack/Hook";
import Lessons from "@/case-study/scenes/mongodb-ransomware-attack/Lessons";
import Q01WhatHappened from "@/case-study/scenes/mongodb-ransomware-attack/Q01WhatHappened";
import Q02System from "@/case-study/scenes/mongodb-ransomware-attack/Q02System";
import Q03Loss from "@/case-study/scenes/mongodb-ransomware-attack/Q03Loss";
import Q04WhoAffected from "@/case-study/scenes/mongodb-ransomware-attack/Q04WhoAffected";
import Q05Users from "@/case-study/scenes/mongodb-ransomware-attack/Q05Users";
import Q06Business from "@/case-study/scenes/mongodb-ransomware-attack/Q06Business";
import Q07WhoDidIt from "@/case-study/scenes/mongodb-ransomware-attack/Q07WhoDidIt";
import Q08RootCause from "@/case-study/scenes/mongodb-ransomware-attack/Q08RootCause";
import Q09Response from "@/case-study/scenes/mongodb-ransomware-attack/Q09Response";
import Q10Responsibility from "@/case-study/scenes/mongodb-ransomware-attack/Q10Responsibility";
import Timeline from "@/case-study/scenes/mongodb-ransomware-attack/Timeline";
import References from "@/case-study/scenes/References";
import { mongoClosing, mongoFront, mongoLesson, mongoMarquees, mongoNav, mongoRefs, mongoRefsNote } from "@/case-study/studies/mongodb-ransomware-attack";

export const metadata: Metadata = {
  title: "Nineteen months with the door open — Case study",
  description: mongoFront.deck,
};

export default function MongoRansomwarePage() {
  return (
    <>
      <SmoothScroll />
      <Chrome title="MongoDB ransomware attack" nav={mongoNav} />
      <main>
        <FrontPage front={mongoFront} />
        <Marquee items={mongoMarquees.front} caseId="c4" />

        <Hook />
        <Q01WhatHappened />
        <Timeline />
        <Q02System />
        <Q03Loss />
        <Q04WhoAffected />
        <Q05Users />
        <Q06Business />
        <Q07WhoDidIt />
        <Q08RootCause />
        <Q09Response />
        <Q10Responsibility />
        <Marquee items={mongoMarquees.middle} caseId="c4" />

        <Lessons />
        <PullQuote id={mongoLesson.id} caseId="c4" label="The lesson" quote={mongoLesson.quote} />
        <Comparison />

        <Closing closing={mongoClosing} related="shwapno-data-breach" />
        <Evidence />
        <References ids={mongoRefs} caseId="c4" note={mongoRefsNote} />
      </main>
    </>
  );
}
