import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator, SystemIndexes } from "convex/server";
import schema from "./schema";

export const getPatients = query({
  handler: async (ctx, args) => {
    return await ctx.db.query("patients").collect();
  },
});

export const addPatient = mutation({
  args: {
    patient: v.object({
      firstName: v.string(),
      middleName: v.optional(v.string()),
      lastName: v.string(),
      dateOfBirth: v.string(),
      status: v.optional(v.union(v.literal("Inquiry"), v.literal("Onboarding"), v.literal("Active"), v.literal("Churned"))),
      address: v.string(),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("patients", {
      ...args.patient,
      status: args.patient.status || "Inquiry",
    });
  },
});

export const deletePatients = mutation({
  args: {
    patientIds: v.array(v.id("patients")),
  },
  handler: async (ctx, args) => {
    for (const patientId of args.patientIds) {
      await ctx.db.delete(patientId);
    }
  },
});

export const getPatient = query({
  args: {
    patientId: v.id("patients"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.patientId);
  },
});

export const updatePatient = mutation({
  args: {
    patientId: v.id("patients"),
    patient: v.object({
      firstName: v.string(),
      middleName: v.optional(v.string()),
      lastName: v.string(),
      dateOfBirth: v.string(),
      status: v.optional(v.union(v.literal("Inquiry"), v.literal("Onboarding"), v.literal("Active"), v.literal("Churned"))),
      address: v.string(),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.patientId, {
      ...args.patient,
    });
  },
});
