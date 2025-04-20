import { type Event, type Venue, type Category, type Registration, type Review, type InsertEvent, type User, type InsertUser } from "@shared/schema";
import { nanoid } from "nanoid";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  createUser(user: Omit<InsertUser, "confirmPassword">): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  getFeaturedEvents(): Promise<Event[]>;
  getEventsByCategory(categoryId: number): Promise<Event[]>;

  // Venues
  getVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;

  // Registrations
  createRegistration(eventId: number, userId: number): Promise<Registration>;
  getRegistration(id: number): Promise<Registration | undefined>;

  // Reviews
  getEventReviews(eventId: number): Promise<Review[]>;
  createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private events: Map<number, Event> = new Map();
  private venues: Map<number, Venue> = new Map();
  private categories: Map<number, Category> = new Map();
  private registrations: Map<number, Registration> = new Map();
  private reviews: Map<number, Review> = new Map();
  private users: Map<number, User> = new Map();
  private currentIds: { [key: string]: number } = {
    events: 1,
    venues: 1,
    categories: 1,
    registrations: 1,
    reviews: 1,
    users: 1,
  };

  sessionStore: session.Store;

  constructor() {
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Initialize with sample data
    this.initializeData();
  }

  // User Methods
  async createUser(userData: Omit<InsertUser, "confirmPassword">): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = {
      ...userData,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  // Keep existing methods...
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
        description: "Join us for the biggest tech event of the year! Participate in hackathons, workshops, and tech talks from industry experts.",
        startDate: new Date("2024-04-15T10:00:00"),
        endDate: new Date("2024-04-17T18:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176",
        venueId: 1,
        categoryId: 4, // Technical
        coordinatorId: 1,
        capacity: 500,
        isFeatured: true,
      },
      {
        id: this.currentIds.events++,
        title: "University Cricket Tournament",
        description: "The annual inter-department cricket tournament. Come support your department's team and enjoy a day of exciting matches.",
        startDate: new Date("2024-04-25T09:00:00"),
        endDate: new Date("2024-04-27T18:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
        venueId: 2, // Sports Complex
        categoryId: 3, // Sports
        coordinatorId: 1,
        capacity: 800,
        isFeatured: true,
      },
      {
        id: this.currentIds.events++,
        title: "Cultural Night",
        description: "A celebration of diverse cultures through music, dance, and art performances by students from various backgrounds.",
        startDate: new Date("2024-05-10T18:00:00"),
        endDate: new Date("2024-05-10T22:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3",
        venueId: 1, // University Auditorium
        categoryId: 2, // Cultural
        coordinatorId: 1,
        capacity: 450,
        isFeatured: false,
      },
      {
        id: this.currentIds.events++,
        title: "Research Symposium",
        description: "A platform for students and faculty to present their research work and exchange ideas in various academic disciplines.",
        startDate: new Date("2024-05-20T09:00:00"),
        endDate: new Date("2024-05-21T17:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1555421689-d68471e189f2",
        venueId: 1, // University Auditorium
        categoryId: 1, // Academic
        coordinatorId: 1,
        capacity: 300,
        isFeatured: false,
      },
      {
        id: this.currentIds.events++,
        title: "Football Championship",
        description: "The annual football championship between different colleges of the university. Don't miss this exciting sporting event!",
        startDate: new Date("2024-06-05T10:00:00"),
        endDate: new Date("2024-06-07T18:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c643e7f5c",
        venueId: 2, // Sports Complex
        categoryId: 3, // Sports
        coordinatorId: 1,
        capacity: 1000,
        isFeatured: true,
      },
      {
        id: this.currentIds.events++,
        title: "Robotics Workshop",
        description: "Learn the basics of robotics and participate in hands-on activities to build and program simple robots.",
        startDate: new Date("2024-06-15T10:00:00"),
        endDate: new Date("2024-06-16T17:00:00"),
        imageUrl: "https://images.unsplash.com/photo-1599008633840-052c7f756385",
        venueId: 1, // University Auditorium
        categoryId: 4, // Technical
        coordinatorId: 1,
        capacity: 150,
        isFeatured: false,
      },
    ];
    events.forEach(e => this.events.set(e.id, e));
  }

  // Keep existing event methods...
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

  // Keep other existing methods...
  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getEventsByCategory(categoryId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(e => e.categoryId === categoryId);
  }

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