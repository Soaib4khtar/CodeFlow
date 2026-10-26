import { TopicData } from '../types/codeflow';

export const pillarsTopics: TopicData[] = [
  // ============================================================================
  // PILLAR 2: BACKEND DEVELOPMENT (7 Deep Visual Modules)
  // ============================================================================
  {
    id: 'backend-rest-apis-http',
    title: 'REST APIs & HTTP Lifecycle',
    pillar: 'Backend',
    difficulty: 'Easy',
    iconName: 'Globe',
    description:
      'Trace how an HTTP Request travels from the Frontend Client through TCP/TLS, API Router, Controller, and returns a structured JSON Response with HTTP status codes.',
    timeComplexity: 'O(1) Route Dispatch',
    spaceComplexity: 'O(1) Socket Buffer',
    intuition:
      'An HTTP API is a contract between Frontend and Backend. The client sends a Method (GET/POST/PUT/DELETE), URL Path, Headers, and JSON Body; the server processes it and replies with a Status Code (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 500 Error).',
    internals:
      'Node.js/Express parses the raw HTTP stream into req (IncomingMessage) and res (ServerResponse) objects on the Heap.',
    traceSummary: 'HTTP 201 Created returned in 5.8ms',
    code: {
      javascript: `// Express REST API Endpoint
app.post('/api/v1/orders', async (req, res) => {
  const { productId, quantity } = req.body;

  // 1. Validate client input (400 Bad Request)
  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  // 2. Persist via Service & Database layer
  const order = await orderService.create({ productId, quantity });

  // 3. Return 201 Created with Location header & JSON body
  return res.status(201).json({ status: 'created', data: order });
});`,
      typescript: `app.post('/api/v1/orders', async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const order = await orderService.create({ productId, quantity });
  return res.status(201).json({ status: 'created', data: order });
});`,
      python: `@app.post("/api/v1/orders", status_code=201)
async def create_order(payload: OrderRequest):
    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid quantity")
    order = await order_service.create(payload)
    return {"status": "created", "data": order}`,
      cpp: `CROW_ROUTE(app, "/api/v1/orders").methods("POST"_method)
([](const crow::request& req) {
    auto body = crow::json::load(req.body);
    if (!body || body["quantity"].i() <= 0) return crow::response(400);
    auto order = orderService.create(body);
    return crow::response(201, order.dump());
});`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 2,
        explanation: '1. Frontend dispatches POST /api/v1/orders with JSON body { productId: "kbd_01", quantity: 2 }',
        architecture: {
          stages: [
            { id: 'client', title: 'React Frontend', subtitle: 'fetch(POST /orders)', tag: 'Client', state: 'active' },
            { id: 'router', title: 'Express Router', subtitle: 'Match POST /api/v1/orders', tag: 'Router', state: 'idle' },
            { id: 'service', title: 'Order Service', subtitle: 'Business Logic', tag: 'Service', state: 'idle' },
            { id: 'db', title: 'PostgreSQL', subtitle: 'INSERT INTO orders', tag: 'Database', state: 'idle' }
          ],
          packetLabel: 'HTTP POST /api/v1/orders (JSON Payload)'
        },
        variables: { method: 'POST', url: '/api/v1/orders', quantity: 2 }
      },
      {
        stepNumber: 2,
        activeLine: 6,
        explanation: '2. Router matches route handler and validates productId & quantity > 0',
        architecture: {
          stages: [
            { id: 'client', title: 'React Frontend', subtitle: 'Awaiting response', tag: 'Client', state: 'done' },
            { id: 'router', title: 'Express Controller', subtitle: 'Validation Passed!', tag: 'Controller', state: 'active' },
            { id: 'service', title: 'Order Service', subtitle: 'orderService.create()', tag: 'Service', state: 'idle' },
            { id: 'db', title: 'PostgreSQL', subtitle: 'INSERT INTO orders', tag: 'Database', state: 'idle' }
          ],
          packetLabel: 'Payload Validated (quantity = 2 > 0)'
        },
        variables: { productId: 'kbd_01', quantity: 2, valid: 'true' }
      },
      {
        stepNumber: 3,
        activeLine: 11,
        explanation: '3. Order Service executes SQL INSERT and receives generated orderId = "ord_9042"',
        architecture: {
          stages: [
            { id: 'client', title: 'React Frontend', subtitle: 'Awaiting response', tag: 'Client', state: 'done' },
            { id: 'router', title: 'Express Controller', subtitle: 'await orderService', tag: 'Controller', state: 'done' },
            { id: 'service', title: 'Order Service', subtitle: 'Created ord_9042', tag: 'Service', state: 'done' },
            { id: 'db', title: 'PostgreSQL', subtitle: 'Committed Row #9042', tag: 'Database', state: 'active' }
          ],
          packetLabel: 'SQL INSERT RETURNING id = "ord_9042" (4.1ms)'
        },
        variables: { orderId: 'ord_9042', dbLatency: '4.1ms' }
      },
      {
        stepNumber: 4,
        activeLine: 14,
        explanation: '4. Server serializes JSON response with HTTP 201 Created status back to browser',
        architecture: {
          stages: [
            { id: 'client', title: 'React Frontend', subtitle: '201 Created Received!', tag: 'Client', state: 'active' },
            { id: 'router', title: 'Express Controller', subtitle: 'res.status(201).json()', tag: 'Controller', state: 'done' },
            { id: 'service', title: 'Order Service', subtitle: 'Completed', tag: 'Service', state: 'done' },
            { id: 'db', title: 'PostgreSQL', subtitle: 'Committed', tag: 'Database', state: 'done' }
          ],
          packetLabel: 'HTTP 201 Created { status: "created", id: "ord_9042" }'
        },
        variables: { statusCode: 201, totalTime: '5.8ms' }
      }
    ]
  },
  {
    id: 'backend-middleware-pipeline',
    title: 'Middleware Pipeline & Request Validation',
    pillar: 'Backend',
    difficulty: 'Medium',
    iconName: 'Layers',
    description:
      'Understand how Express/Fastify Middleware functions (req, res, next) chain together for logging, CORS, rate limiting, auth, and centralized error handling.',
    timeComplexity: 'O(M) Middleware Chain',
    spaceComplexity: 'O(1) Shared req Context',
    intuition:
      'Middleware functions are security gates arranged in sequence. Each gate can inspect the request, attach data (like req.user), pass control forward via next(), or short-circuit the request early.',
    internals:
      'Express maintains an array of Layer objects. Calling next(err) skips all remaining normal middlewares and jumps straight to the 4-argument error handler (err, req, res, next).',
    traceSummary: 'Request passed 3 middleware gates and reached controller',
    code: {
      javascript: `function rateLimitMiddleware(req, res, next) {
  if (req.ipRequests > 100) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  next(); // Pass control to next middleware in pipeline
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = verifyJwt(token); // Mutate shared req object
  next();
}

app.get('/api/profile', rateLimitMiddleware, authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});`,
      typescript: `function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.user = verifyJwt(token);
  next();
}`,
      python: `@app.middleware("http")
async def pipeline_middleware(request: Request, call_next):
    if is_rate_limited(request.client.host):
        return JSONResponse(status_code=429, content={"error": "Rate limit"})
    response = await call_next(request)
    return response`,
      cpp: `void before_handle(crow::request& req, crow::response& res, context& ctx) {
    if (rateLimited(req.remote_ip_address)) {
        res.code = 429; res.end();
    }
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'Gate 1 (rateLimitMiddleware): IP count is 14/100 → calls next()',
        architecture: {
          stages: [
            { id: 'mw1', title: '1. Rate Limiter', subtitle: '14/100 req → next()', tag: 'Middleware 1', state: 'active' },
            { id: 'mw2', title: '2. Auth Guard', subtitle: 'Verify Bearer JWT', tag: 'Middleware 2', state: 'idle' },
            { id: 'ctrl', title: '3. Route Handler', subtitle: 'GET /api/profile', tag: 'Controller', state: 'idle' },
            { id: 'err', title: '4. Error Handler', subtitle: '(err, req, res, next)', tag: 'Fallback', state: 'idle' }
          ],
          packetLabel: 'rateLimitMiddleware → next()'
        },
        variables: { ipRequests: 14, limit: 100, action: 'next()' }
      },
      {
        stepNumber: 2,
        activeLine: 11,
        explanation: 'Gate 2 (authMiddleware): Verifies JWT signature, attaches req.user = { id: "u_7" }, calls next()',
        architecture: {
          stages: [
            { id: 'mw1', title: '1. Rate Limiter', subtitle: 'Passed', tag: 'Middleware 1', state: 'done' },
            { id: 'mw2', title: '2. Auth Guard', subtitle: 'Attached req.user!', tag: 'Middleware 2', state: 'active' },
            { id: 'ctrl', title: '3. Route Handler', subtitle: 'GET /api/profile', tag: 'Controller', state: 'idle' },
            { id: 'err', title: '4. Error Handler', subtitle: 'Not triggered', tag: 'Fallback', state: 'idle' }
          ],
          packetLabel: 'req.user = { id: "u_7" } → next()'
        },
        variables: { 'req.user.id': 'u_7', jwtValid: 'true' }
      },
      {
        stepNumber: 3,
        activeLine: 16,
        explanation: 'Gate 3 (Controller): Reads req.user attached by middleware and responds 200 OK',
        architecture: {
          stages: [
            { id: 'mw1', title: '1. Rate Limiter', subtitle: 'Passed', tag: 'Middleware 1', state: 'done' },
            { id: 'mw2', title: '2. Auth Guard', subtitle: 'Passed', tag: 'Middleware 2', state: 'done' },
            { id: 'ctrl', title: '3. Route Handler', subtitle: '200 OK { user }', tag: 'Controller', state: 'active' },
            { id: 'err', title: '4. Error Handler', subtitle: 'Bypassed', tag: 'Fallback', state: 'idle' }
          ],
          packetLabel: 'HTTP 200 OK { user: { id: "u_7" } }'
        },
        variables: { status: 200, responseUser: 'u_7' }
      }
    ]
  },
  {
    id: 'backend-auth-jwt-sessions',
    title: 'Authentication: JWT vs. Sessions & RBAC',
    pillar: 'Backend',
    difficulty: 'Medium',
    iconName: 'ShieldCheck',
    description:
      'Compare Stateless JWT (JSON Web Token) cryptographic verification with Stateful Redis Session cookies, password hashing (bcrypt/Argon2), and Role-Based Access Control.',
    timeComplexity: 'O(1) HMAC-SHA256 Check',
    spaceComplexity: 'O(1) Stateless Token',
    intuition:
      'A JWT is like a tamper-proof digital passport stamped by the server. Because it has a cryptographic signature (Header.Payload.Signature), any microservice can verify who the user is without querying the database on every request!',
    internals:
      'Server computes HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY) and compares it in constant time against the token signature.',
    traceSummary: 'Verified bcrypt hash & issued signed JWT + HttpOnly Refresh Cookie',
    code: {
      javascript: `async function loginUser(email, password) {
  const user = await db.users.findByEmail(email);
  // 1. Constant-time bcrypt password hash comparison
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new UnauthorizedError('Invalid credentials');

  // 2. Sign stateless Access JWT (15m expiry)
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  return { accessToken };
}`,
      typescript: `async function loginUser(email: string, password: string) {
  const user = await db.users.findByEmail(email);
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new UnauthorizedError('Invalid credentials');
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
}`,
      python: `async def login_user(email: str, password: str):
    user = await db.users.find_by_email(email)
    if not bcrypt.verify(password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return jwt.encode({"sub": user.id, "role": user.role}, JWT_SECRET, algorithm="HS256")`,
      cpp: `string loginUser(const string& email, const string& password) {
    auto user = db.findByEmail(email);
    if (!bcrypt::validatePassword(password, user.hash)) throw AuthError();
    return jwt::create().set_payload_claim("sub", user.id).sign(jwt::algorithm::hs256{SECRET});
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 4,
        explanation: '1. Verify password against salted bcrypt hash stored in PostgreSQL',
        architecture: {
          stages: [
            { id: 'login', title: 'POST /auth/login', subtitle: 'email + password', tag: 'Client', state: 'done' },
            { id: 'bcrypt', title: 'Bcrypt Verifier', subtitle: '2^12 rounds match!', tag: 'Crypto', state: 'active' },
            { id: 'jwt', title: 'JWT Signer', subtitle: 'HMAC-SHA256', tag: 'Token', state: 'idle' },
            { id: 'cookie', title: 'Client Storage', subtitle: 'HttpOnly Cookie', tag: 'Browser', state: 'idle' }
          ],
          packetLabel: 'bcrypt.compare(password, "$2b$12$...") === true'
        },
        variables: { email: 'soaib@codeflow.dev', bcryptMatch: 'true' }
      },
      {
        stepNumber: 2,
        activeLine: 8,
        explanation: '2. Sign JWT payload { sub: "usr_42", role: "admin" } with server secret key',
        architecture: {
          stages: [
            { id: 'login', title: 'POST /auth/login', subtitle: 'Authenticated', tag: 'Client', state: 'done' },
            { id: 'bcrypt', title: 'Bcrypt Verifier', subtitle: 'Verified', tag: 'Crypto', state: 'done' },
            { id: 'jwt', title: 'JWT Signer', subtitle: 'Header.Payload.Sig', tag: 'Token', state: 'active' },
            { id: 'cookie', title: 'Client Storage', subtitle: 'Bearer Token Ready', tag: 'Browser', state: 'done' }
          ],
          packetLabel: 'Issued JWT: eyJhbGciOiJIUzI1NiIs... (exp: 15m)'
        },
        variables: { sub: 'usr_42', role: 'admin', expiresIn: '15m' }
      }
    ]
  },
  {
    id: 'backend-databases-indexing',
    title: 'Databases, SQL & B-Tree Indexing',
    pillar: 'Backend',
    difficulty: 'Medium',
    iconName: 'Database',
    description:
      'See how PostgreSQL B-Tree Indexes transform a slow O(N) Full Table Scan (reading thousands of disk pages) into a fast O(log N) 3-hop tree lookup.',
    timeComplexity: 'O(log N) B-Tree Index',
    spaceComplexity: 'O(N) Index Pages',
    intuition:
      'Without an index, WHERE email = $1 scans every single row on disk. A B+ Tree index keeps keys sorted in a balanced multi-way tree so 1,000,000 rows require only 3 page reads.',
    internals:
      'Leaf nodes of a PostgreSQL B+ Tree store 8-byte ctid pointers (blockNumber, tupleIndex) pointing directly to the row in the table heap.',
    traceSummary: 'B-Tree Index Scan reduced query latency from 412ms to 2.1ms',
    code: {
      javascript: `// 1. Create B-Tree Index on high-selectivity lookup column
// CREATE UNIQUE INDEX idx_users_email ON users(email);

async function findUserWithIndex(email) {
  // Parameterized query ($1) prevents SQL Injection AND uses idx_users_email
  const result = await db.query(
    'SELECT id, name, email, role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}`,
      typescript: `async function findUserWithIndex(email: string): Promise<UserRow> {
  const result = await db.query(
    'SELECT id, name, email, role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}`,
      python: `async def find_user_with_index(email: str) -> dict:
    row = await db.fetch_one(
        "SELECT id, name, email, role FROM users WHERE email = $1", email
    )
    return dict(row)`,
      cpp: `UserRow findUserWithIndex(const string& email) {
    return db.execParams("SELECT id, name, email, role FROM users WHERE email = $1", email);
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: '1. Query Planner selects Index Scan on idx_users_email instead of O(N) Seq Scan',
        treeNodes: [
          { id: 'root', label: 'M..Z', x: 50, y: 18, leftId: 'left', rightId: 'right', state: 'active', note: 'B-Tree Root' },
          { id: 'left', label: 'A..L', x: 25, y: 52, state: 'default' },
          { id: 'right', label: 'M..Z', x: 75, y: 52, leftId: 's', rightId: 'z', state: 'active', note: 'Branch s..t' },
          { id: 's', label: 'soaib@', x: 60, y: 84, state: 'found', note: 'ctid(42,1)' },
          { id: 'z', label: 'zack@', x: 88, y: 84, state: 'default' }
        ],
        variables: { plan: 'Index Scan', pagesRead: 3, latency: '2.1ms' }
      },
      {
        stepNumber: 2,
        activeLine: 10,
        explanation: '2. Leaf pointer ctid(42,1) fetches exact Heap Page #42 Tuple #1 in 2.1ms!',
        treeNodes: [
          { id: 'root', label: 'M..Z', x: 50, y: 18, leftId: 'left', rightId: 'right', state: 'visited' },
          { id: 'left', label: 'A..L', x: 25, y: 52, state: 'default' },
          { id: 'right', label: 'M..Z', x: 75, y: 52, leftId: 's', rightId: 'z', state: 'visited' },
          { id: 's', label: 'soaib@', x: 60, y: 84, state: 'found', note: 'Row Returned!' },
          { id: 'z', label: 'zack@', x: 88, y: 84, state: 'default' }
        ],
        variables: { tupleId: 'ctid(42, 1)', rowsScanned: '1 (vs 1,000,000)' }
      }
    ]
  },
  {
    id: 'backend-redis-caching',
    title: 'Redis Caching & Cache-Aside Strategy',
    pillar: 'Backend',
    difficulty: 'Medium',
    iconName: 'Zap',
    description:
      'Protect databases from read spikes using an in-memory Redis Hash Table Cache-Aside pattern with TTL expiration and cache invalidation.',
    timeComplexity: 'O(1) RAM Lookup (0.4ms)',
    spaceComplexity: 'O(K) Active Cache Keys',
    intuition:
      'Reading from RAM (Redis) is ~100x faster than reading from disk. Cache-Aside checks Redis first: on a HIT, return immediately; on a MISS, query PostgreSQL and save the result in Redis with a TTL.',
    internals:
      'Uses LRU (Least Recently Used) eviction — powered by a Hash Map + Doubly Linked List — to evict cold keys when memory is full.',
    traceSummary: 'Redis Cache HIT served product catalog in 0.4ms (0 DB queries)',
    code: {
      javascript: `async function getProductDetails(productId) {
  const cacheKey = \`product:\${productId}\`;

  // 1. Check Redis RAM Cache first (O(1) Hash Lookup)
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Cache MISS: Query PostgreSQL & populate Redis with 300s TTL
  const product = await db.products.findById(productId);
  await redis.set(cacheKey, JSON.stringify(product), 'EX', 300);
  return product;
}`,
      typescript: `async function getProductDetails(productId: string): Promise<Product> {
  const cacheKey = \`product:\${productId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  const product = await db.products.findById(productId);
  await redis.set(cacheKey, JSON.stringify(product), 'EX', 300);
  return product;
}`,
      python: `async def get_product_details(product_id: str) -> dict:
    key = f"product:{product_id}"
    if cached := await redis.get(key):
        return json.loads(cached)
    product = await db.products.find_by_id(product_id)
    await redis.set(key, json.dumps(product), ex=300)
    return product`,
      cpp: `Product getProductDetails(const string& id) {
    if (auto c = redis.get("product:" + id)) return Product::fromJson(*c);
    auto p = db.findProduct(id);
    redis.setex("product:" + id, 300, p.toJson());
    return p;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: 'Request 1 (Cold): redis.get("product:99") returns null (MISS) → queries DB & sets TTL=300s',
        architecture: {
          stages: [
            { id: 'api', title: 'API Server', subtitle: 'GET /products/99', tag: 'Server', state: 'done' },
            { id: 'redis', title: 'Redis RAM', subtitle: 'MISS → SETEX 300s', tag: 'Cache', state: 'active' },
            { id: 'db', title: 'PostgreSQL', subtitle: 'SELECT * WHERE id=99', tag: 'Database', state: 'active' }
          ],
          packetLabel: 'Cache MISS → Populated Redis Key "product:99"'
        },
        variables: { cacheStatus: 'MISS', ttlSeconds: 300, latency: '4.5ms' }
      },
      {
        stepNumber: 2,
        activeLine: 6,
        explanation: 'Request 2 (Warm): redis.get("product:99") hits RAM directly in 0.4ms — PostgreSQL bypassed!',
        architecture: {
          stages: [
            { id: 'api', title: 'API Server', subtitle: '200 OK (0.4ms)', tag: 'Server', state: 'done' },
            { id: 'redis', title: 'Redis RAM', subtitle: 'HIT! O(1) Lookup', tag: '0.4ms', state: 'active' },
            { id: 'db', title: 'PostgreSQL', subtitle: '0 Queries Run', tag: 'Bypassed', state: 'idle' }
          ],
          packetLabel: 'Redis Cache HIT → Returned in 0.4ms'
        },
        variables: { cacheStatus: 'HIT', dbLoad: '0%', latency: '0.4ms' }
      }
    ]
  },
  {
    id: 'backend-queues-workers',
    title: 'Async Message Queues & Background Workers',
    pillar: 'Backend',
    difficulty: 'Hard',
    iconName: 'Server',
    description:
      'Decouple slow tasks (sending emails, PDF generation, video transcoding, webhooks) from the HTTP request cycle using Redis/BullMQ/Kafka message queues.',
    timeComplexity: 'O(1) Enqueue Ack',
    spaceComplexity: 'O(Q) Buffered Jobs',
    intuition:
      'Don’t make a user wait 8 seconds at checkout while your server generates a PDF invoice and sends an email! Push a job onto a Queue in 1ms, return 202 Accepted immediately, and let a background Worker process it asynchronously.',
    internals:
      'Supports exponential backoff retries, dead-letter queues (DLQ) for failed jobs, and horizontal worker auto-scaling.',
    traceSummary: 'API responded in 3ms while Worker processed email job asynchronously',
    code: {
      javascript: `// Producer: API Controller enqueues job in 1ms
app.post('/api/checkout', async (req, res) => {
  const order = await db.orders.create(req.body);
  await emailQueue.add('send-receipt', { orderId: order.id, email: req.user.email });
  return res.status(202).json({ status: 'processing', orderId: order.id });
});

// Consumer: Background Worker processes FIFO queue
const worker = new Worker('emailQueue', async (job) => {
  await smtpProvider.sendReceipt(job.data.email, job.data.orderId);
});`,
      typescript: `await emailQueue.add('send-receipt', { orderId: order.id, email: req.user.email });
return res.status(202).json({ status: 'processing', orderId: order.id });`,
      python: `@app.post("/api/checkout", status_code=202)
async def checkout(body: CheckoutReq):
    order = await db.orders.create(body)
    celery_app.send_task("send_receipt", args=[order.id, body.email])
    return {"status": "processing", "order_id": order.id}`,
      cpp: `jobQueue.push(Job{"send_receipt", order.id, req.email});
return Response(202, "{\"status\":\"processing\"}");`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 4,
        explanation: '1. API Producer enqueues "send-receipt" job into Queue and immediately returns 202 Accepted (3ms)',
        architecture: {
          stages: [
            { id: 'client', title: 'Client', subtitle: '202 Accepted (3ms!)', tag: 'Fast Ack', state: 'done' },
            { id: 'api', title: 'Checkout API', subtitle: 'emailQueue.add()', tag: 'Producer', state: 'active' },
            { id: 'queue', title: 'Message Queue', subtitle: 'Job #401 Queued', tag: 'FIFO Broker', state: 'active' },
            { id: 'worker', title: 'Worker Node', subtitle: 'Idle', tag: 'Consumer', state: 'idle' }
          ],
          packetLabel: 'Enqueued Job #401 → Client unblocked in 3ms'
        },
        variables: { httpLatency: '3ms', jobId: 'job_401', queueLength: 1 }
      },
      {
        stepNumber: 2,
        activeLine: 10,
        explanation: '2. Background Worker pulls Job #401 from Queue and sends SMTP receipt without blocking HTTP',
        architecture: {
          stages: [
            { id: 'client', title: 'Client', subtitle: 'Already on Receipt UI', tag: 'Done', state: 'done' },
            { id: 'api', title: 'Checkout API', subtitle: 'Serving other users', tag: 'Producer', state: 'done' },
            { id: 'queue', title: 'Message Queue', subtitle: 'Job #401 Acked', tag: 'FIFO Broker', state: 'done' },
            { id: 'worker', title: 'Worker Node', subtitle: 'Sent SMTP Email ✓', tag: 'Consumer', state: 'active' }
          ],
          packetLabel: 'Worker Completed Job #401 (ACK)'
        },
        variables: { jobStatus: 'COMPLETED', retries: 0 }
      }
    ]
  },

  // ============================================================================
  // PILLAR 3: SYSTEM DESIGN & LARGE CODEBASES (5 Deep Modules)
  // ============================================================================
  {
    id: 'system-design-codebase-architecture',
    title: 'Industry Codebase Architecture & Execution Flow',
    pillar: 'System Design',
    difficulty: 'Medium',
    iconName: 'FolderGit2',
    description:
      'Understand how large, production-grade software repositories organize files across Presentation, Routing, Middleware, Controllers, Services, Repositories, and Models.',
    timeComplexity: 'Separation of Concerns',
    spaceComplexity: 'Modular Dependency Graph',
    intuition:
      'Professional teams never put SQL queries inside React components or 1,000 lines of logic inside a single route file! Each layer has one strict responsibility and communicates via clean interfaces.',
    internals:
      'Strict inward dependency rule: Controllers depend on Services; Services depend on Repositories; Domain models have zero framework dependencies.',
    traceSummary: 'Traced end-to-end execution across 5 architectural layers',
    code: {
      javascript: `// 1. Controller Layer (src/controllers/order.controller.js)
export async function createOrderController(req, res, next) {
  try {
    const order = await orderService.placeOrder(req.user.id, req.body);
    return res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
}

// 2. Service Layer (src/services/order.service.js)
export async function placeOrder(userId, dto) {
  const stock = await inventoryRepo.checkStock(dto.sku);
  if (stock < dto.qty) throw new ConflictError('Out of stock');
  return orderRepo.createWithTransaction(userId, dto);
}`,
      typescript: `export async function createOrderController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const order = await orderService.placeOrder(req.user.id, req.body);
    return res.status(201).json({ data: order });
  } catch (err) { next(err); }
}`,
      python: `# Controller -> Service -> Repository Separation
@router.post("/orders")
async def create_order_controller(dto: OrderDTO, user = Depends(auth)):
    return await order_service.place_order(user.id, dto)`,
      cpp: `Response OrderController::create(const Request& req) {
    auto order = orderService.placeOrder(req.userId, req.toDto());
    return Response::json(201, order);
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 4,
        explanation: '1. Entry Point (app.ts → order.routes.ts) routes request to order.controller.ts',
        architecture: {
          stages: [
            { id: 'route', title: 'order.routes.ts', subtitle: 'POST /api/orders', tag: 'Router', state: 'done' },
            { id: 'ctrl', title: 'order.controller.ts', subtitle: 'HTTP Parse & Status', tag: 'Controller', state: 'active' },
            { id: 'svc', title: 'order.service.ts', subtitle: 'Business Rules', tag: 'Service', state: 'idle' },
            { id: 'repo', title: 'order.repository.ts', subtitle: 'SQL / Prisma ORM', tag: 'Repository', state: 'idle' }
          ],
          packetLabel: 'Controller delegates DTO to Service Layer'
        },
        variables: { currentFile: 'src/controllers/order.controller.ts', layer: 'Controller' }
      },
      {
        stepNumber: 2,
        activeLine: 13,
        explanation: '2. order.service.ts validates inventory rules & calls order.repository.ts ACID transaction',
        architecture: {
          stages: [
            { id: 'route', title: 'order.routes.ts', subtitle: 'Matched', tag: 'Router', state: 'done' },
            { id: 'ctrl', title: 'order.controller.ts', subtitle: 'Awaiting Service', tag: 'Controller', state: 'done' },
            { id: 'svc', title: 'order.service.ts', subtitle: 'Stock verified ✓', tag: 'Service', state: 'done' },
            { id: 'repo', title: 'order.repository.ts', subtitle: 'BEGIN...COMMIT Tx', tag: 'Repository', state: 'active' }
          ],
          packetLabel: 'Repository Commits Transaction → Bubbles result up'
        },
        variables: { currentFile: 'src/repositories/order.repository.ts', txStatus: 'COMMITTED' }
      }
    ]
  },
  {
    id: 'system-design-debugging-refactoring',
    title: 'Tracing Bugs, Reading Unfamiliar Code & Safe Refactoring',
    pillar: 'System Design',
    difficulty: 'Medium',
    iconName: 'SearchCode',
    description:
      'Learn practical industry techniques for exploring an unfamiliar codebase: tracing stack traces, eliminating N+1 query bugs, writing characterization tests, and refactoring safely.',
    timeComplexity: 'O(1) Batch Query vs O(N) N+1',
    spaceComplexity: 'Clean Dependency Injection',
    intuition:
      'When joining a new team with a 200,000-line codebase, don’t read files randomly! Start at the HTTP route or UI event handler, follow the call graph one layer at a time, and reproduce bugs with a failing test before changing code.',
    internals:
      'The #1 production backend bug is the N+1 Query Problem: executing a database query inside a for-loop instead of batching with WHERE id = ANY($1).',
    traceSummary: 'Fixed N+1 query bug: reduced 51 SQL queries to 2 queries (18x faster)',
    code: {
      javascript: `// ❌ BUGGY: N+1 Database Queries inside a loop (51 queries for 50 orders!)
// for (const order of orders) {
//   order.user = await db.users.findById(order.userId);
// }

// ✅ FIXED: Batch fetch all unique userIds in 1 single SQL query!
async function attachUsersToOrders(orders) {
  const userIds = [...new Set(orders.map(o => o.userId))];
  const users = await db.users.findManyWhereIdIn(userIds); // 1 Query!
  const userMap = new Map(users.map(u => [u.id, u]));      // O(1) Hash Map
  return orders.map(o => ({ ...o, user: userMap.get(o.userId) }));
}`,
      typescript: `async function attachUsersToOrders(orders: Order[]) {
  const userIds = [...new Set(orders.map((o) => o.userId))];
  const users = await db.users.findManyWhereIdIn(userIds);
  const userMap = new Map(users.map((u) => [u.id, u]));
  return orders.map((o) => ({ ...o, user: userMap.get(o.userId) }));
}`,
      python: `async def attach_users_to_orders(orders: list[Order]):
    user_ids = list({o.user_id for o in orders})
    users = await db.users.find_many_in(user_ids)
    user_map = {u.id: u for u in users}
    return [{**o, "user": user_map[o.user_id]} for o in orders]`,
      cpp: `void attachUsers(vector<Order>& orders, Database& db) {
    auto users = db.findUsersWhereIdIn(extractIds(orders));
    unordered_map<int, User> mp;
    for (auto& u : users) mp[u.id] = u;
    for (auto& o : orders) o.user = mp[o.userId];
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 8,
        explanation: '1. Extract unique userIds with a Set and batch-fetch all users in 1 SQL WHERE id IN (...) query',
        architecture: {
          stages: [
            { id: 'bug', title: 'N+1 Loop (Old)', subtitle: '51 SQL Queries (380ms)', tag: 'Bottleneck', state: 'idle' },
            { id: 'set', title: 'Deduplicate IDs', subtitle: 'new Set(userIds)', tag: 'Step 1', state: 'active' },
            { id: 'batch', title: 'Batch SQL IN ()', subtitle: '1 Query (8ms)', tag: 'Step 2', state: 'active' },
            { id: 'map', title: 'O(1) Hash Join', subtitle: 'userMap.get(id)', tag: 'Step 3', state: 'idle' }
          ],
          packetLabel: 'SELECT * FROM users WHERE id IN (101, 102, 105)'
        },
        variables: { ordersCount: 50, sqlQueriesBefore: 51, sqlQueriesAfter: 2 }
      },
      {
        stepNumber: 2,
        activeLine: 11,
        explanation: '2. Index users into an O(1) Hash Map and join in memory → Latency drops from 380ms to 11ms!',
        architecture: {
          stages: [
            { id: 'bug', title: 'N+1 Eliminated', subtitle: 'Saved 49 round-trips', tag: 'Fixed', state: 'done' },
            { id: 'set', title: 'Deduplicate IDs', subtitle: 'Completed', tag: 'Step 1', state: 'done' },
            { id: 'batch', title: 'Batch SQL IN ()', subtitle: 'Completed', tag: 'Step 2', state: 'done' },
            { id: 'map', title: 'O(1) Hash Join', subtitle: 'Joined 50 orders in 0.1ms', tag: 'Step 3', state: 'active' }
          ],
          packetLabel: 'Refactored Endpoint Latency: 380ms → 11ms'
        },
        variables: { latencyBefore: '380ms', latencyAfter: '11ms', testsPassing: '14/14 ✓' }
      }
    ]
  },
  {
    id: 'system-design-scalability-load-balancing',
    title: 'System Design: Load Balancing, Sharding & Distributed Caching',
    pillar: 'System Design',
    difficulty: 'Hard',
    iconName: 'Cpu',
    description:
      'Scale applications from 100 to 10,000,000 users using CDN Edge Caching, L7 Load Balancers, Stateless Horizontal API Replicas, Read Replicas, and Consistent Hashing.',
    timeComplexity: 'O(1) Consistent Hash Ring',
    spaceComplexity: 'Horizontal Partitioning',
    intuition:
      'Vertical scaling (buying a bigger server) hits a hardware ceiling. Horizontal scaling adds multiple stateless API servers behind an NGINX/ALB Load Balancer and splits database reads across Read Replicas.',
    internals:
      'Consistent Hashing maps both cache nodes and keys onto a 32-bit hash ring (0..2^32-1) so adding/removing a node only remaps K/N keys.',
    traceSummary: 'Routed traffic across CDN → Load Balancer → 3 API Replicas',
    code: {
      javascript: `// Consistent Hashing / Round-Robin Load Balancer Simulation
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.cursor = 0;
  }

  getNextServer() {
    const server = this.servers[this.cursor];
    this.cursor = (this.cursor + 1) % this.servers.length;
    return server;
  }
}`,
      typescript: `class LoadBalancer {
  private cursor = 0;
  constructor(private servers: string[]) {}
  getNextServer(): string {
    const s = this.servers[this.cursor];
    this.cursor = (this.cursor + 1) % this.servers.length;
    return s;
  }
}`,
      python: `class LoadBalancer:
    def __init__(self, servers: list[str]):
        self.servers = servers
        self.cursor = 0
    def get_next_server(self) -> str:
        s = self.servers[self.cursor]
        self.cursor = (self.cursor + 1) % len(self.servers)
        return s`,
      cpp: `string LoadBalancer::getNextServer() {
    string s = servers[cursor];
    cursor = (cursor + 1) % servers.size();
    return s;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 9,
        explanation: '1. Static assets served at Edge CDN (2ms); API requests distributed by L7 Load Balancer',
        architecture: {
          stages: [
            { id: 'cdn', title: 'Cloudflare CDN', subtitle: 'Static Assets (2ms)', tag: 'Edge', state: 'done' },
            { id: 'lb', title: 'L7 Load Balancer', subtitle: 'Round-Robin / Least Conn', tag: 'Gateway', state: 'active' },
            { id: 'api', title: 'API Cluster (x3)', subtitle: 'Node-1, Node-2, Node-3', tag: 'Stateless', state: 'active' },
            { id: 'db', title: 'Primary + Replicas', subtitle: 'Write Primary / Read Rep', tag: 'Database', state: 'done' }
          ],
          packetLabel: 'Load Balancer routed request → API-Node-2'
        },
        variables: { activeNode: 'API-Node-2', throughput: '25,000 req/sec' }
      }
    ]
  },

  // ============================================================================
  // PILLAR 4: MODERN WEB DEVELOPMENT ROADMAP (6 Structured Modules)
  // ============================================================================
  {
    id: 'webdev-js-event-loop-async',
    title: 'JavaScript Event Loop, Microtasks & Async/Await',
    pillar: 'Web Dev',
    difficulty: 'Medium',
    iconName: 'Zap',
    description:
      'Visualize how single-threaded JavaScript handles concurrency without blocking using the Call Stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (setTimeout).',
    timeComplexity: 'Non-Blocking Event Loop',
    spaceComplexity: 'Call Stack + Task Queues',
    intuition:
      'JavaScript has only 1 Call Stack, yet it never freezes during fetch()! Slow I/O is handed off to browser/libuv background threads. When finished, Promise callbacks enter the high-priority Microtask Queue, which ALWAYS drains completely before the next setTimeout Macrotask runs.',
    internals:
      'Event Loop tick order: 1. Execute synchronous Call Stack to empty → 2. Drain ALL Microtasks (Promise.then / await) → 3. Render UI frame → 4. Run ONE Macrotask (setTimeout).',
    traceSummary: 'Output order: Sync → Promise Microtask → setTimeout Macrotask',
    code: {
      javascript: `console.log('1. Sync Start');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout 0ms)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise.then)');
});

console.log('2. Sync End');`,
      typescript: `console.log('1. Sync Start');
setTimeout(() => console.log('4. Macrotask'), 0);
Promise.resolve().then(() => console.log('3. Microtask'));
console.log('2. Sync End');`,
      python: `# Python asyncio Event Loop Coroutine Scheduling
async def main():
    print("1. Start")
    await asyncio.sleep(0)
    print("2. Resumed on Event Loop")`,
      cpp: `// libuv Event Loop Phase Order
uv_run(loop, UV_RUN_DEFAULT);`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 11,
        explanation: '1. Synchronous lines run first on Call Stack: logs "1. Sync Start" then "2. Sync End"',
        architecture: {
          stages: [
            { id: 'stack', title: 'Call Stack', subtitle: '1. Sync, 2. Sync End', tag: 'Executing', state: 'active' },
            { id: 'micro', title: 'Microtask Queue', subtitle: '[Promise.then]', tag: 'High Priority', state: 'idle' },
            { id: 'macro', title: 'Macrotask Queue', subtitle: '[setTimeout 0ms]', tag: 'Low Priority', state: 'idle' }
          ],
          packetLabel: 'Console: "1. Sync Start" → "2. Sync End"'
        },
        variables: { callStack: 'Draining Sync', microtasks: 1, macrotasks: 1 }
      },
      {
        stepNumber: 2,
        activeLine: 8,
        explanation: '2. Call Stack is empty → Event Loop drains Microtask Queue FIRST ("3. Microtask") before setTimeout ("4. Macrotask")!',
        architecture: {
          stages: [
            { id: 'stack', title: 'Call Stack', subtitle: 'Runs Microtask → Macrotask', tag: 'Done', state: 'done' },
            { id: 'micro', title: 'Microtask Queue', subtitle: '3. Promise.then (First!)', tag: 'Drained #1', state: 'active' },
            { id: 'macro', title: 'Macrotask Queue', subtitle: '4. setTimeout (Last!)', tag: 'Drained #2', state: 'done' }
          ],
          packetLabel: 'Final Order: 1. Sync → 2. Sync → 3. Microtask → 4. Macrotask'
        },
        variables: { finalOrder: '1 → 2 → 3 → 4' }
      }
    ]
  },
  {
    id: 'webdev-modern-fullstack-path',
    title: 'React, Next.js, TypeScript & State Management',
    pillar: 'Web Dev',
    difficulty: 'Easy',
    iconName: 'Code2',
    description:
      'Understand how React Fiber reconciliation, Hooks (useState/useEffect), TypeScript compile-time contracts, and Next.js Server/Client Components work under the hood.',
    timeComplexity: 'O(n) Heuristic Fiber Diff',
    spaceComplexity: 'Double-Buffered Fiber Tree',
    intuition:
      'When React state updates via setState, React computes a lightweight Virtual DOM tree, diffs it against the previous Fiber tree in memory, and commits only the changed DOM attributes.',
    internals:
      'React Fiber splits rendering into an interruptible Render/Reconciliation phase and a synchronous Commit phase.',
    traceSummary: 'Reconciled state update and committed 1 minimal DOM patch',
    code: {
      javascript: `function SearchCounter() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    // Schedules state update on Fiber hook queue
    setCount(prev => prev + 1);
  }

  return <button onClick={handleIncrement}>Clicked: {count}</button>;
}`,
      typescript: `function SearchCounter(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const handleIncrement = (): void => setCount((prev) => prev + 1);
  return <button onClick={handleIncrement}>Clicked: {count}</button>;
}`,
      python: `# FastAPI / Next.js Full-Stack Type Schema
class CounterResponse(BaseModel):
    count: int`,
      cpp: `// WebAssembly UI State Reducer
int reduceCount(int prev) { return prev + 1; }`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: '1. User clicks button → setCount(prev => prev + 1) enqueues state update on Fiber node',
        architecture: {
          stages: [
            { id: 'evt', title: 'User Event', subtitle: 'onClick triggered', tag: 'DOM', state: 'done' },
            { id: 'state', title: 'Hook Queue', subtitle: 'count: 0 → 1', tag: 'useState', state: 'active' },
            { id: 'diff', title: 'Fiber Reconciler', subtitle: 'Diff Virtual DOM', tag: 'Render Phase', state: 'idle' },
            { id: 'commit', title: 'Browser Paint', subtitle: 'Update textNode "1"', tag: 'Commit Phase', state: 'idle' }
          ],
          packetLabel: 'Enqueue Hook Update (0 → 1)'
        },
        variables: { prevCount: 0, nextCount: 1, phase: 'Render' }
      },
      {
        stepNumber: 2,
        activeLine: 9,
        explanation: '2. Fiber diffs Virtual DOM and commits a single textNode update to the real browser DOM',
        architecture: {
          stages: [
            { id: 'evt', title: 'User Event', subtitle: 'Completed', tag: 'DOM', state: 'done' },
            { id: 'state', title: 'Hook Queue', subtitle: 'Processed', tag: 'useState', state: 'done' },
            { id: 'diff', title: 'Fiber Reconciler', subtitle: '1 text node changed', tag: 'Render Phase', state: 'done' },
            { id: 'commit', title: 'Browser Paint', subtitle: 'Committed "Clicked: 1"', tag: 'Commit Phase', state: 'active' }
          ],
          packetLabel: 'DOM Patch Committed in < 1ms'
        },
        variables: { count: 1, domMutations: 1, phase: 'Commit' }
      }
    ]
  },
  {
    id: 'webdev-docker-cicd-deployment',
    title: 'Git, Docker Containers, CI/CD & Production Deployment',
    pillar: 'Web Dev',
    difficulty: 'Medium',
    iconName: 'Layers',
    description:
      'Trace how code moves from a local Git feature branch through GitHub Actions CI testing, multi-stage Docker container builds, and zero-downtime cloud deployment.',
    timeComplexity: 'Cached Layer Builds',
    spaceComplexity: 'Multi-Stage Alpine Image',
    intuition:
      'Docker packages your app and its exact OS/Node dependencies into an immutable image so "it works on my machine" means it works identically in production. CI/CD automates linting, unit tests, and deployment on every git push.',
    internals:
      'Copying package.json and running npm ci BEFORE copying src/ leverages Docker layer caching so dependencies only rebuild when package-lock.json changes.',
    traceSummary: 'CI Pipeline passed tests & deployed 45MB multi-stage Docker image',
    code: {
      javascript: `// Multi-Stage Production Dockerfile Pattern
// Stage 1: Build TypeScript & Vite Bundle
// FROM node:20-alpine AS builder
// WORKDIR /app
// COPY package*.json ./
// RUN npm ci
// COPY . .
// RUN npm run build

// Stage 2: Lightweight Production Runner
// FROM nginx:alpine
// COPY --from=builder /app/dist /usr/share/nginx/html
// EXPOSE 80`,
      typescript: `// GitHub Actions CI/CD Workflow (.github/workflows/deploy.yml)
// 1. Checkout -> 2. npm ci -> 3. tsc & vitest -> 4. Docker Build & Push`,
      python: `# Dockerfile for FastAPI / Python Production
# FROM python:3.12-slim
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt`,
      cpp: `// Multi-stage C++ CMake Release Build
// FROM gcc:14 AS builder -> FROM debian:bookworm-slim`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: '1. git push triggers GitHub Actions CI: runs TypeScript typecheck, Vitest unit tests, and ESLint',
        architecture: {
          stages: [
            { id: 'git', title: 'Git Push / PR', subtitle: 'feat/visualizer', tag: 'GitHub', state: 'done' },
            { id: 'ci', title: 'GitHub Actions CI', subtitle: 'tsc + unit tests ✓', tag: 'Test Gate', state: 'active' },
            { id: 'docker', title: 'Docker Build', subtitle: 'Multi-stage Alpine', tag: 'Container', state: 'idle' },
            { id: 'prod', title: 'Cloud Production', subtitle: 'Zero-Downtime Rollout', tag: 'Deploy', state: 'idle' }
          ],
          packetLabel: 'CI Checks Passed: 42/42 Unit Tests Green ✓'
        },
        variables: { stage: 'CI Testing', status: 'PASSED' }
      },
      {
        stepNumber: 2,
        activeLine: 11,
        explanation: '2. Multi-stage Docker build strips devDependencies and deploys immutable image with health checks',
        architecture: {
          stages: [
            { id: 'git', title: 'Git Merge main', subtitle: 'Merged PR #12', tag: 'GitHub', state: 'done' },
            { id: 'ci', title: 'GitHub Actions CI', subtitle: 'Passed', tag: 'Test Gate', state: 'done' },
            { id: 'docker', title: 'Docker Image', subtitle: '45MB nginx:alpine', tag: 'Container', state: 'done' },
            { id: 'prod', title: 'Cloud Production', subtitle: 'Health Check 200 OK', tag: 'Live', state: 'active' }
          ],
          packetLabel: 'Zero-Downtime Deployment Live!'
        },
        variables: { imageSize: '45MB', healthCheck: '200 OK', downtime: '0ms' }
      }
    ]
  }
];
