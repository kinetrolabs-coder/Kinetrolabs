import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { RegistrationInput } from "@/lib/validation";
import type { RegistrationStatus } from "@/types";

export type LocalRegistration = RegistrationInput & { id: string; registrationNumber: string; status: RegistrationStatus; adminNotes?: string; createdAt: string; updatedAt: string };
const storePath = process.env.VERCEL ? path.join(os.tmpdir(), "kinetro-registrations.json") : path.join(process.cwd(), "data", "registrations.json");
let volatileRecords: LocalRegistration[] = [];

async function readAll(): Promise<LocalRegistration[]> {
  try { return JSON.parse(await readFile(storePath, "utf8")) as LocalRegistration[]; } catch { return volatileRecords; }
}
async function writeAll(records: LocalRegistration[]) {
  try { await mkdir(path.dirname(storePath), { recursive: true }); await writeFile(storePath, JSON.stringify(records, null, 2), "utf8"); volatileRecords = records; }
  catch { volatileRecords = records; }
}
export async function saveLocalRegistration(data: RegistrationInput): Promise<LocalRegistration> { const records = await readAll(); const year = new Date().getFullYear(); const sameYear = records.filter((record) => record.registrationNumber.startsWith(`SK-${year}-`)).length; const now = new Date().toISOString(); const record: LocalRegistration = { ...data, id: crypto.randomUUID(), registrationNumber: `SK-${year}-${String(sameYear + 1).padStart(6, "0")}`, status: "New", adminNotes: "", createdAt: now, updatedAt: now }; await writeAll([...records, record]); return record; }
export async function listLocalRegistrations() { return readAll(); }
export async function updateLocalRegistration(id: string, changes: Partial<Pick<LocalRegistration, "status" | "adminNotes">>) { const records = await readAll(); const index = records.findIndex((record) => record.id === id); if (index < 0) return null; records[index] = { ...records[index], ...changes, updatedAt: new Date().toISOString() }; await writeAll(records); return records[index]; }
export async function deleteLocalRegistration(id: string) { const records = await readAll(); const next = records.filter((record) => record.id !== id); if (next.length === records.length) return false; await writeAll(next); return true; }
