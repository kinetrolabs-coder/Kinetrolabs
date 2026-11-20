import { getPublicContent } from "@/lib/content";
export default async function Terms() { const { content } = await getPublicContent(); return <main className="mx-auto min-h-screen max-w-3xl px-6 pb-28 pt-40"><h1 className="font-display text-5xl">Terms and Conditions</h1><p className="mt-8 whitespace-pre-wrap leading-8 text-paper/65">{content.terms}</p></main> }
