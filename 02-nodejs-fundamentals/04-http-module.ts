/**
 * MODULE 2: Node.js Fundamentals
 * FILE 4: The Raw HTTP Module
 * 
 * ==========================================
 * WHAT IS THE HTTP MODULE?
 * ==========================================
 * Before Express exists, Node.js ships with a built-in 'http' module.
 * It allows you to create a raw HTTP server that listens for requests.
 * 
 * Understanding the raw HTTP module is CRITICAL because:
 *   1. Express is BUILT on top of this module.
 *   2. Interviewers love asking "What happens under the hood when you call app.listen()?"
 *   3. It teaches you the request/response lifecycle at the lowest level.
 * 
 * ==========================================
 * REAL-LIFE ANALOGY: Restaurant Kitchen (With vs Without a POS)
 * ==========================================
 * - Raw HTTP Module: Like a restaurant without a POS system. 
 *   The waiter has to manually write down orders on paper, walk to the kitchen,
 *   shout the order, wait, carry food back, and calculate the bill by hand.
 * - Express: Like having a modern POS system. The waiter taps the screen,
 *   the order goes to the kitchen display automatically, billing is calculated.
 *   Express is the POS — it automates all the manual boilerplate.
 */

import * as http from "http";

// ============================================================================
// 1. CREATING A BASIC HTTP SERVER
// ============================================================================
// http.createServer() takes a callback called a "request handler".
// This callback fires for EVERY incoming HTTP request.

const PORT = 4000;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  // req (IncomingMessage): Contains info about the incoming request.
  // res (ServerResponse): Used to send data back to the client.

  const method = req.method;  // "GET", "POST", "PUT", "DELETE"
  const url = req.url;        // "/api/users", "/health", etc.

  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  // --- Manual Routing (This is what Express automates for you!) ---

  // Health check endpoint
  if (method === "GET" && url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
    return;
  }

  // GET /api/users — Return a list of users
  if (method === "GET" && url === "/api/users") {
    const users = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: users }));
    return;
  }

  // POST /api/users — Parse body and create user
  if (method === "POST" && url === "/api/users") {
    let body = "";

    // The request body arrives in CHUNKS (streams!).
    // We must collect all chunks before we can parse the full body.
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        console.log("Received new user:", parsed);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User created", data: parsed }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
    return;
  }

  // 404 — No matching route
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

// ============================================================================
// 2. STARTING THE SERVER
// ============================================================================
// server.listen(port, callback) binds the server to a port and starts listening.
// This is what Express's app.listen() calls under the hood!

server.listen(PORT, () => {
  console.log(`🚀 Raw HTTP server running at http://localhost:${PORT}`);
  console.log(`Try: curl http://localhost:${PORT}/health`);
  console.log(`Try: curl http://localhost:${PORT}/api/users`);
  console.log(`Try: curl -X POST -H "Content-Type: application/json" -d '{"name":"Charlie"}' http://localhost:${PORT}/api/users`);
  console.log(`\nPress Ctrl+C to stop the server.\n`);
});


// ============================================================================
// 3. PRACTICE EXERCISE: Build a Mini JSON API Server
// ============================================================================
// This exercise runs as a SEPARATE function (not the server above).
// Complete the request handler logic below.

/**
 * Write a request handler function that:
 * - For GET /api/products: Returns a JSON array of 2 products.
 * - For GET /api/products/1: Returns the product with id 1.
 * - For any other route: Returns 404 with { error: "Not found" }.
 * 
 * Each product should have: id (number), name (string), price (number).
 */
function buildProductHandler(
  req: http.IncomingMessage, 
  res: http.ServerResponse
): void {
  const products = [
    { id: 1, name: "Mechanical Keyboard", price: 129.99 },
    { id: 2, name: "Wireless Mouse", price: 59.99 }
  ];

  // TODO: Check req.method and req.url to handle the routes described above.
  // Remember to:
  //   1. Set Content-Type header to "application/json"
  //   2. Use res.writeHead(statusCode, headers) 
  //   3. Use res.end(JSON.stringify(data)) to send the response
  
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
}


