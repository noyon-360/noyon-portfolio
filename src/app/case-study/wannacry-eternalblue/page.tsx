import type { Metadata } from "next";
import { marqueeC2, wannacryClosing, wannacryFront, wannacryNav, wannacryRefs } from "@/case-study/content";
import { SmoothScroll } from "@/case-study/lib/scroll";
import { Marquee } from "@/case-study/patterns/Blocks";
import Chrome from "@/case-study/patterns/Chrome";
import Case2Hook from "@/case-study/scenes/Case2Hook";
import Closing from "@/case-study/scenes/Closing";
import FrontPage from "@/case-study/scenes/FrontPage";
import Lessons from "@/case-study/scenes/Lessons";
import OtherAttacks from "@/case-study/scenes/OtherAttacks";
import People from "@/case-study/scenes/People";
import Q11WannaCry from "@/case-study/scenes/Q11WannaCry";
import Q12EternalBlue from "@/case-study/scenes/Q12EternalBlue";
import Q13Spread from "@/case-study/scenes/Q13Spread";
import Q14Affected from "@/case-study/scenes/Q14Affected";
import Q15Consequences from "@/case-study/scenes/Q15Consequences";
import Q16Services from "@/case-study/scenes/Q16Services";
import Q17Stopped from "@/case-study/scenes/Q17Stopped";
import Q18Updates from "@/case-study/scenes/Q18Updates";
import Q19Lesson from "@/case-study/scenes/Q19Lesson";
import References from "@/case-study/scenes/References";

export const metadata: Metadata = {
  title: "WannaCry and EternalBlue — Case study",
  description: wannacryFront.deck,
};

export default function WannaCryPage() {
  return (
    <>
      <SmoothScroll />
      <Chrome title={wannacryFront.masthead} nav={wannacryNav} />
      <main>
        <FrontPage front={wannacryFront} />
        <Marquee items={marqueeC2} caseId="c2" />

        <Case2Hook />
        <Q11WannaCry />
        <Q12EternalBlue />
        <Q13Spread />
        <Q14Affected />
        <Q15Consequences />
        <Q16Services />
        <Q17Stopped />
        <Lessons />
        <Q18Updates />
        <Q19Lesson />

        <People />
        <OtherAttacks />
        <Closing closing={wannacryClosing} related="shwapno-data-breach" />
        <References ids={wannacryRefs} caseId="c2" />
      </main>
    </>
  );
}
