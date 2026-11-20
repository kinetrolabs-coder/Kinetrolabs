import { z } from "zod";
export const registrationSchema = z.object({ fullName: z.string().trim().min(2).max(120), country: z.string().trim().min(2).max(80), city: z.string().trim().min(2).max(80), occupation: z.string().trim().min(2).max(120), mobile: z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/), email: z.string().trim().email().max(255), age: z.coerce.number().int().min(13).max(120), comments: z.string().trim().max(2000).optional(), consent: z.literal(true) });
export type RegistrationInput = z.infer<typeof registrationSchema>;
