/**
 * MODULE 5: Advanced Backend Concepts
 * FILE 2: Secure Hashing & JWT Authentication
 * 
 * ==========================================
 * WHAT IS PASSWORD HASHING AND JWT?
 * ==========================================
 * 1. Password Hashing (Bcrypt): Never, ever store passwords as plain-text in a database!
 *    If your database gets leaked, hackers will steal every account.
 *    We use a cryptographic hash function (like Bcrypt) to turn a password into an irreversible, 
 *    scrambled string (a hash). This hash cannot be decoded back to the password.
 * 
 * 2. JSON Web Token (JWT): In stateless REST APIs, the server does not store user session data in memory.
 *    Instead, upon successful login, the server sends a cryptographically signed token (JWT) to the client.
 *    The client attaches this token to the headers of subsequent requests (`Authorization: Bearer <token>`).
 *    The server verifies the signature of the token to authenticate the user.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY:
 * ==========================================
 * - Hashing: Putting a letter in a paper shredder. You can't reconstruct the letter, 
 *   but if you shred an identical letter, the shredded pieces look exactly the same.
 * - JWT: An amusement park wristband. 
 *   When you buy a ticket, they lock a wristband onto your arm stamped with your permissions 
 *   (e.g., "Full Day Access", "Valid until 9 PM") and a secure stamp. 
 *   Every ride operator inspects the stamp to let you on, without checking a central database.
 */

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

// Secret key to sign our JWTs. Keep this extremely secure (loaded from process.env in production!).
const JWT_SECRET = "my_super_secret_developer_key_12345";

// ============================================================================
// 1. PASSWORD HASHING EXPLAINED
// ============================================================================

async function demonstratePasswordSecurity() {
  const plainPassword = "mySecretPassword123";

  // saltRounds: The work factor. It determines how slow the hash calculation is.
  // 10 is standard for modern servers. Higher values make it harder for hackers to brute-force.
  const saltRounds = 10;

  // Hash the password asynchronously
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log(`[Bcrypt] Scrambled Output: ${hashedPassword}`);

  // Checking if a user entered password matches the database hash:
  const isMatch = await bcrypt.compare("mySecretPassword123", hashedPassword);
  console.log(`[Bcrypt] Match check (correct password): ${isMatch}`); // true

  const isWrongMatch = await bcrypt.compare("wrongPass", hashedPassword);
  console.log(`[Bcrypt] Match check (wrong password): ${isWrongMatch}`); // false
}

demonstratePasswordSecurity();

// ============================================================================
// 2. JWT TOKEN CREATION & VERIFICATION EXPLAINED
// ============================================================================

interface TokenPayload {
  userId: number;
  role: string;
}

function demonstrateTokens() {
  const userPayload: TokenPayload = { userId: 42, role: "editor" };

  // Sign and create a token. It expires in 1 hour.
  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "1h" });
  console.log(`[JWT] Generated Token: ${token}`);

  // Verify the token
  try {
    const verifiedPayload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log(`[JWT] Decoded token payload: userId=${verifiedPayload.userId}, role=${verifiedPayload.role}`);
  } catch (error) {
    console.error("[JWT] Token verification failed (invalid or expired!)");
  }
}

demonstrateTokens();

// ============================================================================
// 3. PRACTICE EXERCISE: Auth Service Utility
// ============================================================================
// Write functions to register (hash) passwords, login (compare), and verify tokens.

interface RegisteredUserDto {
  email: string;
  passwordHash: string;
}

class AuthService {
  /**
   * Task 1: Hash the raw password before saving it.
   * Return a RegisteredUserDto containing the email and the generated password hash.
   */
  public async hashUserPassword(email: string, rawPassword: string): Promise<RegisteredUserDto> {
    // TODO: Hash rawPassword using bcrypt (saltRounds = 10) and return the object.
    return {} as any;
  }

  /**
   * Task 2: Validate credentials during login.
   * If correct, sign a JWT token containing { email } and return it.
   * If incorrect, throw an Error("Invalid credentials").
   */
  public async loginUser(
    enteredPassword: string,
    storedUserRecord: RegisteredUserDto
  ): Promise<string> {
    // TODO: Compare enteredPassword with storedUserRecord.passwordHash.
    // If they match, generate a JWT token using JWT_SECRET expiring in "2h" and return it.
    // If they don't match, throw new Error("Invalid credentials").
    return "";
  }

