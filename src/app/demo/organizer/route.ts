import { redirect } from "next/navigation";
import { ensureDemoExchange } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  let target = "/";
  try {
    const demo = await ensureDemoExchange();
    target = `/o/${demo.organizerToken}`;
  } catch {
    target = "/";
  }
  redirect(target);
}
