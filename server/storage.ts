import { type Event, type Venue, type Category, type Registration, type Review, type InsertEvent } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getFeaturedEvents(): Promise<Event[]>;
  
  // Venues
  getVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  
  // Registrations
  createRegistration(eventId: number, userId: number): Promise<Registration>;
  getRegistration(id: number): Promise<Registration | undefined>;
  
  // Reviews
  getEventReviews(eventId: number): Promise<Review[]>;
  createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review>;
}

export class MemStorage implements IStorage {
  private events: Map<number, Event> = new Map();
  private venues: Map<number, Venue> = new Map();
  private categories: Map<number, Category> = new Map();
  private registrations: Map<number, Registration> = new Map();
  private reviews: Map<number, Review> = new Map();
  private currentIds: { [key: string]: number } = {
    events: 1,
    venues: 1,
    categories: 1,
    registrations: 1,
    reviews: 1,
  };

  constructor() {
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add venues
    const venues: Venue[] = [
      {
        id: this.currentIds.venues++,
        name: "University Auditorium",
        location: "Main Campus",
        imageUrl: "https://images.unsplash.com/photo-1737107917737-27f5530650db",
        capacity: 500,
      },
      {
        id: this.currentIds.venues++,
        name: "Sports Complex",
        location: "North Campus",
        imageUrl: "https://images.unsplash.com/photo-1737107917840-ea155fb60498",
        capacity: 1000,
      },
    ];
    venues.forEach(v => this.venues.set(v.id, v));

    // Add categories
    const categories: Category[] = [
      { id: this.currentIds.categories++, name: "Academic", slug: "academic" },
      { id: this.currentIds.categories++, name: "Cultural", slug: "cultural" },
      { id: this.currentIds.categories++, name: "Sports", slug: "sports" },
      { id: this.currentIds.categories++, name: "Technical", slug: "technical" },
    ];
    categories.forEach(c => this.categories.set(c.id, c));

    // Add sample events
    const events: Event[] = [
      {
        id: this.currentIds.events++,
        title: "Annual Tech Fest",
        description: "Join us for the biggest tech event of the year!",
        startDate: new Date("2024-04-15T10:00:00"),
        endDate: new Date("2024-04-17T18:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176",
        venueId: 1,
        categoryId: 4,
        organizerId: 1,
        capacity: 500,
        isFeatured: true,
      },
    ];
    events.forEach(e => this.events.set(e.id, e));
  }

  // Event Methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentIds.events++;
    const newEvent = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(e => e.isFeatured);
  }

  // Venue Methods
  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  // Category Methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Registration Methods
  async createRegistration(eventId: number, userId: number): Promise<Registration> {
    const id = this.currentIds.registrations++;
    const registration: Registration = {
      id,
      eventId,
      userId,
      ticketCode: nanoid(10),
      registeredAt: new Date(),
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  // Review Methods
  async getEventReviews(eventId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.eventId === eventId);
  }

  async createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
    const id = this.currentIds.reviews++;
    const newReview: Review = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }
}

export const storage = new MemStorage();
