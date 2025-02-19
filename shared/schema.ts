import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  capacity: integer("capacity").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  imageUrl: text("image_url").notNull(),
  venueId: integer("venue_id").notNull(),
  categoryId: integer("category_id").notNull(),
  organizerId: integer("organizer_id").notNull(),
  capacity: integer("capacity").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  ticketCode: text("ticket_code").notNull().unique(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertEventSchema = createInsertSchema(events).extend({
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
});

export const insertRegistrationSchema = createInsertSchema(registrations);
export const insertReviewSchema = createInsertSchema(reviews);

// Types
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Venue = typeof venues.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type Review = typeof reviews.$inferSelect;
