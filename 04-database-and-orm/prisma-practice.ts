/**
 * MODULE 4: Databases and ORMs
 * FILE: prisma-practice.ts
 * 
 * ==========================================
 * TYPE-SAFE QUERIES WITH PRISMA CLIENT
 * ==========================================
 * In a real application, you generate the Prisma Client using: `npx prisma generate`.
 * You then import and instantiate the client in your code:
 *   import { PrismaClient } from "@prisma/client";
 *   const prisma = new PrismaClient();
 * 
 * The client automatically reads your schema and generates methods for database tables:
 *   - prisma.user.create() - Insert a row
 *   - prisma.user.findMany() - Fetch rows matching conditions
 *   - prisma.user.findUnique() - Fetch a row by primary key or unique key
 *   - prisma.user.update() - Update existing rows
 *   - prisma.user.delete() - Delete rows
 * 
 * ==========================================
 * MOCK DATABASE CLIENT SIMULATOR
 * ==========================================
 * To ensure this practice file works instantly without setting up a real database server,
 * we have built a simulated "mockPrisma" client below.
 * **The syntax is 100% identical to the real Prisma client.**
 */

export {};

// Simulated database arrays
interface UserRow {
  id: number;
  email: string;
  name: string | null;
  role: string;
  posts?: PostRow[];
}

interface PostRow {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number;
}

const dbUsers: UserRow[] = [
  { id: 1, email: "dev@work.com", name: "Dev Developer", role: "USER" },
  { id: 2, email: "lead@boss.com", name: "Lead Engineer", role: "ADMIN" }
];

const dbPosts: PostRow[] = [
  { id: 1, title: "Getting started with TS", content: "Markdown text...", published: true, authorId: 1 },
  { id: 2, title: "Scaling Express APIs", content: "Advanced guide...", published: false, authorId: 1 }
];

// Simulated Prisma Client
const mockPrisma = {
  user: {
    create: async (args: { data: { email: string; name?: string; role?: string } }): Promise<UserRow> => {
      const newUser: UserRow = {
        id: dbUsers.length + 1,
        email: args.data.email,
        name: args.data.name || null,
        role: args.data.role || "USER",
        posts: []
      };
      dbUsers.push(newUser);
      return newUser;
    },
    findMany: async (args?: { include?: { posts?: boolean } }): Promise<UserRow[]> => {
      return dbUsers.map(user => {
        if (args?.include?.posts) {
          return { ...user, posts: dbPosts.filter(post => post.authorId === user.id) };
        }
        return user;
      });
    },
    findUnique: async (args: { where: { id?: number; email?: string }; include?: { posts?: boolean } }): Promise<UserRow | null> => {
      const user = dbUsers.find(u => (args.where.id ? u.id === args.where.id : u.email === args.where.email));
      if (!user) return null;
      if (args.include?.posts) {
        return { ...user, posts: dbPosts.filter(p => p.authorId === user.id) };
      }
      return user;
    }
  },
  post: {
    create: async (args: { data: { title: string; content?: string; authorId: number; published?: boolean } }): Promise<PostRow> => {
      const newPost: PostRow = {
        id: dbPosts.length + 1,
        title: args.data.title,
        content: args.data.content || null,
        published: args.data.published || false,
        authorId: args.data.authorId
      };
      dbPosts.push(newPost);
      return newPost;
    },
    findMany: async (args?: { where?: { published?: boolean; authorId?: number } }): Promise<PostRow[]> => {
      let results = [...dbPosts];
      if (args?.where) {
        if (args.where.published !== undefined) {
          results = results.filter(p => p.published === args.where!.published);
        }
        if (args.where.authorId !== undefined) {
          results = results.filter(p => p.authorId === args.where!.authorId);
        }
      }
      return results;
    }
  }
};

// ============================================================================
// PRACTICE EXERCISES
// ============================================================================
// Write the functions below using standard Prisma Client query shapes.
// Use 'mockPrisma' in place of 'prisma'.

/**
 * Task 1: Create a new user record.
 * Parameters:
 *   - email: string
 *   - name: string
 * 
 * Instructions:
 * Call mockPrisma.user.create with the correct argument structure:
 *   await mockPrisma.user.create({ data: { email, name } })
 */
async function registerUser(email: string, name: string): Promise<UserRow> {
  // TODO: Implement using mockPrisma.user.create
  return {} as any;
}

/**
 * Task 2: Create a new post for an author.
 * Parameters:
 *   - title: string
 *   - authorId: number
 *   - isPublished: boolean
 * 
 * Instructions:
 * Call mockPrisma.post.create to link the post to the authorId.
 */
