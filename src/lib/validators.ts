import { z } from "zod";

export const trackEventSchema = z.object({
  apiKey: z.string().min(1),
  playerId: z.string().min(1),
  sessionId: z.string().optional(),
  eventName: z.string().min(1),
  properties: z.record(z.string(), z.unknown()).default({}),
  timestamp: z.string().datetime().optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;