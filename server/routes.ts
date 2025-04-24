import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertReviewSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Events
  app.get("/api/events", async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    let events;
    
    if (categoryId) {
      events = await storage.getEventsByCategory(categoryId);
    } else {
      events = await storage.getEvents();
    }
    
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
    if (!req.user) {
      return res.status(401).json({ message: "Must be logged in to create events" });
    }

    // Check if the user is a coordinator
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ message: "Only coordinators can create events" });
    }

    const result = insertEventSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid event data", errors: result.error.format() });
    }
    
    // Make sure coordinatorId is set to the current user
    const eventData = { ...result.data, coordinatorId: req.user.id };
    const event = await storage.createEvent(eventData);
    res.status(201).json(event);
  });
  
  // Update event
  app.patch("/api/events/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Must be logged in to update events" });
    }

    // Check if the user is a coordinator
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ message: "Only coordinators can update events" });
    }

    const eventId = Number(req.params.id);
    const event = await storage.getEvent(eventId);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Validate the update data
    const result = insertEventSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid event data", errors: result.error.format() });
    }

    // Update the event
    const updatedEvent = await storage.updateEvent(eventId, result.data);
    res.json(updatedEvent);
  });
  
  // Delete event
  app.delete("/api/events/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Must be logged in to delete events" });
    }

    // Check if the user is a coordinator
    if (req.user.role !== 'coordinator') {
      return res.status(403).json({ message: "Only coordinators can delete events" });
    }

    const eventId = Number(req.params.id);
    const event = await storage.getEvent(eventId);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete the event
    await storage.deleteEvent(eventId);
    res.status(204).send();
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

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategory(Number(req.params.id));
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  app.get("/api/categories/:id/events", async (req, res) => {
    const categoryId = Number(req.params.id);
    const category = await storage.getCategory(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const events = await storage.getEventsByCategory(categoryId);
    res.json(events);
  });

  // Registrations
  app.post("/api/events/:id/register", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Must be logged in to register for events" });
    }

    const eventId = Number(req.params.id);
    const registration = await storage.createRegistration(eventId, req.user.id);
    res.status(201).json(registration);
  });

  // Reviews
  app.get("/api/events/:id/reviews", async (req, res) => {
    const reviews = await storage.getEventReviews(Number(req.params.id));
    res.json(reviews);
  });

  app.post("/api/events/:id/reviews", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Must be logged in to post reviews" });
    }

    const result = insertReviewSchema.safeParse({
      ...req.body,
      eventId: Number(req.params.id),
      userId: req.user.id,
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