import { TopicDefinition } from '../../types/visualizer';

export const backendArchitectureTopics: TopicDefinition[] = [
  {
    id: 'backend-http-api-middleware-lifecycle',
    title: 'HTTP Request/Response Lifecycle, REST APIs & Express Middleware Pipeline',
    shortTitle: 'HTTP, APIs & Middleware',
    category: 'backend-architecture',
    difficulty: 'Intermediate',
    summary: 'Trace a live HTTP request packet from Frontend Client through CORS, Rate-Limiter, Auth Middleware, Controller, and back as a JSON HTTP Response.',
    intuitionOverview: 'When a frontend calls `fetch("/api/orders")`, the request doesn’t teleport straight into your database! It travels through an assembly line of checkpoints called **Middleware** (`req, res, next`). Each checkpoint can inspect headers, attach data (like `req.user`), or stop the request early (`429 Too Many Requests` / `401 Unauthorized`) before it ever reaches the Controller.',
    internalsOverview: 'Express/Fastify/Gin maintain an ordered array of middleware functions on the router stack. Calling `next()` advances an internal cursor to invoke the next handler on the Call Stack. If an error is passed (`next(err)`), execution jumps directly to the 4-argument Error Handling Middleware `(err, req, res, next)`.',
    realWorldUseCases: [
      'Centralized request logging, OpenTelemetry distributed tracing, and CORS headers',
      'Redis-backed Sliding Window Rate Limiting (`429 Too Many Requests`)',
      'Zod / Joi request payload schema validation before business logic runs'
    ],
    keyInvariants: [
      'Middleware Contract: Every middleware MUST either call `next()` to pass control forward OR send a terminal HTTP response (`res.status(...).json(...)`). Failing to do either hangs the TCP socket!',
      'Order Matters: Security, Rate Limiting, and Body Parsing middleware must be registered BEFORE route controllers.'
    ],
    complexity: {
      timeBest: 'O(1) Middleware Hop',
      timeAverage: 'O(M) Pipeline Length',
      timeWorst: 'O(M) + I/O Latency',
      space: 'O(1) Per-Request Context',
      note: 'In-memory middleware checks add < 0.2ms overhead compared to network/DB I/O.'
    },
    code: {
      typescript: `// Express Middleware Pipeline + Route Controller
app.use(rateLimiterMiddleware); // 1. Check Redis rate limit (100 req/min)
app.use(authJwtMiddleware);     // 2. Verify Bearer JWT & attach req.user

app.post('/api/orders', validateBody(OrderSchema), async (req, res, next) => {
  try {
    // 3. Controller invokes Service Layer with validated payload
    const order = await orderService.createOrder(req.user.id, req.body);
    return res.status(201).json({ status: 'created', data: order });
  } catch (err) {
    next(err); // Forward to centralized Error Middleware
  }
});`,
      python: `# FastAPI Middleware + Dependency Injection Pipeline
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if not await redis_limiter.allow(request.client.host):
        return JSONResponse(status_code=429, content={"error": "Rate limit"})
    return await call_next(request)  # Equivalent to next()

@app.post("/api/orders", status_code=201)
async def create_order(payload: OrderSchema, user: User = Depends(verify_jwt)):
    order = await order_service.create_order(user.id, payload)
    return {"status": "created", "data": order}`,
      cpp: `// Crow / Drogon C++ HTTP Middleware Pipeline
struct AuthMiddleware {
    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        auto token = req.get_header_value("Authorization");
        if (!verifyJwt(token, ctx.userId)) {
            res.code = 401; res.end("{\"error\":\"Unauthorized\"}");
        }
    }
};

CROW_ROUTE(app, "/api/orders").methods("POST"_method)
([](const crow::request& req) {
    auto order = orderService.create(req.body);
    return crow::response(201, order.toJson());
});`
    },
    liveSandboxCode: `// Simulate an Express Middleware Pipeline (req, res, next) in JS!
const middlewares = [
  function logger(req, res, next) {
    req.trace.push("1. Logger: POST " + req.url);
    next();
  },
  function rateLimiter(req, res, next) {
    req.trace.push("2. RateLimiter: 14/100 requests used -> OK");
    next();
  },
  function authGuard(req, res, next) {
    if (!req.headers.authorization) {
      res.status = 401;
      res.body = { error: "Missing Bearer Token" };
      return; // Short-circuit pipeline!
    }
    req.user = { id: "usr_42", role: "pro" };
    req.trace.push("3. AuthGuard: Verified JWT -> attached req.user.id=usr_42");
    next();
  },
  function createOrderController(req, res) {
    res.status = 201;
    res.body = { orderId: "ord_9001", userId: req.user.id, item: req.body.item };
    req.trace.push("4. Controller: Created order ord_9001 -> HTTP 201");
  }
];

function runPipeline(req) {
  const res = { status: 200, body: null };
  let idx = 0;
  function next() {
    const fn = middlewares[idx++];
    if (fn) fn(req, res, next);
  }
  next();
  return { reqTrace: req.trace, response: res };
}

console.log(JSON.stringify(runPipeline({
  url: "/api/orders",
  headers: { authorization: "Bearer eyJhbGci..." },
  body: { item: "Mechanical Keyboard" },
  trace: []
}), null, 2));`,
    steps: [
      {
        stepNumber: 1,
        title: 'Client Dispatches HTTP POST /api/orders -> Hits API Gateway & Rate Limiter',
        intuitionExplanation: 'The browser sends an HTTP `POST /api/orders` packet with a JSON body and `Authorization: Bearer <JWT>` header. The first middleware on the server is the **Rate Limiter**, which checks Redis (`12/100 req/min`) and calls `next()` to let the request through.',
        internalsExplanation: 'TCP socket parses HTTP/1.1 frame into `req` object on Heap `0xREQ1`. Middleware #1 (`rateLimiterMiddleware`) increments IP key in Redis (1.2ms) and invokes `next()`.',
        codeLines: { typescript: [2], python: [2, 3, 4, 6], cpp: [2, 3] },
        timeDelta: '+1.2ms',
        spaceDelta: 'req @ 0xREQ1',
        backendFlow: {
          nodes: [
            { id: 'client', title: 'React Client', subtitle: 'fetch(POST /api/orders)', layer: 'client', state: 'success', latencyMs: 0 },
            { id: 'ratelimit', title: 'Rate Limiter MW', subtitle: '12/100 req/min -> next()', layer: 'middleware', state: 'active', latencyMs: 1.2 },
            { id: 'auth', title: 'JWT Auth MW', subtitle: 'Verify Bearer Token', layer: 'middleware', state: 'idle' },
            { id: 'validator', title: 'Zod Validator MW', subtitle: 'Validate JSON Schema', layer: 'middleware', state: 'idle' },
            { id: 'controller', title: 'Order Controller', subtitle: 'orderService.create()', layer: 'controller', state: 'idle' },
            { id: 'db', title: 'PostgreSQL Primary', subtitle: 'INSERT INTO orders', layer: 'database', state: 'idle' }
          ],
          activePacket: { fromId: 'client', toId: 'ratelimit', label: 'POST /api/orders', status: 'req' },
          httpInspector: {
            method: 'POST',
            url: '/api/orders',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer eyJhbGciOiJIUzI1Ni...' },
            body: '{ "productId": "prod_88", "qty": 2 }'
          }
        },
        callStack: [
          { funcName: 'rateLimiterMiddleware', args: 'req, res, next', locals: { clientIp: '203.0.113.5', count: 12 }, status: 'active' }
        ],
        heap: [{ address: '0xREQ1', type: 'IncomingMessage', label: 'req', value: '{ method: "POST", url: "/api/orders", user: undefined }', highlight: true }],
        variables: { pipelineStage: '1. Rate Limiter', status: 'Allowed -> calling next()', latencyMs: 1.2 }
      },
      {
        stepNumber: 2,
        title: 'Auth Middleware & Schema Validator Mutate req Object & Call next()',
        intuitionExplanation: 'Next, `authJwtMiddleware` verifies the cryptographic signature of the Bearer token and attaches `req.user = { id: "usr_42" }` directly onto the `req` object in the Heap! Then `validateBody` confirms `qty: 2` is a positive integer and calls `next()`.',
        internalsExplanation: 'HMAC-SHA256 verification succeeds in 0.3ms. `req.user` property is mutated on Heap `0xREQ1` so downstream handlers share authenticated identity without re-decoding the token.',
        codeLines: { typescript: [3, 5], python: [9], cpp: [3, 4, 5] },
        timeDelta: '+0.5ms',
        spaceDelta: 'req.user attached',
        backendFlow: {
          nodes: [
            { id: 'client', title: 'React Client', subtitle: 'Waiting for response...', layer: 'client', state: 'success' },
            { id: 'ratelimit', title: 'Rate Limiter MW', subtitle: 'Passed (1.2ms)', layer: 'middleware', state: 'success', latencyMs: 1.2 },
            { id: 'auth', title: 'JWT Auth MW', subtitle: 'req.user = { id: "usr_42" }', layer: 'middleware', state: 'success', latencyMs: 0.3 },
            { id: 'validator', title: 'Zod Validator MW', subtitle: 'Schema Valid -> next()', layer: 'middleware', state: 'active', latencyMs: 0.2 },
            { id: 'controller', title: 'Order Controller', subtitle: 'orderService.create()', layer: 'controller', state: 'idle' },
            { id: 'db', title: 'PostgreSQL Primary', subtitle: 'INSERT INTO orders', layer: 'database', state: 'idle' }
          ],
          activePacket: { fromId: 'auth', toId: 'validator', label: 'req.user={id:"usr_42"}', status: 'req' },
          httpInspector: {
            method: 'POST',
            url: '/api/orders',
            headers: { 'X-Request-Id': 'req_99a1', 'X-User-Id': 'usr_42 (Verified)' },
            body: '{ "productId": "prod_88", "qty": 2 }'
          }
        },
        callStack: [
          { funcName: 'validateBody', args: 'req, res, next', locals: { schema: 'OrderSchema', valid: true }, status: 'active' },
          { funcName: 'authJwtMiddleware', args: 'req, res, next', locals: { 'req.user.id': 'usr_42' }, status: 'waiting' }
        ],
        heap: [{ address: '0xREQ1', type: 'IncomingMessage', label: 'req', value: '{ method: "POST", user: { id: "usr_42", role: "member" } }', highlight: true }],
        variables: { pipelineStage: '2. Auth & Validation', 'req.user.id': 'usr_42', schemaValid: true }
      },
      {
        stepNumber: 3,
        title: 'Controller Executes DB Transaction & Sends HTTP 201 Created Response',
        intuitionExplanation: 'Finally, the request reaches the **Controller**! It calls `orderService.createOrder()`, inserts the new row into PostgreSQL, and serializes `{ status: "created", data: order }` with HTTP status `201 Created` back to the client.',
        internalsExplanation: 'Parameterized SQL `INSERT INTO orders ... RETURNING *` commits in 4.8ms. `res.status(201).json(...)` serializes JSON buffer, writes HTTP response headers, and flushes the socket.',
        codeLines: { typescript: [8, 9], python: [10, 11], cpp: [12, 13] },
        timeDelta: '+4.8ms DB (Total: 6.5ms)',
        spaceDelta: 'HTTP 201 Flushed',
        backendFlow: {
          nodes: [
            { id: 'client', title: 'React Client', subtitle: 'Received 201 Created!', layer: 'client', state: 'success' },
            { id: 'ratelimit', title: 'Rate Limiter MW', subtitle: 'Passed', layer: 'middleware', state: 'success', latencyMs: 1.2 },
            { id: 'auth', title: 'JWT Auth MW', subtitle: 'Verified', layer: 'middleware', state: 'success', latencyMs: 0.3 },
            { id: 'validator', title: 'Zod Validator MW', subtitle: 'Validated', layer: 'middleware', state: 'success', latencyMs: 0.2 },
            { id: 'controller', title: 'Order Controller', subtitle: 'res.status(201).json()', layer: 'controller', state: 'active', latencyMs: 0.4 },
            { id: 'db', title: 'PostgreSQL Primary', subtitle: 'Committed ord_9001', layer: 'database', state: 'success', latencyMs: 4.4 }
          ],
          activePacket: { fromId: 'controller', toId: 'client', label: '201 Created JSON', status: 'res' },
          httpInspector: {
            method: 'POST',
            url: '/api/orders',
            status: 201,
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Response-Time': '6.5ms' },
            body: '{ "status": "created", "data": { "id": "ord_9001", "userId": "usr_42", "total": 198 } }'
          },
          dbQuery: {
            sql: 'INSERT INTO orders (id, user_id, product_id, qty) VALUES ($1, $2, $3, $4) RETURNING *;',
            plan: 'Index Check products_pkey -> Insert on orders (cost=0.00..0.03 rows=1)',
            rowsAffected: 1
          }
        },
        callStack: [
          { funcName: 'createOrderController', args: 'req, res', locals: { orderId: 'ord_9001', statusCode: 201 }, status: 'returning' }
        ],
        heap: [{ address: '0xRES1', type: 'ServerResponse', label: 'res', value: '{ statusCode: 201, body: "{\\"id\\":\\"ord_9001\\"}" }', highlight: true }],
        variables: { httpStatus: 201, orderId: 'ord_9001', totalLatencyMs: 6.5 }
      }
    ]
  },
  {
    id: 'backend-auth-jwt-sessions-databases',
    title: 'Authentication (JWT vs. Sessions), Caching (Redis) & Database Indexing (B-Tree)',
    shortTitle: 'Auth, Redis Cache & DB Indexes',
    category: 'backend-architecture',
    difficulty: 'Production',
    summary: 'Visualize how Redis Cache-Aside and PostgreSQL B-Tree Indexes turn a slow 450ms Full Table Scan into a sub-millisecond query.',
    intuitionOverview: 'Without a Database Index, running `SELECT * FROM users WHERE email = "soaib@dev.io"` forces the database to read every single row on disk (`Sequential Scan`, `O(N)`). Adding a **B-Tree Index** sorts emails in a balanced tree (`O(log N)`), and adding a **Redis Cache** in front serves repeat requests straight from RAM (`O(1)`, `< 1ms`)!',
    internalsOverview: 'Cache-Aside pattern checks Redis (`GET user:email:soaib@dev.io`) in O(1) hash lookup. On a Cache Miss, PostgreSQL traverses its B+ Tree index (3 page reads instead of 100,000 heap pages), returns the tuple, and populates Redis with a `TTL = 300s`.',
    realWorldUseCases: [
      'Stateless JWT verification vs. Stateful Redis Session revocation on logout',
      'Eliminating slow queries (`EXPLAIN ANALYZE` Seq Scan -> B-Tree Index Scan)',
      'Protecting primary databases from traffic spikes with Redis Cache-Aside + TTL'
    ],
    keyInvariants: [
      'Cache Invalidation Rule: Whenever a user updates their profile in PostgreSQL, the backend MUST delete (`DEL`) or update the stale Redis key.',
      'B-Tree Index Selectivity: Indexing high-cardinality columns (`email`, `user_id`) reduces disk page reads from O(N) to O(log_B N).'
    ],
    complexity: {
      timeBest: 'O(1) Redis Cache Hit (0.4ms)',
      timeAverage: 'O(log N) B-Tree Index (3.2ms)',
      timeWorst: 'O(N) Full Table Seq Scan (450ms)',
      space: 'O(N) Index Pages + Cache TTL',
      note: 'Notice how Hash Tables (Redis) and Balanced Search Trees (PostgreSQL B-Tree) directly power production backends!'
    },
    code: {
      typescript: `async function getUserProfile(email: string): Promise<User> {
  const cacheKey = \`user:email:\${email}\`;
  // 1. O(1) Redis Hash Table Lookup
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached); // Cache HIT (0.4ms)!

  // 2. Cache MISS -> O(log N) PostgreSQL B-Tree Index Lookup
  const user = await db.query(
    'SELECT id, name, email, role FROM users WHERE email = $1',
    [email]
  );
  // 3. Populate Redis Cache with 300s TTL
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 300);
  return user;
}`,
      python: `async def get_user_profile(email: str) -> dict:
    cache_key = f"user:email:{email}"
    # 1. O(1) Redis Hash Lookup
    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)  # Cache HIT (0.4ms)!

    # 2. Cache MISS -> O(log N) PostgreSQL B-Tree Index Scan
    user = await db.fetch_one(
        "SELECT id, name, email, role FROM users WHERE email = $1", email
    )
    await redis.set(cache_key, json.dumps(dict(user)), ex=300)
    return dict(user)`,
      cpp: `User getUserProfile(const string& email) {
    string key = "user:email:" + email;
    if (auto cached = redis.get(key)) {
        return User::fromJson(*cached); // O(1) Cache HIT!
    }
    // O(log N) B-Tree Index Scan on idx_users_email
    User user = db.queryOne("SELECT id, name, email FROM users WHERE email = $1", email);
    redis.setex(key, 300, user.toJson());
    return user;
}`
    },
    liveSandboxCode: `// Compare Full Table Scan O(N) vs B-Tree Index O(log N) vs Redis Cache O(1)!
const redisCache = new Map();

function queryUser(email) {
  if (redisCache.has(email)) {
    console.log(\`[Redis HIT] O(1) Hash Lookup for \${email} -> 0.4ms\`);
    return redisCache.get(email);
  }
  console.log(\`[Redis MISS] Querying PostgreSQL B-Tree Index idx_users_email...\`);
  console.log(\`  -> B-Tree Root Page -> Internal Page -> Heap Tuple (3 page reads, 3.1ms)\`);
  const user = { id: "usr_42", email, role: "admin" };
  redisCache.set(email, user);
  console.log(\`  -> Stored in Redis with TTL=300s\`);
  return user;
}

console.log("1st Request (Cold Cache):", queryUser("soaib@dev.io"));
console.log("2nd Request (Warm Cache):", queryUser("soaib@dev.io"));`,
    steps: [
      {
        stepNumber: 1,
        title: '1st Request (Cold): Redis Cache MISS -> Query PostgreSQL B-Tree Index',
        intuitionExplanation: 'The API server checks Redis for `user:email:soaib@dev.io`. Since this is the first request, Redis returns `null` (Cache MISS). Instead of scanning 1,000,000 rows on disk, PostgreSQL uses its **B-Tree Index** `idx_users_email` to find the row in just 3 tree hops (`3.1ms`)!',
        internalsExplanation: 'Redis `GET` misses in 0.4ms. PostgreSQL planner selects `Index Scan using idx_users_email on users`, traversing 3 8KB B-Tree pages in `O(log_B N)` time.',
        codeLines: { typescript: [4, 5, 8, 9, 10], python: [4, 5, 9, 10], cpp: [3, 7] },
        timeDelta: '0.4ms + 3.1ms = 3.5ms',
        spaceDelta: '3 B-Tree pages read',
        backendFlow: {
          nodes: [
            { id: 'client', title: 'Client App', subtitle: 'GET /api/users/me', layer: 'client', state: 'success' },
            { id: 'service', title: 'User Service', subtitle: 'getUserProfile()', layer: 'service', state: 'active', latencyMs: 0.2 },
            { id: 'cache', title: 'Redis Cache', subtitle: 'MISS (key not found)', layer: 'cache', state: 'error', latencyMs: 0.4 },
            { id: 'db', title: 'PostgreSQL B-Tree', subtitle: 'Index Scan (3.1ms)', layer: 'database', state: 'active', latencyMs: 3.1 }
          ],
          activePacket: { fromId: 'service', toId: 'db', label: 'SELECT ... WHERE email=$1', status: 'req' },
          dbQuery: {
            sql: "EXPLAIN ANALYZE SELECT id, name, email FROM users WHERE email = 'soaib@dev.io';",
            plan: 'Index Scan using idx_users_email on users (cost=0.42..8.44 rows=1) (actual time=0.08..3.10ms)',
            rowsAffected: 1
          }
        },
        callStack: [{ funcName: 'getUserProfile', args: 'email="soaib@dev.io"', locals: { cached: 'null (MISS)', dbPlan: 'B-Tree Index Scan' }, status: 'active' }],
        heap: [{ address: '0xPG_BTREE', type: 'BPlusTreeIndex', label: 'idx_users_email', value: 'Root[a..z] -> Node[s..t] -> Leaf("soaib@dev.io" -> ctid(42,1))', highlight: true }],
        variables: { cacheStatus: 'MISS', dbExecutionPlan: 'B-Tree Index Scan (O(log N))', latencyMs: 3.5 }
      },
      {
        stepNumber: 2,
        title: 'Write-Back to Redis (TTL=300s) & Serve 2nd Request in 0.4ms (O(1) Cache HIT)!',
        intuitionExplanation: 'We store the user JSON in Redis (`SETEX 300s`). When the next request arrives 100ms later, `redis.get(cacheKey)` hits the in-memory Hash Table directly (`0.4ms`), bypassing PostgreSQL completely!',
        internalsExplanation: 'Redis stores key in RAM hash table. Subsequent `GET` returns serialized JSON in `0.4ms` with zero database disk I/O.',
        codeLines: { typescript: [4, 5, 13, 14], python: [4, 5, 6, 12], cpp: [3, 4, 8] },
        timeDelta: '0.4ms (9x faster!)',
        spaceDelta: '+1 Redis Key (TTL 300s)',
        backendFlow: {
          nodes: [
            { id: 'client', title: 'Client App', subtitle: '200 OK (0.4ms!)', layer: 'client', state: 'success' },
            { id: 'service', title: 'User Service', subtitle: 'Returned cached JSON', layer: 'service', state: 'success', latencyMs: 0.1 },
            { id: 'cache', title: 'Redis Cache', subtitle: 'HIT! O(1) Hash Lookup', layer: 'cache', state: 'success', latencyMs: 0.4 },
            { id: 'db', title: 'PostgreSQL B-Tree', subtitle: 'Bypassed (0 queries)', layer: 'database', state: 'bypassed', latencyMs: 0 }
          ],
          activePacket: { fromId: 'cache', toId: 'client', label: 'Redis HIT (0.4ms)', status: 'res' },
          httpInspector: {
            method: 'GET',
            url: '/api/users/me',
            status: 200,
            headers: { 'X-Cache': 'HIT', 'X-Response-Time': '0.5ms' },
            body: '{ "id": "usr_42", "name": "Soaib", "email": "soaib@dev.io", "role": "admin" }'
          }
        },
        callStack: [{ funcName: 'getUserProfile', args: 'email="soaib@dev.io"', locals: { cached: 'HIT (0.4ms)' }, status: 'returning' }],
        heap: [{ address: '0xREDIS_01', type: 'RedisKey', label: 'user:email:soaib@dev.io', value: '{"id":"usr_42","role":"admin"} (TTL: 299s)', highlight: true }],
        variables: { cacheStatus: 'HIT (O(1) RAM)', dbQueriesExecuted: 0, latencyMs: 0.4 }
      }
    ]
  }
];
