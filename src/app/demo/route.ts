import { redirect } from "next/navigation";
import { ensureDemoExchange } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  let target = "/";
  try {
    const demo = await ensureDemoExchange();
    const participant = demo.participants[0];
    if (participant) target = `/s/${participant.token}`;
  } catch {
    target = "/";
  }
  redirect(target);
}
