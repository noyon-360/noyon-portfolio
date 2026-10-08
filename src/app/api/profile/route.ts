import { profile, stats } from "@/data/content";

export function GET() {
  return Response.json({ ...profile, stats });
}
