import { projects } from "@/data/content";

export function GET() {
  return Response.json(projects);
}
