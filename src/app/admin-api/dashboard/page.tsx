"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Search, Trash2, X } from "lucide-react";
import type { Service, SiteContent } from "@/types";

type Registration = { id: string; registrationNumber: string; fullName: string; country: string; city: string; occupation: string; mobile: string; email: string; age: number; comments?: string; status: string; adminNotes?: string; createdAt: string };
type Content = { content: SiteContent; services: Service[] };
const statuses = ["New", "Reviewed", "Contacted", "Approved", "Rejected"];
const input = "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-lime";

function Field({ label, value, onChange, area = false }: { label: string; value: string; onChange: (value: string) => void; area?: boolean }) {
  return <label className="grid gap-2 text-sm text-paper/70"><span>{label}</span>{area ? <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} className={input} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={input} />}</label>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"registrations" | "content">("registrations");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [content, setContent] = useState<Content | null>(null);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    void (async () => {
      const session = await fetch("/api/admin/session").then((response) => response.json());
      if (!session.authenticated) { router.replace("/admin"); return; }
      const [registrationResponse, contentResponse] = await Promise.all([fetch("/api/admin/registrations"), fetch("/api/admin/content")]);
      if (registrationResponse.ok) setRegistrations((await registrationResponse.json()).registrations);
      if (contentResponse.ok) setContent(await contentResponse.json());
      setReady(true);
    })();
  }, [router]);

  const filtered = useMemo(() => registrations.filter((item) => `${item.fullName} ${item.email} ${item.mobile} ${item.country} ${item.city} ${item.occupation}`.toLowerCase().includes(search.toLowerCase())), [registrations, search]);
  const updateRegistration = async (id: string, changes: { status?: string; adminNotes?: string }) => {
    const response = await fetch(`/api/admin/registrations/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(changes) });
    if (!response.ok) { const result = await response.json().catch(() => ({})); setNotice(result.error ?? "Could not update this registration."); return; }
    const updated = (await response.json()).registration as Registration;
    setRegistrations((items) => items.map((item) => item.id === id ? updated : item));
    setSelected(updated);
    setNotice("Registration updated.");
  };
  const deleteRegistration = async (id: string) => {
    if (!window.confirm("Delete this registration permanently?")) return;
    const response = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    if (response.ok) { setRegistrations((items) => items.filter((item) => item.id !== id)); setSelected(null); setNotice("Registration deleted."); }
    else { const result = await response.json().catch(() => ({})); setNotice(result.error ?? "Could not delete this registration."); }
  };
  const changeContent = (key: keyof SiteContent, value: string | string[]) => setContent((current) => current ? { ...current, content: { ...current.content, [key]: value } } : current);
  const uploadHeroImage = async (file?: File) => {
    if (!file || !content) return;
    setUploadingHero(true);
    setNotice("");
    try {
      const form = new FormData();
      form.set("image", file);
      const response = await fetch("/api/admin/hero-image", { method: "POST", body: form });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setNotice(result.error ?? "Could not upload the hero image."); return; }
      changeContent("heroBackgroundImage", result.url);
      setNotice("Hero image uploaded. Publish all website changes to make it live.");
    } catch {
      setNotice("Could not upload the hero image. Please try again.");
    } finally {
      setUploadingHero(false);
    }
  };
  const saveContent = async (event: FormEvent) => {
    event.preventDefault();
    if (!content) return;
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(content) });
    const result = await response.json().catch(() => ({}));
    setNotice(response.ok ? "Website content published." : result.error ?? "Could not save website content.");
  };
  if (!ready || !content) return <main className="grid min-h-screen place-items-center pt-24 text-paper/60">Loading secure admin panel...</main>;

  return <main className="min-h-screen px-4 pb-20 pt-28 md:px-8"><div className="mx-auto max-w-7xl">
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[.28em] text-lime">Kinetro Labs · Admin</p><h1 className="mt-3 font-display text-4xl font-semibold">Control centre</h1><p className="mt-3 text-paper/55">Manage registrations and publish website changes without editing code.</p></div><button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin"); }} className="rounded-full border border-white/15 px-5 py-3 text-sm">Sign out</button></header>
    <nav className="mt-10 flex gap-2 border-b border-white/10"><button onClick={() => setTab("registrations")} className={`px-4 py-3 text-sm ${tab === "registrations" ? "border-b-2 border-lime text-lime" : "text-paper/50"}`}>Registrations ({registrations.length})</button><button onClick={() => setTab("content")} className={`px-4 py-3 text-sm ${tab === "content" ? "border-b-2 border-lime text-lime" : "text-paper/50"}`}>Website content</button></nav>
    {notice && <p className="mt-5 rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-lime">{notice}</p>}
    {tab === "registrations" ? <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]"><div><div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4"><Search className="h-4 w-4 text-paper/40"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, mobile or city..." className="w-full bg-transparent py-3 text-sm outline-none" /></div><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-white/[.04] text-paper/50"><tr><th className="px-4 py-4">Registration</th><th className="px-4 py-4">Contact</th><th className="px-4 py-4">Location</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Date</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} onClick={() => setSelected(item)} className="cursor-pointer border-t border-white/10 hover:bg-white/[.04]"><td className="px-4 py-4"><p>{item.fullName}</p><p className="mt-1 text-xs text-lime">{item.registrationNumber}</p></td><td className="px-4 py-4 text-paper/60"><p>{item.email}</p><p>{item.mobile}</p></td><td className="px-4 py-4 text-paper/60">{item.city}, {item.country}</td><td className="px-4 py-4"><span className="rounded-full bg-violet/20 px-3 py-1 text-xs text-lime">{item.status}</span></td><td className="px-4 py-4 text-paper/50">{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-paper/50">No registrations found.</p>}</div></div>
      {selected ? <aside className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-widest text-lime">{selected.registrationNumber}</p><h2 className="mt-2 font-display text-2xl">{selected.fullName}</h2></div><button onClick={() => setSelected(null)}><X className="h-5 w-5 text-paper/50" /></button></div><div className="mt-6 space-y-3 text-sm text-paper/65"><p><b className="text-paper">Email:</b> {selected.email}</p><p><b className="text-paper">Mobile:</b> {selected.mobile}</p><p><b className="text-paper">Age:</b> {selected.age}</p><p><b className="text-paper">Occupation:</b> {selected.occupation}</p><p><b className="text-paper">Location:</b> {selected.city}, {selected.country}</p><p><b className="text-paper">Comments:</b> {selected.comments || "—"}</p></div><label className="mt-6 grid gap-2 text-sm text-paper/70">Status<select value={selected.status} onChange={(event) => void updateRegistration(selected.id, { status: event.target.value })} className={input}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => void updateRegistration(selected.id, { status: "Approved" })} className="rounded-xl bg-lime px-3 py-3 text-xs font-semibold text-ink">Accept / Approve</button><button type="button" onClick={() => void updateRegistration(selected.id, { status: "Contacted" })} className="rounded-xl border border-violet/50 px-3 py-3 text-xs text-paper">Mark contacted</button><button type="button" onClick={() => void updateRegistration(selected.id, { status: "Reviewed" })} className="rounded-xl border border-white/15 px-3 py-3 text-xs text-paper/70">Mark reviewed</button><button type="button" onClick={() => void updateRegistration(selected.id, { status: "Rejected" })} className="rounded-xl border border-red-400/30 px-3 py-3 text-xs text-red-300">Reject</button></div><label className="mt-4 grid gap-2 text-sm text-paper/70">Internal notes<textarea value={selected.adminNotes ?? ""} onChange={(event) => setSelected({ ...selected, adminNotes: event.target.value })} rows={4} className={input} /></label><button onClick={() => void updateRegistration(selected.id, { adminNotes: selected.adminNotes })} className="mt-3 w-full rounded-xl bg-lime px-4 py-3 text-sm font-semibold text-ink"><Save className="mr-2 inline h-4 w-4" />Save notes</button><button onClick={() => void deleteRegistration(selected.id)} className="mt-3 w-full rounded-xl border border-red-400/30 px-4 py-3 text-sm text-red-300"><Trash2 className="mr-2 inline h-4 w-4" />Delete registration</button></aside> : <aside className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/15 p-6 text-center text-paper/50">Select a registration to manage it.</aside>}
    </section> : <form onSubmit={saveContent} className="mt-7 space-y-8"><section className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><h2 className="font-display text-2xl">Homepage and brand content</h2><div className="mt-6 grid gap-5"><Field label="Hero headline" value={content.content.heroHeadline} onChange={(value) => changeContent("heroHeadline", value)} /><Field label="Hero description" value={content.content.heroDescription} onChange={(value) => changeContent("heroDescription", value)} area /><div className="grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"><div><h3 className="text-sm font-semibold text-paper">Hero background image</h3><p className="mt-1 text-xs leading-5 text-paper/50">Upload a JPG, PNG, WebP or AVIF up to 4 MB. It will cover the full hero area with a dark overlay. Publish website changes after uploading.</p></div><div className="flex flex-wrap items-center gap-3"><label className={`inline-flex cursor-pointer items-center rounded-full bg-lime px-4 py-2.5 text-sm font-semibold text-ink ${uploadingHero ? "pointer-events-none opacity-60" : ""}`}><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" disabled={uploadingHero} onChange={(event) => { void uploadHeroImage(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />{uploadingHero ? "Uploading image..." : "Choose hero image"}</label>{content.content.heroBackgroundImage && <button type="button" onClick={() => changeContent("heroBackgroundImage", "")} className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-paper/70 hover:border-white/30">Remove image</button>}</div>{content.content.heroBackgroundImage && <img src={content.content.heroBackgroundImage} alt="Current hero background preview" className="mt-2 h-36 w-full rounded-xl border border-white/10 object-cover object-center" />}</div><Field label="About section" value={content.content.about} onChange={(value) => changeContent("about", value)} area /></div></section>
      <section className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><h2 className="font-display text-2xl">Services</h2><div className="mt-6 grid gap-4">{content.services.map((service) => <div key={service.id} className="grid gap-3 rounded-xl border border-white/10 p-4 md:grid-cols-[1fr_1fr_120px_80px_auto] md:items-end"><Field label="Title" value={service.title} onChange={(value) => setContent({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, title: value } : item) })} /><Field label="Description" value={service.description} onChange={(value) => setContent({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, description: value } : item) })} /><Field label="Icon" value={service.icon} onChange={(value) => setContent({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, icon: value } : item) })} /><label className="grid gap-2 text-sm text-paper/70">Visible<input type="checkbox" checked={service.is_active} onChange={(event) => setContent({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, is_active: event.target.checked } : item) })} className="h-5 w-5 accent-lime" /></label><button type="button" onClick={() => setContent({ ...content, services: content.services.filter((item) => item.id !== service.id) })} className="rounded-xl border border-red-400/30 p-3 text-red-300"><Trash2 className="h-4 w-4" /></button></div>)}</div><button type="button" onClick={() => setContent({ ...content, services: [...content.services, { id: crypto.randomUUID(), title: "New service", description: "Describe this service.", icon: "Sparkles", is_active: true, sort_order: content.services.length + 1 }] })} className="mt-4 rounded-full border border-lime/40 px-4 py-2 text-sm text-lime">+ Add service</button></section>
      <section className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><h2 className="font-display text-2xl">Registration, contact, legal and SEO</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Registration heading" value={content.content.registrationHeading} onChange={(value) => changeContent("registrationHeading", value)} /><Field label="Contact email" value={content.content.contactEmail} onChange={(value) => changeContent("contactEmail", value)} /><Field label="Registration description" value={content.content.registrationDescription} onChange={(value) => changeContent("registrationDescription", value)} area /><Field label="WhatsApp number" value={content.content.whatsapp} onChange={(value) => changeContent("whatsapp", value)} /><Field label="Address" value={content.content.address} onChange={(value) => changeContent("address", value)} /><Field label="LinkedIn URL" value={content.content.linkedin} onChange={(value) => changeContent("linkedin", value)} /><Field label="Instagram URL" value={content.content.instagram} onChange={(value) => changeContent("instagram", value)} /><Field label="Footer text" value={content.content.footerText} onChange={(value) => changeContent("footerText", value)} /><Field label="SEO title" value={content.content.seoTitle} onChange={(value) => changeContent("seoTitle", value)} /><Field label="SEO description" value={content.content.seoDescription} onChange={(value) => changeContent("seoDescription", value)} area /><Field label="Privacy policy" value={content.content.privacyPolicy} onChange={(value) => changeContent("privacyPolicy", value)} area /><Field label="Terms and conditions" value={content.content.terms} onChange={(value) => changeContent("terms", value)} area /></div></section><button type="submit" className="sticky bottom-5 rounded-full bg-lime px-7 py-4 font-semibold text-ink shadow-2xl shadow-lime/20"><Save className="mr-2 inline h-4 w-4" />Publish all website changes</button>
    </form>}
  </div></main>;
}
