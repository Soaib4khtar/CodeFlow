import { TopicData } from '../types/codeflow';

export interface TopicQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface RequestHop {
  hopNumber: number;
  stageName: string;
  component: string;
  status: 'ok' | 'warn' | 'error' | 'skipped';
  latencyMs: number;
  commandOrAction: string;
  payloadJson: string;
  whyItMatters: string;
}

export interface EndToEndScenario {
  id: string;
  title: string;
  method: 'GET' | 'POST';
  endpoint: string;
  description: string;
  modes: {
    id: string;
    label: string;
    badgeColor: 'green' | 'amber' | 'rose' | 'blue';
    statusCode: string;
    totalLatencyMs: number;
    summary: string;
    hops: RequestHop[];
  }[];
}

export function getTopicQuiz(topic: TopicData): TopicQuizQuestion[] {
  if (topic.id === 'binary-search') {
    return [
      {
        id: 'bs-q1',
        question: 'Why does Binary Search achieve O(log n) time complexity instead of O(n)?',
        options: [
          'Because the array is sorted, comparing arr[mid] with target allows us to safely discard half of the remaining search range on every step.',
          'Because JavaScript engines parallelize while loops automatically.',
          'Because it only checks even indices first and odd indices second.',
          'Because it hashes every element into an O(1) lookup table before searching.'
        ],
        correctIndex: 0,
        explanation:
          'In a sorted array, if arr[mid] < target, every element at or to the left of mid is also smaller than target. Moving left = mid + 1 eliminates 50% of the candidates in O(1) time.'
      },
      {
        id: 'bs-q2',
        question: 'Why is mid = left + Math.floor((right - left) / 2) preferred in low-level languages over (left + right) / 2?',
        options: [
          'It prevents 32-bit signed integer overflow when left and right are both large indices near 2^31 - 1.',
          'It runs in O(1) space instead of O(n) space.',
          'It works on unsorted arrays as well as sorted arrays.',
          'It avoids floating-point division in Python.'
        ],
        correctIndex: 0,
        explanation:
          'Adding left + right directly can exceed INT_MAX (2,147,483,647) in C++/Java. Computing right - left first guarantees the intermediate value never exceeds right.'
      },
      {
        id: 'bs-q3',
        question: 'What happens if the loop condition is written as while (left < right) instead of while (left <= right) in standard Binary Search?',
        options: [
          'A single-element range where left === right will be skipped without checking if arr[left] equals the target.',
          'The algorithm will enter an infinite loop on every input.',
          'The space complexity increases from O(1) to O(log n).',
          'It will always return index 0.'
        ],
        correctIndex: 0,
        explanation:
          'When the search narrows down to 1 final candidate (left === right), while (left < right) terminates early and misses the match unless handled after the loop.'
      }
    ];
  }

  return [
    {
      id: `${topic.id}-q1`,
      question: `What is the primary algorithmic & system advantage of ${topic.title}?`,
      options: [
        `${topic.intuition} Achieving ${topic.timeComplexity} time and ${topic.spaceComplexity} space efficiency.`,
        'Duplicating the entire dataset in memory on every single iteration.',
        'Relying on brute-force nested loops without maintaining state invariants.',
        'Blocking the main thread indefinitely until all network sockets close.'
      ],
      correctIndex: 0,
      explanation: `${topic.title} works by maintaining a clear structural invariant: ${topic.internals}`
    },
    {
      id: `${topic.id}-q2`,
      question: `How does ${topic.title} behave internally in memory and execution?`,
      options: [
        topic.internals,
        'It allocates a new operating system process for every variable assignment.',
        'It bypasses CPU cache lines by randomly scattering all pointers across disk swap.',
        'It requires O(n!) space complexity for all inputs.'
      ],
      correctIndex: 0,
      explanation: `Understanding the internal mechanics (${topic.internals}) helps you predict both latency and memory footprint in production.`
    },
    {
      id: `${topic.id}-q3`,
      question: `What are the Time and Space complexity bounds for ${topic.title}?`,
      options: [
        `Time: ${topic.timeComplexity}  |  Space: ${topic.spaceComplexity}`,
        'Time: O(2^n)  |  Space: O(n^3)',
        'Time: O(n!)  |  Space: O(n!)',
        'Time: O(n^4)  |  Space: O(n^2)'
      ],
      correctIndex: 0,
      explanation: `${topic.title} operates within ${topic.timeComplexity} time complexity and ${topic.spaceComplexity} auxiliary space complexity.`
    }
  ];
}