  /**
   * Task 3: Authenticate an incoming request token.
   * If valid, return the decoded payload containing { email }.
   * If invalid or expired, return null.
   */
  public verifyRequestToken(token: string): { email: string } | null {
    // TODO: Verify token against JWT_SECRET. Return the decoded payload or null on error.
    return null;
  }
}


// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// DO NOT MODIFY THE CODE BELOW.
// Run using: npx ts-node 05-advanced-concepts/02-jwt-authentication.ts

console.log("\n=== Checking your Authentication solutions... ===");

// We wrap validator in a setTimeout to let the demonstrations finish printing first.
setTimeout(async () => {
  try {
    const auth = new AuthService();

    // 1. Test registration hash
    const userReg = await auth.hashUserPassword("user@mail.com", "pass123");
    let regPass = false;
    if (userReg && userReg.email === "user@mail.com" && userReg.passwordHash !== "pass123" && userReg.passwordHash.startsWith("$2")) {
      console.log("✅ hashUserPassword: Passwords successfully hashed!");
      regPass = true;
    } else {
      console.log("❌ hashUserPassword: Password was not hashed properly.");
    }

    // 2. Test login token creation
    let token = "";
    let loginPass = false;
    try {
      token = await auth.loginUser("pass123", userReg);
      if (token && typeof token === "string") {
        console.log("✅ loginUser (Successful): Passed!");
        loginPass = true;
      }
    } catch {
      console.log("❌ loginUser (Successful): Failed to authenticate correct credentials.");
    }

    // Test login fail
    let loginFailPass = false;
    try {
      await auth.loginUser("wrong_password", userReg);
      console.log("❌ loginUser (Failure case): Failed to reject incorrect password.");
    } catch (e: any) {
      if (e.message === "Invalid credentials") {
        console.log("✅ loginUser (Failure case): Correctly rejected invalid credentials!");
        loginFailPass = true;
      }
    }

    // 3. Test verification
    let verifyPass = false;
    if (token) {
      const decoded = auth.verifyRequestToken(token);
      if (decoded && decoded.email === "user@mail.com") {
        console.log("✅ verifyRequestToken (Valid token): Passed!");
        verifyPass = true;
      } else {
        console.log("❌ verifyRequestToken (Valid token): Failed.");
      }

      const badDecoded = auth.verifyRequestToken("invalid_token_header_fake");
      if (badDecoded === null) {
        console.log("✅ verifyRequestToken (Invalid token check): Passed!");
      } else {
        console.log("❌ verifyRequestToken (Invalid token check): Failed to reject invalid token.");
      }
    }

    if (regPass && loginPass && loginFailPass && verifyPass) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 5, File 2!");
    }

  } catch (err) {
    console.log("❌ Validation Error: Make sure your methods use async bcrypt calls and jwt.verify try/catch blocks.", err);
  }
}, 500);


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: Why should you NEVER store passwords in plain text?
// A:  If the database is breached, attackers get every user's password instantly.
//     Hashed passwords are irreversible — even with the database, attackers must
//     brute-force each hash individually, which takes years with bcrypt.
//
// Q2: What is a "salt" in bcrypt? Why is it important?
// A:  A salt is random data added to the password BEFORE hashing. It ensures
//     that two users with the same password ("password123") get different hashes.
//     Without salts, attackers can use precomputed "rainbow tables" to crack hashes.
//
// Q3: What are the three parts of a JWT token?
// A:  Header (algorithm + token type), Payload (claims like userId, role, expiry),
//     and Signature (HMAC or RSA signing of Header+Payload using the secret key).
//     Format: xxxxx.yyyyy.zzzzz (base64url encoded, separated by dots).
//
// Q4: Where should the client store the JWT token?
// A:  Option 1: HttpOnly cookie (recommended — prevents XSS JavaScript access).
//     Option 2: localStorage (convenient but vulnerable to XSS attacks).
//     Option 3: In-memory variable (safest but lost on page refresh).
//     In interviews, always recommend HttpOnly cookies for web apps.
//
// Q5: What happens when a JWT expires? How do you handle it?
// A:  The server returns 401 Unauthorized. The client must re-authenticate.
//     Common pattern: Use a short-lived access token (15min) + a long-lived 
//     refresh token (7 days). When the access token expires, the client uses 
//     the refresh token to get a new access token without re-entering credentials.
//
// Q6: What is the difference between authentication and authorization?
// A:  Authentication: "WHO are you?" — Verifying identity (login, JWT verification).
//     Authorization: "WHAT can you do?" — Checking permissions (admin vs. user roles).
//     JWT handles authentication; role-based middleware handles authorization.
