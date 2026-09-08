import { redirect } from "next/navigation";
import { TRADUCAO_PADRAO } from "@/lib/bible";

export default function Biblia() {
  redirect(`/biblia/${TRADUCAO_PADRAO}/1/1`);
}