export const END_TO_END_SCENARIOS: EndToEndScenario[] = [
  {
    id: 'catalog-search',
    title: 'Product SKU Lookup (Read Path + Cache + B-Tree)',
    method: 'GET',
    endpoint: '/api/v1/products/search?sku=704',
    description:
      'Trace how a frontend search request travels through API Gateway rate limiting, JWT auth, Redis look-aside cache, and PostgreSQL B-Tree indexing.',
    modes: [
      {
        id: 'cache-hit',
        label: '1. Normal (Redis Cache HIT · 200 OK)',
        badgeColor: 'green',
        statusCode: '200 OK',
        totalLatencyMs: 6,
        summary: 'Fastest path: Redis serves the cached SKU payload in 0.8ms without touching PostgreSQL.',
        hops: [
          {
            hopNumber: 1,
            stageName: 'React Client',
            component: 'src/api/catalogClient.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'fetch("GET /api/v1/products/search?sku=704")',
            payloadJson: `{\n  "headers": {\n    "Authorization": "Bearer eyJhbGciOiJIUzI1Ni...",\n    "Accept": "application/json"\n  },\n  "query": { "sku": 704 }\n}`,
            whyItMatters:
              'The browser attaches the Bearer JWT token and dispatches an asynchronous HTTP GET request.'
          },
          {
            hopNumber: 2,
            stageName: 'API Gateway & Rate Limiter',
            component: 'src/middleware/rateLimit.middleware.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'REDIS INCR rl:ip:192.0.2.1 → 4 / 60 req/min',
            payloadJson: `{\n  "clientIp": "192.0.2.1",\n  "bucketCount": 4,\n  "limit": 60,\n  "ttlSeconds": 48,\n  "decision": "ALLOW"\n}`,
            whyItMatters:
              'Sliding-window rate limiter verifies the client IP is well below the 60 req/min threshold.'
          },
          {
            hopNumber: 3,
            stageName: 'Auth & Zod Validation',
            component: 'src/middleware/auth.middleware.ts',
            status: 'ok',
            latencyMs: 2,
            commandOrAction: 'jwt.verify(token) + z.coerce.number().int().positive()',
            payloadJson: `{\n  "req.user": { "sub": "usr_42", "role": "member" },\n  "validatedQuery": { "sku": 704 }\n}`,
            whyItMatters:
              'Stateless HMAC-SHA256 verification confirms user identity in O(1) without a database lookup.'
          },
          {
            hopNumber: 4,
            stageName: 'Service & Redis Cache',
            component: 'src/services/catalog.service.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'REDIS GET "catalog:sku:704" → CACHE HIT',
            payloadJson: `{\n  "cacheKey": "catalog:sku:704",\n  "cacheStatus": "HIT",\n  "data": { "sku": 704, "name": "Mechanical Keyboard", "price": 129.00, "stock": 18 }\n}`,
            whyItMatters:
              'O(1) hash table lookup in Redis RAM returns the serialized JSON immediately, bypassing PostgreSQL.'
          },
          {
            hopNumber: 5,
            stageName: 'PostgreSQL Database',
            component: 'src/repositories/catalog.repository.ts',
            status: 'skipped',
            latencyMs: 1,
            commandOrAction: 'SKIPPED (Served from Redis Cache)',
            payloadJson: `{\n  "sqlExecuted": false,\n  "dbConnectionsUsed": 0,\n  "httpResponse": "200 OK (6ms total)"\n}`,
            whyItMatters:
              'Zero database load! Read replicas remain free to handle cache misses and transactional writes.'
          }
        ]
      },
      {
        id: 'cache-miss',
        label: '2. Redis Cache MISS → DB B-Tree Lookup (200 OK)',
        badgeColor: 'blue',
        statusCode: '200 OK',
        totalLatencyMs: 19,
        summary: 'Cache miss triggers an O(log n) PostgreSQL B-Tree index scan, then populates Redis with a 300s TTL.',
        hops: [
          {
            hopNumber: 1,
            stageName: 'React Client',
            component: 'src/api/catalogClient.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'fetch("GET /api/v1/products/search?sku=704")',
            payloadJson: `{\n  "headers": { "Authorization": "Bearer eyJhbGci..." },\n  "query": { "sku": 704 }\n}`,
            whyItMatters: 'Client initiates standard GET request for SKU 704.'
          },
          {
            hopNumber: 2,
            stageName: 'API Gateway & Rate Limiter',
            component: 'src/middleware/rateLimit.middleware.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'REDIS INCR rl:ip:192.0.2.1 → 5 / 60 req/min',
            payloadJson: `{\n  "bucketCount": 5,\n  "decision": "ALLOW"\n}`,
            whyItMatters: 'Request passes rate limit check.'
          },
          {
            hopNumber: 3,
            stageName: 'Auth & Validation',
            component: 'src/middleware/auth.middleware.ts',
            status: 'ok',
            latencyMs: 2,
            commandOrAction: 'jwt.verify(token) → valid',
            payloadJson: `{\n  "req.user": { "sub": "usr_42" },\n  "sku": 704\n}`,
            whyItMatters: 'JWT signature and query schema validated.'
          },
          {
            hopNumber: 4,
            stageName: 'Service & Redis Cache',
            component: 'src/services/catalog.service.ts',
            status: 'warn',
            latencyMs: 2,
            commandOrAction: 'REDIS GET "catalog:sku:704" → nil (CACHE MISS)',
            payloadJson: `{\n  "cacheKey": "catalog:sku:704",\n  "cacheStatus": "MISS",\n  "fallback": "Querying PostgreSQL B-Tree Index idx_products_sku"\n}`,
            whyItMatters:
              'Key expired or never cached. Service falls back to the repository layer and backfills Redis afterward.'
          },
          {
            hopNumber: 5,
            stageName: 'PostgreSQL B-Tree & Cache Backfill',
            component: 'src/repositories/catalog.repository.ts',
            status: 'ok',
            latencyMs: 13,
            commandOrAction:
              'SELECT * FROM products WHERE sku = $1; + REDIS SETEX "catalog:sku:704" 300',
            payloadJson: `{\n  "queryPlan": "Index Scan using idx_products_sku (cost=0.29..8.30 rows=1)",\n  "btreeDepth": 3,\n  "redisBackfill": "SETEX catalog:sku:704 300 {...}",\n  "httpResponse": "200 OK (19ms total)"\n}`,
            whyItMatters:
              'B-Tree index finds the row in 3 page hops instead of scanning 1,000,000 rows, then caches it for future requests.'
          }
        ]
      },
      {
        id: 'rate-limited',
        label: '3. Simulate Rate Limit Spike (HTTP 429)',
        badgeColor: 'amber',
        statusCode: '429 Too Many Requests',
        totalLatencyMs: 2,
        summary: 'Traffic spike blocked at Hop 2 by Redis sliding-window limiter before touching Auth or DB.',
        hops: [
          {
            hopNumber: 1,
            stageName: 'React Client',
            component: 'src/api/catalogClient.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'fetch("GET /api/v1/products/search?sku=704") (Burst Request #61)',
            payloadJson: `{\n  "clientIp": "192.0.2.1",\n  "burstRate": "61 requests in 12 seconds"\n}`,
            whyItMatters: 'Automated scraper or rapid retry loop floods the endpoint.'
          },
          {
            hopNumber: 2,
            stageName: 'API Gateway & Rate Limiter',
            component: 'src/middleware/rateLimit.middleware.ts',
            status: 'error',
            latencyMs: 1,
            commandOrAction: 'REDIS INCR rl:ip:192.0.2.1 → 61 > 60 (REJECT 429)',
            payloadJson: `{\n  "status": 429,\n  "error": "Too Many Requests",\n  "retryAfterSeconds": 48\n}`,
            whyItMatters:
              'Middleware short-circuits the request immediately with HTTP 429 and Retry-After header, protecting downstream services.'
          },
          {
            hopNumber: 3,
            stageName: 'Auth Middleware',
            component: 'src/middleware/auth.middleware.ts',
            status: 'skipped',
            latencyMs: 0,
            commandOrAction: 'SKIPPED (Short-circuited at Hop 2)',
            payloadJson: `{ "executed": false }`,
            whyItMatters: 'CPU cycles saved by not running cryptographic verification on throttled traffic.'
          },
          {
            hopNumber: 4,
            stageName: 'Service & Redis Cache',
            component: 'src/services/catalog.service.ts',
            status: 'skipped',
            latencyMs: 0,
            commandOrAction: 'SKIPPED',
            payloadJson: `{ "executed": false }`,
            whyItMatters: 'Application service layer remains completely insulated.'
          },
          {
            hopNumber: 5,
            stageName: 'PostgreSQL Database',
            component: 'src/repositories/catalog.repository.ts',
            status: 'skipped',
            latencyMs: 0,
            commandOrAction: 'SKIPPED',
            payloadJson: `{ "executed": false }`,
            whyItMatters: 'Database connection pool is protected from exhaustion.'
          }
        ]
      },
      {
        id: 'db-rollback',
        label: '4. Simulate Payment Failure & ACID Rollback (HTTP 502)',
        badgeColor: 'rose',
        statusCode: '502 Bad Gateway',
        totalLatencyMs: 145,
        summary: 'When downstream payment fails during checkout, PostgreSQL ROLLBACK restores deducted inventory automatically.',
        hops: [
          {
            hopNumber: 1,
            stageName: 'React Client',
            component: 'src/api/checkoutClient.ts',
            status: 'ok',
            latencyMs: 2,
            commandOrAction: 'fetch("POST /api/v1/orders/checkout", { sku: 704, qty: 1 })',
            payloadJson: `{\n  "method": "POST",\n  "Headers": { "Idempotency-Key": "idem_99812" },\n  "body": { "sku": 704, "qty": 1, "paymentToken": "tok_visa" }\n}`,
            whyItMatters: 'Client sends an idempotency key so network retries never double-charge the customer.'
          },
          {
            hopNumber: 2,
            stageName: 'API Gateway & Rate Limiter',
            component: 'src/middleware/rateLimit.middleware.ts',
            status: 'ok',
            latencyMs: 1,
            commandOrAction: 'REDIS SETNX idem:99812 "PROCESSING" EX 300',
            payloadJson: `{\n  "idempotencyLock": "ACQUIRED",\n  "rateLimit": "ALLOW"\n}`,
            whyItMatters: 'Redis locks the idempotency key to prevent concurrent duplicate submissions.'
          },
          {
            hopNumber: 3,
            stageName: 'Auth & Body Validation',
            component: 'src/middleware/auth.middleware.ts',
            status: 'ok',
            latencyMs: 2,
            commandOrAction: 'jwt.verify() + OrderSchema.parse(req.body)',
            payloadJson: `{\n  "userId": "usr_42",\n  "validatedBody": { "sku": 704, "qty": 1 }\n}`,
            whyItMatters: 'Ensures qty > 0 and user is authenticated before opening a DB transaction.'
          },
          {
            hopNumber: 4,
            stageName: 'Checkout Service & Payment',
            component: 'src/services/checkout.service.ts',
            status: 'error',
            latencyMs: 120,
            commandOrAction: 'BEGIN; UPDATE inventory SET stock = stock - 1; → stripe.charge() THROWS',
            payloadJson: `{\n  "dbStep1": "UPDATE inventory SET stock = 17 WHERE sku = 704 (uncommitted)",\n  "paymentGateway": "ERROR: Upstream Payment Timeout (502)",\n  "action": "Throw PaymentError to trigger Transaction Rollback"\n}`,
            whyItMatters:
              'Because the inventory decrement happened inside an open SQL transaction, throwing an error prevents partial state corruption.'
          },
          {
            hopNumber: 5,
            stageName: 'PostgreSQL ACID Rollback',
            component: 'src/repositories/order.repository.ts',
            status: 'warn',
            latencyMs: 20,
            commandOrAction: 'ROLLBACK TRANSACTION; → stock restored to 18',
            payloadJson: `{\n  "transaction": "ROLLED_BACK",\n  "inventoryStockAfterRollback": 18,\n  "ordersCreated": 0,\n  "httpResponse": "502 Bad Gateway — Safe to retry"\n}`,
            whyItMatters:
              'Atomicity guarantees all-or-nothing execution: inventory is automatically restored to 18 and no orphan order is created.'
          }
        ]
      }
    ]
  }
];
