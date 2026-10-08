import { skillTour, skills } from "@/data/content";

export function GET() {
  return Response.json({ highlights: skillTour, toolkit: skills });
}
