import { redirect } from "next/navigation";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";

type Props = {
  params: Promise<{ crunchname: string }>;
};

export default async function CrunchPage({ params }: Props) {
  const { crunchname } = await params;
  redirect(generateLink(INTERNAL_LINKS.CRUNCH_OVERVIEW, { crunchname }));
}
