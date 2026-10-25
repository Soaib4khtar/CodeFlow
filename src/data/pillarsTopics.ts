import { TopicData } from '../types/codeflow';

export const pillarsTopics: TopicData[] = [
  // ================= BACKEND =================
  {
    id: 'backend-rest-apis-http',
    title: 'REST APIs & HTTP Lifecycle',
    pillar: 'Backend',
    difficulty: 'Easy',
    iconName: 'Globe',
    description:
      'Trace how an HTTP Request travels from the Frontend Client through an Express/Node.js Middleware pipeline, Controller, and returns a structured JSON Response.',
    timeComplexity: 'O(1) Route Lookup',
    spaceComplexity: 'O(1) Per-Request Socket',
    intuition:
      'Every API call passes through an assembly line of Middleware (Auth, Rate Limit, Body Parser) before executing Controller business logic.',
    internals:
      'Calling next() advances the middleware cursor on the call stack; res.status(201).json() serializes the payload and flushes the TCP response.',
    traceSummary: 'HTTP 201 Created returned in 6.2ms',
    code: {
      javascript: `app.use(rateLimiter);
app.use(verifyJwtToken);

app.post('/api/orders', async (req, res) => {
  const { item, qty } = req.body;
  if (!item || qty <= 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const order = await db.orders.create({ userId: req.user.id, item, qty });
  return res.status(201).json({ status: 'created', order });
});`,
      typescript: `app.post('/api/orders', verifyJwt, async (req: Request, res: Response) => {
  const { item, qty } = req.body;
  const order = await db.orders.create({ userId: req.user.id, item, qty });
  return res.status(201).json({ status: 'created', order });
});`,
      python: `@app.post("/api/orders", status_code=201)
async def create_order(payload: OrderCreate, user: User = Depends(verify_jwt)):
    order = await db.orders.create(user_id=user.id, **payload.dict())
    return {"status": "created", "order": order}`,
      cpp: `CROW_ROUTE(app, "/api/orders").methods("POST"_method)([](const crow::request& req){
    auto order = db.createOrder(req.body);
    return crow::response(201, order.toJson());
});`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 1,
        explanation: 'Client sends POST /api/orders → Rate Limiter & JWT Auth Middleware validate token',
        architecture: {
          stages: [
            { id: 'client', title: 'Frontend Client', subtitle: 'POST /api/orders', tag: 'HTTP', state: 'done' },
            { id: 'mw', title: 'Auth & Rate Limit', subtitle: 'req.user = usr_42', tag: 'Middleware', state: 'active' },
            { id: 'ctrl', title: 'Order Controller', subtitle: 'Validate & Process', tag: 'Controller', state: 'idle' },
            { id: 'db', title: 'PostgreSQL DB', subtitle: 'INSERT INTO orders', tag: 'Database', state: 'idle' }
          ],
          packetLabel: 'Bearer JWT Verified → next()'
        },
        variables: { method: 'POST', path: '/api/orders', 'req.user.id': 'usr_42' }
      },
      {
        stepNumber: 2,
        activeLine: 9,
        explanation: 'Controller inserts order into PostgreSQL and returns HTTP 201 Created JSON response',
        architecture: {
          stages: [
            { id: 'client', title: 'Frontend Client', subtitle: '201 Created JSON', tag: 'HTTP', state: 'done' },
            { id: 'mw', title: 'Auth & Rate Limit', subtitle: 'Passed (1.1ms)', tag: 'Middleware', state: 'done' },
            { id: 'ctrl', title: 'Order Controller', subtitle: 'res.status(201).json()', tag: 'Controller', state: 'done' },
            { id: 'db', title: 'PostgreSQL DB', subtitle: 'Committed ord_901', tag: 'Database', state: 'active' }
          ],
          packetLabel: '201 Created { orderId: "ord_901" }'
        },
        variables: { status: 201, orderId: 'ord_901', latency: '6.2ms' }
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
      'See how PostgreSQL B-Tree Indexes and Redis Cache-Aside transform a slow O(N) Sequential Table Scan into an O(log N) or O(1) lookup.',
    timeComplexity: 'O(log N) B-Tree / O(1) Cache',
    spaceComplexity: 'O(N) Index Pages',
    intuition:
      'Without an index, WHERE email = $1 scans every row on disk. A B-Tree index keeps keys sorted in a shallow tree so 1,000,000 rows require only 3 page reads.',
    internals:
      'Redis Cache-Aside checks RAM first (0.4ms); on cache miss, queries PostgreSQL B-Tree (2.4ms) and populates Redis with a TTL.',
    traceSummary: 'B-Tree Index + Redis reduced query time from 412ms to 0.4ms',
    code: {
      javascript: `async function getUserByEmail(email) {
  const cached = await redis.get(\`user:\${email}\`);
  if (cached) return JSON.parse(cached); // O(1) Redis Cache Hit

  // O(log N) PostgreSQL B-Tree Index Scan on idx_users_email
  const user = await db.query(
    'SELECT id, name, email FROM users WHERE email = $1',
    [email]
  );
  await redis.set(\`user:\${email}\`, JSON.stringify(user), 'EX', 300);
  return user;
}`,
      typescript: `async function getUserByEmail(email: string): Promise<User> {
  const cached = await redis.get(\`user:\${email}\`);
  if (cached) return JSON.parse(cached);
  const user = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
  await redis.set(\`user:\${email}\`, JSON.stringify(user), 'EX', 300);
  return user;
}`,
      python: `async def get_user_by_email(email: str) -> dict:
    cached = await redis.get(f"user:{email}")
    if cached:
        return json.loads(cached)
    user = await db.fetch_one("SELECT id, name, email FROM users WHERE email = $1", email)
    await redis.set(f"user:{email}", json.dumps(dict(user)), ex=300)
    return dict(user)`,
      cpp: `User getUserByEmail(const string& email) {
    if (auto c = redis.get("user:" + email)) return User::fromJson(*c);
    User u = db.query("SELECT id, name, email FROM users WHERE email = $1", email);
    redis.setex("user:" + email, 300, u.toJson());
    return u;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: 'Cold Request: Redis Cache Miss → PostgreSQL traverses B-Tree Index idx_users_email in 3 page hops',
        architecture: {
          stages: [
            { id: 'api', title: 'User Service', subtitle: 'getUserByEmail()', tag: 'Service', state: 'done' },
            { id: 'redis', title: 'Redis Cache', subtitle: 'MISS (0.4ms)', tag: 'RAM Cache', state: 'done' },
            { id: 'btree', title: 'B-Tree Index', subtitle: 'idx_users_email (3 hops)', tag: 'O(log N)', state: 'active' },
            { id: 'heap', title: 'Table Heap Page', subtitle: 'Tuple ctid(42,1)', tag: 'Disk Page', state: 'done' }
          ],
          packetLabel: 'Index Scan on idx_users_email (2.4ms)'
        },
        variables: { cache: 'MISS', pagesRead: 3, latency: '2.4ms' }
      },
      {
        stepNumber: 2,
        activeLine: 3,
        explanation: 'Warm Request: Redis Cache HIT serves user directly from RAM hash table in 0.4ms!',
        architecture: {
          stages: [
            { id: 'api', title: 'User Service', subtitle: 'getUserByEmail()', tag: 'Service', state: 'done' },
            { id: 'redis', title: 'Redis Cache', subtitle: 'HIT! O(1) Hash Lookup', tag: '0.4ms', state: 'active' },
            { id: 'btree', title: 'B-Tree Index', subtitle: 'Bypassed (0 reads)', tag: 'O(log N)', state: 'idle' },
            { id: 'heap', title: 'Table Heap Page', subtitle: 'Bypassed', tag: 'Disk Page', state: 'idle' }
          ],
          packetLabel: 'Redis Cache HIT → 0.4ms'
        },
        variables: { cache: 'HIT', pagesRead: 0, latency: '0.4ms' }
      }
    ]
  },

  // ================= SYSTEM DESIGN & LARGE CODEBASES =================
  {
    id: 'system-design-codebase-architecture',
    title: 'Industry Codebase Architecture & Execution Flow',
    pillar: 'System Design',
    difficulty: 'Medium',
    iconName: 'FolderGit2',
    description:
      'Trace how a real-world production repository separates concerns across UI Components, API Client, Router, Controller, Service Layer, ORM Repository, and Database.',
    timeComplexity: 'Layered Architecture',
    spaceComplexity: 'Modular Dependency Graph',
    intuition:
      'Large codebases stay maintainable by enforcing strict one-way boundaries: UI → Router → Controller (HTTP) → Service (Business Logic) → Repository (Data Access) → Database.',
    internals:
      'Dependency Injection decouples Services from concrete Database drivers so unit tests can mock the Repository in memory.',
    traceSummary: 'Traced checkout action across 6 production codebase files',
    code: {
      javascript: `// src/controllers/checkout.controller.ts
export async function handleCheckout(req, res, next) {
  try {
    // 1. Controller delegates business rules to Service layer
    const receipt = await checkoutService.processOrder({
      userId: req.user.id,
      cartId: req.body.cartId
    });
    // 2. Service uses Repository (Prisma/Drizzle) inside a SQL transaction
    return res.status(200).json({ receipt });
  } catch (err) {
    next(err); // Forward to src/middleware/error.middleware.ts
  }
}`,
      typescript: `export async function handleCheckout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const receipt = await checkoutService.processOrder({
      userId: req.user.id,
      cartId: req.body.cartId
    });
    return res.status(200).json({ receipt });
  } catch (err) {
    next(err);
  }
}`,
      python: `@router.post("/checkout")
async def handle_checkout(body: CheckoutReq, user: User = Depends(get_user)):
    receipt = await checkout_service.process_order(user.id, body.cart_id)
    return {"receipt": receipt}`,
      cpp: `Response handleCheckout(const Request& req) {
    auto receipt = checkoutService.processOrder(req.userId, req.cartId);
    return Response::json(200, receipt);
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 5,
        explanation: '1. CheckoutButton.tsx → apiClient.ts → routes/checkout.ts → controllers/checkout.controller.ts',
        architecture: {
          stages: [
            { id: 'ui', title: 'CheckoutButton.tsx', subtitle: 'onClick → post("/checkout")', tag: 'Frontend', state: 'done' },
            { id: 'ctrl', title: 'checkout.controller.ts', subtitle: 'Parse HTTP & call Service', tag: 'Controller', state: 'active' },
            { id: 'svc', title: 'checkout.service.ts', subtitle: 'Inventory + Stripe + Tx', tag: 'Service', state: 'idle' },
            { id: 'repo', title: 'order.repository.ts', subtitle: 'prisma.$transaction()', tag: 'Repository', state: 'idle' }
          ],
          packetLabel: 'Cross-File Call: Controller → Service'
        },
        variables: { activeFile: 'src/controllers/checkout.controller.ts', layer: 'HTTP Controller' }
      },
      {
        stepNumber: 2,
        activeLine: 10,
        explanation: '2. checkout.service.ts orchestrates order.repository.ts ACID transaction & returns receipt',
        architecture: {
          stages: [
            { id: 'ui', title: 'CheckoutButton.tsx', subtitle: 'Render Receipt UI', tag: 'Frontend', state: 'done' },
            { id: 'ctrl', title: 'checkout.controller.ts', subtitle: '200 OK { receipt }', tag: 'Controller', state: 'done' },
            { id: 'svc', title: 'checkout.service.ts', subtitle: 'Business rules verified', tag: 'Service', state: 'done' },
            { id: 'repo', title: 'order.repository.ts', subtitle: 'COMMIT Transaction', tag: 'Repository', state: 'active' }
          ],
          packetLabel: 'ACID Transaction Committed → 200 OK'
        },
        variables: { activeFile: 'src/repositories/order.repository.ts', transaction: 'COMMITTED' }
      }
    ]
  },

  // ================= WEB DEV =================
  {
    id: 'webdev-modern-fullstack-path',
    title: 'React, Next.js, TypeScript & Modern Web Stack',
    pillar: 'Web Dev',
    difficulty: 'Easy',
    iconName: 'Code2',
    description:
      'Understand how React state reconciliation, Next.js Server/Client Components, TypeScript type safety, and Docker CI/CD pipelines fit together in production.',
    timeComplexity: 'O(n) Fiber Diffing',
    spaceComplexity: 'Virtual DOM Tree',
    intuition:
      'When React state updates via setState, React diffs the new Virtual DOM tree against the previous Fiber tree and applies only the minimal DOM mutations.',
    internals:
      'Keys on list items allow React Fiber to match moved nodes in O(n) instead of recreating DOM subtrees.',
    traceSummary: 'Reconciled state update and committed 1 minimal DOM patch',
    code: {
      javascript: `function CounterCard() {
  const [count, setCount] = useState(0);

  // Event handler triggers state update & Fiber reconciliation
  function handleIncrement() {
    setCount(prev => prev + 1);
  }

  return <button onClick={handleIncrement}>Count: {count}</button>;
}`,
      typescript: `function CounterCard(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const handleIncrement = () => setCount((prev) => prev + 1);
  return <button onClick={handleIncrement}>Count: {count}</button>;
}`,
      python: `# Next.js / FastAPI Full-Stack Type Contract (Pydantic)
class CounterState(BaseModel):
    count: int = 0
    updated_at: datetime`,
      cpp: `// WebAssembly (WASM) High-Performance Client Module
extern "C" int incrementCounter(int current) {
    return current + 1;
}`
    },
    steps: [
      {
        stepNumber: 1,
        activeLine: 6,
        explanation: 'User clicks button → setCount(prev => prev + 1) enqueues state update on Fiber node',
        architecture: {
          stages: [
            { id: 'evt', title: 'User Event', subtitle: 'onClick triggered', tag: 'DOM', state: 'done' },
            { id: 'state', title: 'State Queue', subtitle: 'count: 0 → 1', tag: 'React Hook', state: 'active' },
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
        explanation: 'Fiber diffs Virtual DOM and commits a single textNode update to the real browser DOM',
        architecture: {
          stages: [
            { id: 'evt', title: 'User Event', subtitle: 'Completed', tag: 'DOM', state: 'done' },
            { id: 'state', title: 'State Queue', subtitle: 'Processed', tag: 'React Hook', state: 'done' },
            { id: 'diff', title: 'Fiber Reconciler', subtitle: '1 node changed', tag: 'Render Phase', state: 'done' },
            { id: 'commit', title: 'Browser Paint', subtitle: 'Committed "Count: 1"', tag: 'Commit Phase', state: 'active' }
          ],
          packetLabel: 'DOM Patch Committed in < 1ms'
        },
        variables: { count: 1, domMutations: 1, phase: 'Commit' }
      }
    ]
  }
];
