/**
 * MODULE 3: Express Framework
 * FILE: src/controllers/userController.ts
 * 
 * ==========================================
 * WHAT IS A CONTROLLER?
 * ==========================================
 * A controller contains the actual business logic for handling incoming API requests.
 * It is responsible for:
 *   1. Extracting inputs (query parameters, route parameters, body).
 *   2. Invoking database models or services.
 *   3. Returning the response JSON and HTTP status code.
 * 
 * By keeping this separate from route definitions, we make our code modular, 
 * clean, and easy to unit-test.
 */

import { Request, Response, NextFunction } from "express";
import { createUserSchema } from "../validation/userSchema";

// Mock Database inside memory
interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  role: string;
}

const mockUserDatabase: User[] = [
  { id: 1, username: "dev_john", email: "john@domain.com", age: 24, role: "user" },
  { id: 2, username: "admin_alice", email: "alice@domain.com", age: 31, role: "admin" }
];

export class UserController {
  /**
   * GET /api/users
   * Returns list of all users.
   */
  public static getUsers(req: Request, res: Response, next: NextFunction): void {
    try {
      res.status(200).json({
        status: "success",
        results: mockUserDatabase.length,
        data: mockUserDatabase
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Returns details of a specific user.
   */
  public static getUserById(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = parseInt(req.params.id, 10);
      
      const user = mockUserDatabase.find(u => u.id === userId);
      
      if (!user) {
        // Create an error object with status 404, then call next(err) 
        // to hand it off to our centralized error handler!
        const error: any = new Error(`User with ID ${userId} not found`);
        error.status = 404;
        throw error; // Or next(error);
      }

      res.status(200).json({
        status: "success",
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users
   * Validates input using Zod and adds user to the database.
   */
  public static createUser(req: Request, res: Response, next: NextFunction): void {
    try {
      // 1. Validate the body using the Zod schema. 
      // If validation fails, Zod throws an error which triggers catch(error) -> next(error).
      const validatedBody = createUserSchema.parse(req.body);

      // 2. Generate new user record
      const newUser: User = {
        id: mockUserDatabase.length + 1,
        username: validatedBody.username,
        email: validatedBody.email,
        age: validatedBody.age,
        role: validatedBody.role || "user"
      };

      // 3. Save to database
      mockUserDatabase.push(newUser);

      // 4. Return response
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }
}
