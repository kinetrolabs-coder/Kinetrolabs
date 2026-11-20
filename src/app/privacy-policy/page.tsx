import { getPublicContent } from "@/lib/content";
export default async function PrivacyPolicy() { const { content } = await getPublicContent(); return <main className="mx-auto min-h-screen max-w-3xl px-6 pb-28 pt-40"><h1 className="font-display text-5xl">Privacy Policy</h1><p className="mt-8 whitespace-pre-wrap leading-8 text-paper/65">{content.privacyPolicy}</p></main> }
