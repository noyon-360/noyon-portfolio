import { expertise } from "@/data/content";

export function GET() {
  return Response.json(expertise);
}
