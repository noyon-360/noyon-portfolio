import { Instrument_Serif } from "next/font/google";
import "@/case-study/case-study.css";

const serif = Instrument_Serif({
  variable: "--font-cs-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// The case study keeps its own fixed editorial palette (see .cs-root), whatever portfolio theme is active.
export default function CaseStudyLayout({ children }: LayoutProps<"/case-study">) {
  return <div className={`${serif.variable} cs-root`}>{children}</div>;
}
