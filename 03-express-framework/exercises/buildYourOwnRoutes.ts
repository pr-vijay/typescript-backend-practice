/**
 * MODULE 3: Express Framework
 * EXERCISE FILE: Build Your Own CRUD Routes
 * 
 * ==========================================
 * WHAT IS THIS FILE?
 * ==========================================
 * The files in src/ are READ-ONLY reference implementations showing you how 
 * a professional Express app is structured. THIS file is your practice arena.
 * 
 * You will build a complete CRUD (Create, Read, Update, Delete) API for a 
 * "Product" resource from scratch, using Express + TypeScript patterns.
 * 
 * ==========================================
 * WHAT IS CRUD?
 * ==========================================
 * CRUD stands for the four basic database operations:
 *   C - Create:  POST    /api/products       → Add a new product
 *   R - Read:    GET     /api/products       → Get all products
 *   R - Read:    GET     /api/products/:id   → Get one product by ID
 *   U - Update:  PUT     /api/products/:id   → Update an existing product
 *   D - Delete:  DELETE  /api/products/:id   → Remove a product
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: A Librarian's Desk
 * ==========================================
 * Think of each endpoint as a service at a library desk:
 *   - CREATE = "I want to donate a new book to the library."
 *   - READ   = "Can I see all books?" or "Can I see book #42?"
 *   - UPDATE = "I'd like to correct the author name on this book record."
 *   - DELETE = "Please remove this book from the catalog."
 * 
 * ==========================================
 * HOW TO RUN THIS FILE
 * ==========================================
 * This file is a STANDALONE Express server (separate from the src/ app).
 * Run:  npx ts-node 03-express-framework/exercises/buildYourOwnRoutes.ts
 * Test: Use curl, Postman, or your browser to hit http://localhost:4001/api/products
 */

import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 4001;

// Middleware: Parse JSON request bodies
app.use(express.json());

// ============================================================================
// IN-MEMORY DATABASE (Mock)
// ============================================================================

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// Starting data
const products: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 129.99, category: "electronics" },
  { id: 2, name: "Ergonomic Mouse", price: 59.99, category: "electronics" },
  { id: 3, name: "Standing Desk", price: 499.00, category: "furniture" },
];

let nextId = 4; // Auto-incrementing ID counter

// ============================================================================
// EXERCISE: Complete the 5 CRUD route handlers below
// ============================================================================

/**
 * GET /api/products
 * Returns ALL products.
 * Optional query parameter: ?category=electronics (filters by category)
 * 
 * Response format: { status: "success", results: N, data: [...] }
 */
app.get("/api/products", (req: Request, res: Response) => {
  // TODO: Read optional query param req.query.category
  // If category is provided, filter products by that category.
  // If not, return all products.
  // Send response with status 200.
});

/**
 * GET /api/products/:id
 * Returns a SINGLE product by its ID.
 * 
 * If found: { status: "success", data: product }
 * If NOT found: status 404, { status: "error", message: "Product not found" }
 * 
 * Hint: req.params.id is a STRING. Convert to number with parseInt().
 */
app.get("/api/products/:id", (req: Request, res: Response) => {
  // TODO: Parse the ID from req.params.id
  // Find the product in the array.
  // If not found, return 404.
  // If found, return 200 with the product.
});

/**
 * POST /api/products
 * Creates a NEW product.
 * 
 * Expected body: { name: string, price: number, category: string }
 * 
 * Validation:
 *   - name must exist and be a non-empty string
 *   - price must exist and be a positive number
 *   - category must exist and be a non-empty string
 * If validation fails: status 400, { status: "error", message: "..." }
 * If valid: status 201, { status: "success", data: newProduct }
 */
app.post("/api/products", (req: Request, res: Response) => {
  // TODO: Extract name, price, category from req.body.
  // Validate the inputs.
  // Create a new product with auto-incremented ID.
  // Push to the products array.
  // Return 201 with the new product.
});

/**
 * PUT /api/products/:id
 * Updates an EXISTING product.
 * 
 * Expected body: { name?: string, price?: number, category?: string }
 * (All fields are optional — only update the ones provided.)
 * 
 * If product found: Update it, return 200 with updated product.
 * If NOT found: Return 404.
 */
app.put("/api/products/:id", (req: Request, res: Response) => {
  // TODO: Find the product by ID.
  // If not found, return 404.
  // Update only the fields that are present in req.body.
  // Return the updated product.
});

/**
 * DELETE /api/products/:id
 * Removes a product from the database.
 * 
 * If found: Remove it, return 200 with { status: "success", message: "Product deleted" }
 * If NOT found: Return 404.
 */
app.delete("/api/products/:id", (req: Request, res: Response) => {
  // TODO: Find the product index by ID.
  // If not found, return 404.
  // Splice it from the array.
  // Return success message.
});


// ============================================================================
// START THE SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n🚀 Exercise Server running at http://localhost:${PORT}`);
  console.log(`\n📋 Test your endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/products`);
  console.log(`   GET    http://localhost:${PORT}/api/products/1`);
  console.log(`   GET    http://localhost:${PORT}/api/products?category=electronics`);
  console.log(`   POST   http://localhost:${PORT}/api/products  (body: { "name": "Webcam", "price": 79.99, "category": "electronics" })`);
  console.log(`   PUT    http://localhost:${PORT}/api/products/1  (body: { "price": 149.99 })`);
  console.log(`   DELETE http://localhost:${PORT}/api/products/3`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What is REST? What are its key principles?
// A:  REST (Representational State Transfer) is an architectural style for APIs:
//     - Stateless: Each request contains all info needed (no server sessions).
//     - Resource-based: URLs represent resources (nouns), not actions (verbs).
//     - HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
//     - Uniform interface: Consistent URL structure and response format.
//
// Q2: What is the difference between PUT and PATCH?
// A:  PUT replaces the ENTIRE resource (all fields must be provided).
//     PATCH partially updates (only changed fields are sent).
//     In practice, many APIs use PUT for partial updates too (pragmatic approach).
//
// Q3: What is middleware in Express? Give examples.
// A:  Middleware is a function that runs BETWEEN receiving a request and sending
//     a response. It has access to req, res, and next(). Examples:
//     - express.json() (body parser), cors(), helmet(), authentication checks,
//     - logging, rate limiting, error handling.
//
// Q4: Why should you use express.Router() instead of defining routes on app directly?
// A:  Router creates modular, mountable route handlers. Benefits:
//     - Separation of concerns (userRoutes, productRoutes in separate files).
//     - Reusable route prefixes (app.use("/api/users", userRouter)).
//     - Cleaner app.ts with only middleware and router mounting.
//
// Q5: How do you handle errors in Express?
// A:  1. Throw errors in route handlers/controllers.
//     2. Call next(error) to pass to the error-handling middleware.
//     3. Define error middleware with 4 params: (err, req, res, next).
//     4. Register error middleware LAST (after all routes).
//
// Q6: What HTTP status codes should you use for CRUD operations?
// A:  200 OK (successful GET/PUT), 201 Created (successful POST),
//     204 No Content (successful DELETE with no body),
//     400 Bad Request (validation failure), 404 Not Found, 409 Conflict (duplicate).