// ============================================================================
// 4. INTERACTIVE VALIDATOR RUNNER
// ============================================================================
// This validator tests the buildProductHandler function directly (without starting a server).
// Run using: npx ts-node 02-nodejs-fundamentals/04-http-module.ts

// Note: The server above will start AND the validator will run.
// Press Ctrl+C after seeing the results.

console.log("\n=== Checking your solutions... ===");

// We create mock request/response objects to test the handler without a real server.
function createMockReq(method: string, url: string): http.IncomingMessage {
  const req = new http.IncomingMessage(null as any);
  req.method = method;
  req.url = url;
  return req;
}

function createMockRes(): http.ServerResponse & { _body: string; _statusCode: number } {
  const res = new http.ServerResponse(null as any) as any;
  res._body = "";
  res._statusCode = 200;
  res.writeHead = (code: number) => { res._statusCode = code; return res; };
  res.end = (data?: string) => { res._body = data || ""; };
  return res;
}

setTimeout(() => {
  try {
    // Test GET /api/products
    const res1 = createMockRes();
    buildProductHandler(createMockReq("GET", "/api/products"), res1);
    const data1 = JSON.parse(res1._body);

    let listPass = false;
    if (Array.isArray(data1) && data1.length === 2 && data1[0].name === "Mechanical Keyboard") {
      console.log("✅ GET /api/products: Returns product list!");
      listPass = true;
    } else if (data1.data && Array.isArray(data1.data)) {
      console.log("✅ GET /api/products: Returns product list (wrapped in data)!");
      listPass = true;
    } else {
      console.log(`❌ GET /api/products: Failed. Response: ${res1._body}`);
    }

    // Test GET /api/products/1
    const res2 = createMockRes();
    buildProductHandler(createMockReq("GET", "/api/products/1"), res2);
    const data2 = JSON.parse(res2._body);

    let singlePass = false;
    if (data2 && (data2.id === 1 || (data2.data && data2.data.id === 1))) {
      console.log("✅ GET /api/products/1: Returns single product!");
      singlePass = true;
    } else {
      console.log(`❌ GET /api/products/1: Failed. Response: ${res2._body}`);
    }

    // Test 404
    const res3 = createMockRes();
    buildProductHandler(createMockReq("GET", "/api/unknown"), res3);

    let notFoundPass = false;
    if (res3._statusCode === 404) {
      console.log("✅ GET /api/unknown: Returns 404!");
      notFoundPass = true;
    } else {
      console.log(`❌ GET /api/unknown: Expected 404, got ${res3._statusCode}`);
    }

    if (listPass && singlePass && notFoundPass) {
      console.log("\n🎉 CONGRATULATIONS! You successfully finished Module 2, File 4!");
    }

  } catch (err) {
    console.log("❌ Validation error:", err);
  }

  // Stop the demo server so the process can exit
  server.close();
}, 200);


// ============================================================================
// 🎯 INTERVIEW QUESTIONS (Practice answering these out loud!)
// ============================================================================
//
// Q1: What happens when you call http.createServer()?
// A:  It creates an HTTP server instance (an EventEmitter). It does NOT start
//     listening yet. You must call server.listen(port) to bind to a port.
//     The callback passed to createServer fires for every incoming HTTP request.
//
// Q2: What is the relationship between Express and the http module?
// A:  Express is a wrapper around Node's http module. When you call app.listen(),
//     Express internally calls http.createServer(app) and then server.listen().
//     Every Express middleware is ultimately executed inside the http request handler.
//
// Q3: Why does POST body arrive in chunks? Why can't we read it immediately?
// A:  HTTP request bodies are transmitted as streams. The body might be very large
//     (file uploads, large JSON payloads). Node.js reads it incrementally via 
//     'data' events to avoid loading everything into memory at once.
//
// Q4: What is the difference between res.write() and res.end()?
// A:  res.write() sends a chunk of data but keeps the connection open.
//     res.end() sends the final data and CLOSES the connection.
//     You MUST call res.end() or the client will hang waiting forever.
//
// Q5: What HTTP status codes should every backend developer know?
// A:  200 OK, 201 Created, 204 No Content,
//     301 Moved Permanently, 304 Not Modified,
//     400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict,
//     500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.
