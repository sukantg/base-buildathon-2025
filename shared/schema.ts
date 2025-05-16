import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Project table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  hackathonName: varchar("hackathon_name").notNull(),
  projectTitle: varchar("project_title").notNull(),
  description: text("description").notNull(),
  date: date("date").notNull(),
  achievement: varchar("achievement"),
  teamSize: integer("team_size"),
  role: varchar("role"),
  demoUrl: varchar("demo_url"),
  githubUrl: varchar("github_url"),
  devpostUrl: varchar("devpost_url"),
  technologies: text("technologies").array(),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects)
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true });

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Username update schema
export const updateUsernameSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
});

export type UpdateUsername = z.infer<typeof updateUsernameSchema>;

// Profile update schema
export const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
