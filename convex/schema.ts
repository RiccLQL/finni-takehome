import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  patients: defineTable({
    firstName: v.string(),
    middleName: v.optional(v.string()),
    lastName: v.string(),
    dateOfBirth: v.string(),
    status: v.union(v.literal("Inquiry"), v.literal("Onboarding"), v.literal("Active"), v.literal("Churned")),
    address: v.string(),
    notes: v.optional(v.string()),
  })
  .index("by_status", ["status"])
  .index("by_firstName", ["firstName"])
  .index("by_middleName", ["middleName"])
  .index("by_lastName", ["lastName"])
  .index("by_dateOfBirth", ["dateOfBirth"])
  .index("by_address", ["address"]),
});
