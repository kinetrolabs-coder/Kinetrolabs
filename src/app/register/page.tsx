"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { Button, SectionLabel } from "@/components/ui";

const schema = z.object({
  fullName: z.string().min(2), country: z.string().min(2), city: z.string().min(2),
  occupation: z.string().min(2), mobile: z.string().regex(/^\+?[0-9 ()-]{8,20}$/),
  email: z.string().email(), age: z.coerce.number().int().min(13).max(120),
  comments: z.string().max(2000).optional(), captchaAnswer: z.string().min(1), consent: z.literal(true)
});
type Form = z.infer<typeof schema>;
const fields = [["fullName", "Full Name", "Your full name"], ["country", "Country", "Country"], ["city", "City", "City"], ["occupation", "Occupation", "What do you do?"], ["mobile", "Mobile Number", "+91 00000 00000"], ["email", "Email Address", "you@example.com"], ["age", "Age", "25"]] as const;
const input = "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-paper outline-none transition placeholder:text-paper/30 focus:border-lime focus:ring-2 focus:ring-lime/20";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [captcha, setCaptcha] = useState({ question: "Loading verification...", token: "" });
  const reduceMotion = useReducedMotion();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>();

  const refreshCaptcha = useCallback(async () => {
    try {
      const response = await fetch("/api/captcha", { cache: "no-store" });
      if (!response.ok) throw new Error("Verification unavailable");
      setCaptcha(await response.json());
    } catch {
      setCaptcha({ question: "Verification could not load. Please refresh this page.", token: "" });
    }
  }, []);

  useEffect(() => { void refreshCaptcha(); }, [refreshCaptcha]);

  const submit = async (data: Form) => {
    const result = schema.safeParse(data);
    if (!result.success) { setMessage("Please complete each required field and check your details."); return; }
    if (!captcha.token) { setMessage("Verification is unavailable. Refresh the page and try again."); return; }
    try {
      const response = await fetch("/api/registrations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...result.data, captchaToken: captcha.token }) });
      const body = await response.json();
      setMessage(response.ok ? `Registration received. Your ID is ${body.registrationNumber}.` : (body.error ?? "Something went wrong."));
      if (!response.ok) await refreshCaptcha();
    } catch {
      setMessage("We could not send your registration. Please try again.");
    }
  };

  return <motion.main className="registration-page relative min-h-screen px-5 pb-20 pt-28 md:px-8 md:pt-32" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>
    <Link href="/" aria-label="Close registration and return to homepage" title="Close and return home" className="registration-close fixed right-4 top-24 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink/80 text-paper/70 shadow-xl backdrop-blur transition hover:rotate-90 hover:border-lime/50 hover:bg-lime/10 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime md:right-8"><X className="h-5 w-5" /></Link>
    <div className="mx-auto max-w-6xl">
      <motion.div className="mb-7 max-w-2xl pr-12" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: reduceMotion ? 0 : .08 }}>
        <SectionLabel>Start a conversation</SectionLabel><h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Let's build something <span className="text-gradient">meaningful</span></h1><p className="mt-4 text-base leading-7 text-paper/60 md:text-lg">Tell Kinetro Labs where you want to go. We will review your details and get back to you with the right next step.</p>
      </motion.div>
      <motion.div className="registration-panel grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.03] shadow-2xl shadow-black/30 lg:grid-cols-[.72fr_1.28fr]" initial={reduceMotion ? false : { opacity: 0, y: 28, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: reduceMotion ? 0 : .16, ease: [.2, .75, .2, 1] }}>
        <aside className="registration-aside relative overflow-hidden bg-violet/15 p-7 md:p-10">
          <div className="registration-orb" aria-hidden="true" />
          <div className="relative z-10"><p className="font-display text-2xl font-semibold">Code the Future</p><p className="mt-4 leading-7 text-paper/65">A clear brief is the first step toward a better digital experience.</p><div className="mt-8 grid gap-4 text-sm text-paper/75"><p><CheckCircle2 className="mr-3 inline h-5 w-5 text-lime" />Share your requirements</p><p><CheckCircle2 className="mr-3 inline h-5 w-5 text-lime" />Receive a personal follow-up</p><p><CheckCircle2 className="mr-3 inline h-5 w-5 text-lime" />Move forward with clarity</p></div><Button href="/#services" className="mt-8 border border-white/15 bg-white/5 text-paper">Explore services <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
        </aside>
        <form onSubmit={handleSubmit(submit)} className="registration-form grid gap-5 p-6 md:grid-cols-2 md:p-9" noValidate>
          {fields.map(([name, label, placeholder]) => <label key={name} className="grid content-start gap-2 text-sm text-paper/70">{label}<input {...register(name)} type={name === "age" ? "number" : name === "email" ? "email" : "text"} min={name === "age" ? 13 : undefined} max={name === "age" ? 120 : undefined} placeholder={placeholder} aria-invalid={Boolean(errors[name])} className={input} />{errors[name] && <span className="text-xs text-red-300">Please enter a valid {label.toLowerCase()}.</span>}</label>)}
          <label className="grid gap-2 text-sm text-paper/70 md:col-span-2">Additional comments<textarea {...register("comments")} rows={3} placeholder="Anything else we should know?" className={input} /></label>
          <label className="grid gap-2 text-sm text-paper/70 md:col-span-2">Verification question<span className="font-display text-lg text-lime">{captcha.question}</span><input {...register("captchaAnswer")} inputMode="numeric" placeholder="Enter your answer" aria-invalid={Boolean(errors.captchaAnswer)} className={input} /></label>
          <label className="flex items-start gap-3 text-sm text-paper/60 md:col-span-2"><input type="checkbox" {...register("consent")} className="mt-1 h-4 w-4 accent-lime" />I agree to the privacy notice and consent to Kinetro Labs contacting me about this submission.</label>
          {errors.consent && <span className="text-xs text-red-300 md:col-span-2">Consent is required.</span>}
          <div className="md:col-span-2"><Button type="submit" disabled={isSubmitting} className="bg-lime text-ink">{isSubmitting ? "Sending..." : "Submit registration"} <ArrowRight className="ml-2 h-4 w-4" /></Button>{message && <p role="status" className="mt-4 rounded-xl border border-lime/20 bg-lime/10 px-4 py-3 text-sm text-lime">{message}</p>}</div>
        </form>
      </motion.div>
    </div>
  </motion.main>;
}
