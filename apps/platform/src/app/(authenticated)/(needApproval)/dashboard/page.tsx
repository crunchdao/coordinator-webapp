import { redirect } from "next/navigation";
import { INTERNAL_LINKS } from "@/utils/routes";

export default function DashboardPage() {
  redirect(INTERNAL_LINKS.ONCHAIN_EXPLORER);
}
