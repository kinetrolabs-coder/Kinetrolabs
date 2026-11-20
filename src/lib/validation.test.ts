import { describe, expect, it } from "vitest";
import { registrationSchema } from "@/lib/validation";

describe("registrationSchema", () => {
  it("accepts a complete registration", () => {
    expect(registrationSchema.safeParse({ fullName: "Asha Rao", country: "India", city: "Pune", occupation: "Founder", mobile: "+91 98765 43210", email: "asha@example.com", age: 29, comments: "Hello", consent: true }).success).toBe(true);
  });
  it("rejects invalid email, age and mobile", () => {
    expect(registrationSchema.safeParse({ fullName: "A", country: "I", city: "P", occupation: "F", mobile: "bad", email: "bad", age: 5, consent: false }).success).toBe(false);
  });
});
