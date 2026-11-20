import type { Service, SiteContent } from "@/types";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminClient } from "@/lib/supabase/server";

export const defaultContent: SiteContent = {
  heroHeadline: "Code The Future",
  heroDescription: "We turn ambitious ideas into digital products, intelligent tools and brand experiences built to move your business forward.",
  heroBackgroundImage: "/images/hero-ai-lightbulb.svg",
  about: "Kinetro Labs is a technology and digital solutions agency helping businesses grow, innovate and build a stronger digital presence through IT solutions, AI technologies and social media services.",
  registrationHeading: "Let's build what comes next.",
  registrationDescription: "Share a few details and our team will be in touch with the right next step.",
  contactEmail: "",
  whatsapp: "",
  address: "",
  linkedin: "#",
  instagram: "#",
  footerText: "Code the Future.",
  seoTitle: "Kinetro Labs | Code the Future",
  seoDescription: "Technology, AI and digital solutions that move businesses forward.",
  privacyPolicy: "Your privacy matters to us. We only use submitted information to respond to your enquiry or registration.",
  terms: "Use of this website is subject to applicable laws and our reasonable terms of service."
};

export const defaultServices: Service[] = [
  { id: "it", title: "IT Solutions", description: "Business websites and web solutions built for clarity, scale and performance.", icon: "Code2", is_active: true, sort_order: 1 },
  { id: "ai", title: "AI Integration", description: "AI voice calling agents and intelligent solutions that make your operations more capable.", icon: "Bot", is_active: true, sort_order: 2 },
  { id: "social", title: "Social Media Services", description: "Strategy, management and content creation that turns attention into momentum.", icon: "Megaphone", is_active: true, sort_order: 3 }
];

const contentPath = path.join(process.cwd(), "data", "site-content.json");

type StoredContent = { content: SiteContent; services: Service[] };

async function readStoredContent(): Promise<StoredContent> {
  try {
    const saved = JSON.parse(await readFile(contentPath, "utf8")) as Partial<StoredContent>;
    return {
      content: { ...defaultContent, ...(saved.content ?? {}) },
      services: saved.services?.length ? saved.services : defaultServices
    };
  } catch {
    return { content: defaultContent, services: defaultServices };
  }
}

export async function getPublicContent() {
  const client = getAdminClient();
  if (client) {
    const { data } = await client.from("website_content").select("content").eq("section_key", "site_snapshot").maybeSingle();
    if (data?.content) {
      const saved = data.content as Partial<StoredContent>;
      return { content: { ...defaultContent, ...(saved.content ?? {}) }, services: saved.services?.length ? saved.services : defaultServices };
    }
  }
  return readStoredContent();
}

export async function saveSiteContent(data: StoredContent) {
  const client = getAdminClient();
  if (client) {
    const { error } = await client.from("website_content").upsert({ section_key: "site_snapshot", content: data, is_published: true, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
    if (error) throw new Error(`Could not publish website content: ${error.message}`);
    return data;
  }
  if (process.env.VERCEL) throw new Error("Website edits need Supabase configured (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) to persist on the live site.");
  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, JSON.stringify(data, null, 2), "utf8");
  return data;
}
