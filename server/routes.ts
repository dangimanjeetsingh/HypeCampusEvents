import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/featured", async (req, res) => {
    const events = await storage.getFeaturedEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    const result = insertEventSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid event data" });
    }
    const event = await storage.createEvent(result.data);
    res.status(201).json(event);
  });

  // Venues
  app.get("/api/venues", async (req, res) => {
    const venues = await storage.getVenues();
    res.json(venues);
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Registrations
  app.post("/api/events/:id/register", async (req, res) => {
    const eventId = Number(req.params.id);
    const userId = 1; // Hardcoded for demo
    const registration = await storage.createRegistration(eventId, userId);
    res.status(201).json(registration);
  });

  // Reviews
  app.get("/api/events/:id/reviews", async (req, res) => {
    const reviews = await storage.getEventReviews(Number(req.params.id));
    res.json(reviews);
  });

  app.post("/api/events/:id/reviews", async (req, res) => {
    const result = insertReviewSchema.safeParse({
      ...req.body,
      eventId: Number(req.params.id),
      userId: 1, // Hardcoded for demo
    });
    if (!result.success) {
      return res.status(400).json({ message: "Invalid review data" });
    }
    const review = await storage.createReview(result.data);
    res.status(201).json(review);
  });

  const httpServer = createServer(app);
  return httpServer;
}
