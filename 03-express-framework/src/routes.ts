/**
 * MODULE 3: Express Framework
 * FILE: src/routes.ts
 * 
 * ==========================================
 * WHAT IS ROUTING?
 * ==========================================
 * Routing defines how application endpoints (URIs) respond to client requests.
 * By using Express Routers, we group related endpoints together rather than bloating
 * the main `app.ts` file.
 */

import { Router } from "express";
import { UserController } from "./controllers/userController";

const router = Router();

// Route mappings: HTTP Verb + Path + Controller Function Reference
router.get("/users", UserController.getUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);

export default router;