async function publishNewPost(title: string, authorId: number, isPublished: boolean): Promise<PostRow> {
  // TODO: Implement using mockPrisma.post.create
  return {} as any;
}

/**
 * Task 3: Get a user by ID and include all their posts.
 * Parameters:
 *   - userId: number
 * 
 * Instructions:
 * Call mockPrisma.user.findUnique. 
 * Use 'include' parameters to load the relation:
 *   include: { posts: true }
 */
async function getUserProfileWithPosts(userId: number): Promise<UserRow | null> {
  // TODO: Implement using mockPrisma.user.findUnique
  return null;
}

/**
 * Task 4: Retrieve all posts that are published.
 * 
 * Instructions:
 * Call mockPrisma.post.findMany with a filter on 'published: true'.
 */
async function fetchAllPublishedPosts(): Promise<PostRow[]> {
  // TODO: Implement using mockPrisma.post.findMany
  return [];
}


// ============================================================================
// INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 04-database-and-orm/prisma-practice.ts

console.log("\n=== Checking your database query solutions... ===");

async function validateSolutions() {
  try {
    // 1. Validate Register
    const regUser = await registerUser("jane@practice.com", "Jane Doe");
    let registerPass = false;
    if (regUser && regUser.email === "jane@practice.com" && regUser.id === 3) {
      console.log("✅ registerUser: Passed!");
      registerPass = true;
    } else {
      console.log("❌ registerUser: Failed.");
    }

    // 2. Validate Publish Post
    const newPost = await publishNewPost("Advanced SQL", 1, true);
    let publishPass = false;
    if (newPost && newPost.title === "Advanced SQL" && newPost.authorId === 1 && newPost.published === true) {
      console.log("✅ publishNewPost: Passed!");
      publishPass = true;
    } else {
      console.log("❌ publishNewPost: Failed.");
    }

    // 3. Validate Load relations
    const profile = await getUserProfileWithPosts(1);
    let relationPass = false;
    if (profile && profile.posts && profile.posts.length >= 2) {
      console.log("✅ getUserProfileWithPosts (Relations): Passed!");
      relationPass = true;
    } else {
      console.log("❌ getUserProfileWithPosts (Relations): Failed.");
    }

    // 4. Validate filter queries
    const published = await fetchAllPublishedPosts();
    let filterPass = false;
    // Expected: dbPosts has index 0 (true), newPost (true) -> total 2 published posts.
    if (published && published.length === 2 && published.every(p => p.published)) {
      console.log("✅ fetchAllPublishedPosts: Passed!");
      filterPass = true;
    } else {
      console.log(`❌ fetchAllPublishedPosts: Failed. Count was ${published.length}`);
    }

    if (registerPass && publishPass && relationPass && filterPass) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 4!");
    }

  } catch (err) {
    console.log("❌ Validation Error: Make sure mockPrisma calls match standard Prisma signatures.", err);
  }
}

validateSolutions();


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is an ORM? Why use one instead of raw SQL?
// A:  ORM (Object-Relational Mapping) translates between database rows and 
//     programming language objects. Benefits of Prisma:
//     - Type safety: Auto-generated types prevent SQL injection and typos.
//     - Migrations: Schema changes are version-controlled.
//     - Readability: prisma.user.findMany() vs. "SELECT * FROM users".
//     Trade-off: ORMs can generate inefficient queries for complex joins.
//
// Q2: What is the N+1 query problem? How does Prisma solve it?
// A:  N+1 happens when you fetch N records, then make 1 extra query per record 
//     for related data (e.g., fetch 100 users, then 100 separate post queries).
//     Prisma solves it with 'include': prisma.user.findMany({ include: { posts: true } })
//     generates a single JOIN query instead of N+1 queries.
//
// Q3: What is the difference between findUnique and findFirst?
// A:  findUnique: Searches by a UNIQUE field (id, email with unique constraint).
//     findFirst: Searches by ANY field and returns the first match.
//     findUnique is faster because the database can use an index directly.
//
// Q4: What are database migrations? Why are they important?
// A:  Migrations are version-controlled scripts that modify the database schema.
//     They track schema changes over time (like git for your database).
//     Prisma commands: npx prisma migrate dev (development), npx prisma migrate deploy.
//
// Q5: What is the difference between prisma.create and prisma.createMany?
// A:  create: Inserts ONE record and returns it (with full type safety).
//     createMany: Inserts MULTIPLE records at once (batch insert, faster).
//     createMany does NOT return the created records in all databases.
//
// Q6: How do you handle database transactions in Prisma?
// A:  Use prisma.$transaction([...]) to run multiple queries atomically.
//     If any query fails, ALL queries in the transaction are rolled back.
//     Example: Transfer money between accounts (debit + credit must both succeed).
