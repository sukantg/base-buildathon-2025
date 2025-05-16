import {
  users,
  projects,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type UpdateUsername,
  type UpdateProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUsername(id: string, update: UpdateUsername): Promise<User | undefined>;
  updateProfile(id: string, update: UpdateProfile): Promise<User | undefined>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(userId: string, project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  searchProjects(userId: string, query: string): Promise<Project[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async updateUsername(
    id: string,
    update: UpdateUsername
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        username: update.username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateProfile(
    id: string,
    update: UpdateProfile
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        bio: update.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Project operations

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.date));
  }

  async createProject(userId: string, project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({
        ...project,
        userId,
      })
      .returning();
    return newProject;
  }

  async updateProject(
    id: number,
    projectData: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...projectData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });
    return result.length > 0;
  }

  async searchProjects(userId: string, query: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.userId, userId),
          like(projects.projectTitle, `%${query}%`)
        )
      )
      .orderBy(desc(projects.date));
  }
}

export const storage = new DatabaseStorage();
