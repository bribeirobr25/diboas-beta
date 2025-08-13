# OneFi Platform Architecture

## 🏛️ **Recommended Architecture Evolution**

### **Phase 1: Modular Monolith with DDD (Current)**
Start with a well-structured modular monolith to:
- Ensure ACID transactions across financial domains
- Simplify regulatory compliance and auditing
- Reduce operational complexity while building team expertise
- Enable rapid feature development and iteration

### **Phase 2: Selective Service Extraction (Future)**
Extract services based on:
- Scaling requirements (high-frequency trading)
- Team boundaries (separate crypto/DeFi teams)
- Regulatory isolation (PCI compliance boundaries)
- Technology requirements (blockchain integration)

## 🎯 **Domain-Driven Design Structure**

### **Core Domains**

```typescript
// Domain Structure
src/
├── domains/
│   ├── traditional-finance/     # Traditional Finance Domain
│   │   ├── banking/            # Bank account management
│   │   ├── payments/           # ACH, wire transfers, cards
│   │   ├── compliance/         # KYC, AML, regulatory reporting
│   │   └── investments/        # Traditional stocks, bonds, ETFs
│   │
│   ├── crypto/                 # Cryptocurrency Domain  
│   │   ├── wallets/           # Wallet management and custody
│   │   ├── trading/           # Crypto trading and exchanges
│   │   ├── market-data/       # Real-time price feeds
│   │   └── custody/           # Asset custody and security
│   │
│   ├── defi/                  # DeFi Protocol Domain
│   │   ├── protocols/         # Protocol integrations
│   │   ├── yield-farming/     # Yield farming strategies
│   │   ├── liquidity/         # Liquidity pool management
│   │   └── governance/        # DAO participation
│   │
│   └── assets/                # Shared Kernel
│       ├── user-management/   # User accounts and profiles
│       ├── risk-management/   # Risk assessment and monitoring
│       ├── portfolio/         # Cross-domain portfolio view
│       └── analytics/         # Platform-wide analytics
```

### **Bounded Context Implementation**

```typescript
// Example: Traditional Finance Domain
export class TraditionalFinanceDomain {
  private bankingService: BankingService
  private paymentsService: PaymentsService
  private complianceService: ComplianceService
  private investmentsService: InvestmentsService

  // Domain-specific business rules
  async transferToExternalBank(request: BankTransferRequest): Promise<TransferResult> {
    // 1. Compliance checks (AML, sanctions screening)
    await this.complianceService.validateTransfer(request)
    
    // 2. Risk assessment
    const riskScore = await this.calculateTransferRisk(request)
    
    // 3. Execute transfer with proper audit trail
    return await this.paymentsService.executeACHTransfer(request)
  }
}

// Example: DeFi Domain
export class DeFiDomain {
  private protocolService: ProtocolService
  private yieldFarmingService: YieldFarmingService
  
  async enterLiquidityPool(request: LiquidityPoolRequest): Promise<PoolEntry> {
    // 1. Protocol-specific validation
    await this.protocolService.validatePoolEntry(request)
    
    // 2. Smart contract interaction
    return await this.protocolService.enterPool(request)
  }
}
```

## ⚡ **Event-Driven Architecture**

### **Event Categories**

```typescript
// Domain Events
interface DomainEvent {
  id: string
  aggregateId: string
  aggregateType: string
  eventType: string
  timestamp: Date
  version: number
  data: any
  metadata: EventMetadata
}

// Traditional Finance Events
class FundsTransferInitiated implements DomainEvent {
  eventType = 'FundsTransferInitiated'
  data: {
    transferId: string
    fromAccount: string
    toAccount: string
    amount: Money
    transferType: 'ACH' | 'WIRE' | 'INTERNAL'
  }
}

// Crypto Events  
class CryptoTradeExecuted implements DomainEvent {
  eventType = 'CryptoTradeExecuted'
  data: {
    tradeId: string
    userId: string
    baseAsset: string
    quoteAsset: string
    quantity: BigNumber
    price: BigNumber
    side: 'BUY' | 'SELL'
  }
}

// DeFi Events
class LiquidityPoolEntered implements DomainEvent {
  eventType = 'LiquidityPoolEntered'
  data: {
    poolId: string
    userId: string
    tokenA: string
    tokenB: string
    amountA: BigNumber
    amountB: BigNumber
    lpTokensReceived: BigNumber
  }
}
```

### **Event Processing Architecture**

```typescript
// Event Store for Complete Audit Trail
interface EventStore {
  append(events: DomainEvent[]): Promise<void>
  getEvents(aggregateId: string): Promise<DomainEvent[]>
  getEventsByType(eventType: string, fromDate?: Date): Promise<DomainEvent[]>
}

// Command Query Responsibility Segregation (CQRS)
class PortfolioQueryHandler {
  async getPortfolioBalance(userId: string): Promise<PortfolioBalance> {
    // Read from optimized read models
    const tradFiBalance = await this.tradFiReadModel.getBalance(userId)
    const cryptoBalance = await this.cryptoReadModel.getBalance(userId)  
    const defiBalance = await this.defiReadModel.getBalance(userId)
    
    return this.aggregatePortfolio(tradFiBalance, cryptoBalance, defiBalance)
  }
}

// Event Handlers for Cross-Domain Coordination
class RiskManagementEventHandler {
  @EventHandler(FundsTransferInitiated)
  async handleTransferInitiated(event: FundsTransferInitiated) {
    // Real-time risk monitoring across all domains
    await this.riskEngine.assessTransfer(event.data)
  }
  
  @EventHandler(CryptoTradeExecuted)
  async handleTradeExecuted(event: CryptoTradeExecuted) {
    // Update portfolio risk metrics
    await this.riskEngine.updatePortfolioRisk(event.data.userId)
  }
}
```

## 🔧 **Technology Stack Recommendations**

### **Backend Architecture**

```typescript
// Domain Layer (Business Logic)
domains/
├── traditional-finance/
│   ├── entities/          # Account, Transaction, Investment
│   ├── value-objects/     # Money, IBAN, RoutingNumber
│   ├── repositories/      # AccountRepository interface
│   ├── services/          # Domain services
│   └── events/           # Domain events

// Application Layer (Use Cases)
applications/
├── banking-app/          # Banking use cases
├── trading-app/          # Trading use cases  
├── defi-app/            # DeFi use cases
└── portfolio-app/       # Portfolio management

// Infrastructure Layer
infrastructure/
├── persistence/         # Database implementations
├── external-apis/       # Bank APIs, Exchange APIs
├── blockchain/         # Blockchain integrations
├── messaging/          # Event bus implementation
└── monitoring/         # Observability stack
```

### **diBoaS Technology Stack**

**Core Architecture (Required):**
- **Primary Backend**: Node.js with Event-Driven Architecture, Domain-Driven Design, and Provider Abstraction Layer
- **Alternative Options**: Node.js/TypeScript or Go (for feature-specific requirements)
- **Architecture Principles**: Event-Driven + Domain-Driven Design + Agnostic Integration Layer (mandatory regardless of language choice)

**Core Platform:**
- **Database**: PostgreSQL (ACID compliance) + Redis (caching)
- **Event Store**: EventStore or PostgreSQL with event tables
- **Message Queue**: Apache Kafka (financial-grade reliability)

**Frontend Stack:**
- **React 18**: Modern React with concurrent features
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animations and micro-interactions
- **React Query**: Server state management and caching

**Security & Infrastructure:**
- **FinTech-Grade Security**: Encrypted routing, IP restrictions, secure references
- **API Gateway**: Rate limiting (100-2000 req/min), versioning, health monitoring
- **WebSocket Service**: Real-time data streaming with auto-reconnection
- **Cross-Subdomain SSO**: JWT-based authentication with AES-GCM encryption

**Blockchain Integration:**
- **Web3 Libraries**: ethers.js, web3.js
- **Node Infrastructure**: Alchemy, Infura, or self-hosted nodes
- **Multi-chain**: Support Ethereum, Polygon, BSC, Solana

**Traditional Finance Integration:**
- **Banking APIs**: Plaid, Yodlee, or direct bank connections
- **Payment Processing**: Stripe, ACH networks
- **Market Data**: Bloomberg API, Alpha Vantage, IEX Cloud

## 🏗️ **Current Implementation Architecture**

### **✅ Implemented Features**

#### **Security Layer**
```typescript
// Encrypted Routing System
export class SecureReferenceManager {
  // All sensitive URLs encrypted to prevent enumeration attacks
  encryptReference(value: any, type: string): string {
    const data = {
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      type,
      timestamp: Date.now(),
      subdomain: detectCurrentSubdomain()
    }
    
    return CryptoJS.AES.encrypt(JSON.stringify(data), ROUTE_ENCRYPTION_KEY)
      .toString()
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}

// IP-Based Access Control
export class IPAccessController {
  isIPAllowed(ip: string, route: string): boolean {
    if (!route.startsWith('/_internal')) return true
    
    // Development allows localhost patterns
    if (import.meta.env?.DEV) {
      const devPatterns = ['127.0.0.1', '::1', 'localhost']
      return devPatterns.some(pattern => ip.includes(pattern))
    }
    
    return this.allowedIPs.has(ip)
  }
}
```

#### **Real-Time Communication**
```typescript
// WebSocket Service with Security Controls
export class WebSocketService {
  async handleConnection(ws: WebSocket, request: Request) {
    // Rate limiting for connections
    const rateLimitResult = this.rateLimiter.checkLimit(clientIP, {
      operation: 'websocket_connect',
      endpoint: request.url
    })
    
    if (!rateLimitResult.allowed) {
      ws.close(1008, 'Rate limit exceeded')
      return
    }
    
    // Authentication required
    const user = await this.authService.validateToken(token)
    if (!user) {
      ws.close(1008, 'Invalid authentication')
      return
    }
    
    // Store authenticated connection
    this.connections.set(connectionId, {
      ws, user, ip: clientIP,
      connectedAt: Date.now(),
      lastActivity: Date.now()
    })
  }
}
```

#### **API Gateway with Rate Limiting**
```typescript
// Multi-Tier Rate Limiting
export class APIGatewayService {
  async processRequest(request: Request) {
    const clientIP = this.getClientIP(request)
    
    // 1. IP Access Control
    if (!this.ipController.isIPAllowed(clientIP, request.url)) {
      throw new SecurityError('IP not authorized')
    }
    
    // 2. Rate Limiting by User Tier
    const rateLimitResult = this.rateLimiter.checkLimit(clientIP, {
      endpoint: request.url,
      method: request.method,
      userTier: request.user?.tier || 'basic' // 100-2000 req/min
    })
    
    if (!rateLimitResult.allowed) {
      throw new RateLimitError('Rate limit exceeded', rateLimitResult)
    }
    
    return this.processSecureRequest(request)
  }
}
```

#### **Cross-Subdomain Authentication**
```typescript
// JWT Token Service with AES-GCM Encryption
export class JWTTokenService {
  async encryptToken(token: string): Promise<EncryptedToken> {
    const key = await this.getEncryptionKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(token)
    )
    
    return {
      data: Array.from(new Uint8Array(encryptedData)),
      iv: Array.from(iv)
    }
  }
}
```

### **Mock Data & Development Environment**

```typescript
// Comprehensive Mock Data Service
export class MockDataService {
  static getMockWallet() {
    return {
      totalBalance: 0,           // Start with empty wallets
      availableBalance: 0,
      currencies: {
        USD: { balance: 0 },
        BTC: { balance: 0 },
        ETH: { balance: 0 },
        SOL: { balance: 0 },
        SUI: { balance: 0 }
      }
    }
  }
  
  static getMockAddresses() {
    return {
      BTC: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      ETH: "0x742d35Cc6634C0532925a3b8D46B62C6",
      SOL: "11111111111111111111111111111112",
      SUI: "0x2::sui::SUI"
    }
  }
  
  static getMockUsers() {
    return [
      { username: "alice_crypto", displayName: "Alice Johnson" },
      { username: "bob_trader", displayName: "Bob Smith" },
      { username: "charlie_defi", displayName: "Charlie Brown" }
    ]
  }
}
```

## 📊 **Monitoring & Observability**

### **Financial-Grade Observability Stack**

```typescript
// Custom Financial Metrics
class FinancialMetrics {
  // Business Metrics
  @Metric('portfolio_value_change')
  trackPortfolioValue(userId: string, oldValue: Money, newValue: Money) {
    const change = newValue.subtract(oldValue)
    this.recordMetric('portfolio_value_change', {
      userId,
      change: change.amount,
      percentage: change.divide(oldValue).multiply(100)
    })
  }

  // Risk Metrics  
  @Metric('transaction_risk_score')
  trackTransactionRisk(transactionId: string, riskScore: number) {
    this.recordMetric('transaction_risk_score', {
      transactionId,
      riskScore,
      alert: riskScore > 0.8
    })
  }

  // Performance Metrics
  @Metric('trade_execution_latency')
  trackTradeLatency(tradeId: string, latencyMs: number) {
    this.recordMetric('trade_execution_latency', {
      tradeId,
      latencyMs,
      sla_breach: latencyMs > 100 // 100ms SLA
    })
  }
}

// Audit Trail Implementation
class AuditTrail {
  async recordFinancialAction(action: FinancialAction) {
    await this.auditStore.record({
      timestamp: new Date(),
      userId: action.userId,
      actionType: action.type,
      amount: action.amount,
      beforeState: action.beforeState,
      afterState: action.afterState,
      requestId: action.requestId,
      ipAddress: action.metadata.ipAddress,
      userAgent: action.metadata.userAgent,
      regulatory: {
        jurisdiction: action.metadata.jurisdiction,
        complianceLevel: action.metadata.complianceLevel
      }
    })
  }
}
```

### **Observability Stack**

```yaml
# Monitoring Stack
monitoring:
  metrics:
    - Prometheus (custom financial metrics)
    - Grafana (financial dashboards)
  
  logging:
    - ELK Stack (Elasticsearch, Logstash, Kibana)
    - Structured logging with correlation IDs
  
  tracing:
    - Jaeger (distributed tracing)
    - OpenTelemetry (standardized instrumentation)
  
  alerts:
    - PagerDuty (incident management)
    - Custom risk-based alerting

# Financial-Specific Monitoring
financial_monitoring:
  risk_alerts:
    - Large transaction alerts (>$10,000)
    - Unusual pattern detection
    - Regulatory threshold monitoring
  
  performance_slas:
    - Trade execution: <100ms
    - Payment processing: <30s
    - Portfolio calculation: <5s
  
  compliance_monitoring:
    - AML transaction monitoring
    - KYC status tracking
    - Regulatory reporting metrics
```

## 🛡️ **Security & Compliance Architecture**

### **Multi-Layer Security**

```typescript
// Security by Domain
class SecurityManager {
  // Traditional Finance Security
  async validateTradFiAccess(user: User, action: string): Promise<boolean> {
    return await this.validatePCI_DSS(user, action) &&
           await this.validateSOX_Compliance(action) &&
           await this.validateBankSecrecyAct(user, action)
  }
  
  // Crypto Security
  async validateCryptoAccess(user: User, action: string): Promise<boolean> {
    return await this.validateWalletSecurity(user) &&
           await this.validateCustodyControls(action) &&
           await this.validateSanctionsScreening(user)
  }
  
  // DeFi Security
  async validateDeFiAccess(user: User, protocol: string): Promise<boolean> {
    return await this.validateSmartContractSecurity(protocol) &&
           await this.validateProtocolRisk(protocol) &&
           await this.validateSlippageLimits(user, protocol)
  }
}
```

### **Security Testing & Validation**

```typescript
// 42 Comprehensive Security Tests
describe('Security Test Suite', () => {
  // Route Security (12 tests)
  describe('Route Configuration Security', () => {
    it('should encrypt all sensitive URL references')
    it('should restrict internal routes to authorized IPs')
    it('should prevent enumeration attacks')
    // ... 9 more tests
  })
  
  // Access Control (10 tests)
  describe('Access Control Validation', () => {
    it('should enforce IP-based restrictions')
    it('should validate rate limiting')
    it('should block malicious IPs')
    // ... 7 more tests
  })
  
  // Encryption/Decryption (12 tests)
  describe('Reference Encryption', () => {
    it('should create URL-safe encrypted references')
    it('should handle reference expiration')
    it('should prevent tampering')
    // ... 9 more tests
  })
  
  // Edge Cases (8 tests)
  describe('Security Edge Cases', () => {
    it('should handle malformed references')
    it('should process unicode characters safely')
    it('should manage large value encryption')
    // ... 5 more tests
  })
})
```

## 🚀 **Migration Strategy**

### **Phase 1: Modular Monolith (Months 1-6)**
```
✅ COMPLETED:
- Domain-Driven Design with clear boundaries
- Event sourcing for audit trails
- FinTech-grade security implementation
- 42 comprehensive security tests passing
- Mock data service for development
- API Gateway with rate limiting
- WebSocket real-time communication
- Cross-subdomain SSO
```

### **Phase 2: Domain Service Extraction (Months 6-12)**
```
PLANNED:
1. Market Data Service (real-time requirements)
2. Risk Management Service (cross-domain)
3. Notification Service (scalability needs)
4. Blockchain Integration Service (technology isolation)
```

### **Phase 3: Full Microservices (Year 2+)**
```
FUTURE:
- Traditional Finance Services
- Crypto Trading Services  
- DeFi Protocol Services
- User Management Services
```

## 📈 **Alternative Architectures to Consider**

### **1. Serverless-First Architecture**
```typescript
// For variable trading volumes
const tradingFunction = {
  runtime: 'nodejs18',
  events: [
    { eventBridge: { pattern: { source: 'trading.orders' } } }
  ],
  environment: {
    EXCHANGE_API_KEY: '${env:EXCHANGE_API_KEY}',
    RISK_THRESHOLD: '${env:RISK_THRESHOLD}'
  }
}
```

### **2. Mesh Architecture**
```typescript
// Service mesh for complex financial integrations
serviceMesh: {
  istio: {
    enabled: true,
    security: {
      mTLS: 'STRICT',
      authorizationPolicy: 'financial-services'
    },
    traffic: {
      retryPolicy: { attempts: 3, perTryTimeout: '10s' },
      circuitBreaker: { maxConnections: 100 }
    }
  }
}
```

## 🎯 **Current Status & Recommendations**

### **✅ Completed Implementation:**
1. **Node.js + Modular Monolith + DDD** (primary technology choice)
2. **Event Sourcing + CQRS** (perfect for financial audit trails)
3. **Hexagonal Architecture** (multiple adapters for banks/exchanges/protocols)
4. **Provider Abstraction Layer** (agnostic integration approach)
5. **FinTech-Grade Security** (42 security tests passing)
6. **Comprehensive Mock Data Service** (complete development environment)
7. **API Gateway with Rate Limiting** (100-2000 req/min based on user tier)
8. **WebSocket Real-Time Communication** (with security controls)
9. **Cross-Subdomain SSO** (AES-GCM encrypted JWT tokens)

### **Next Phase Recommendations:**
1. **Selective Service Extraction** based on scaling needs
2. **Event-Driven Microservices** for high-volume components
3. **Multi-Cloud Strategy** for regulatory compliance
4. **Advanced Risk Engine** with ML/AI capabilities

### **Key Success Factors:**
- **Regulatory Compliance by Design**
- **Audit Trail Everything** (event sourcing)
- **Real-time Risk Monitoring** 
- **Cross-Domain Portfolio Views**
- **Gradual Feature Rollouts** (feature flags)

> **Technology Note**: Teams may implement specific features using Node.js/TypeScript or Go if needed, but must maintain the core architectural principles listed above.

## 📊 **Architecture Metrics**

### **Current Implementation Metrics:**
- **Security Test Coverage**: 42/42 tests passing (100%)
- **Encrypted Reference Usage**: 100% of sensitive URLs encrypted
- **Rate Limiting Coverage**: 100% of API endpoints protected
- **Cross-Subdomain Support**: Full SSO implementation
- **Mock Data Coverage**: Complete development environment
- **Development Setup Time**: <5 minutes with comprehensive mock data

### **Performance Targets:**
- **API Response Time**: <200ms for 95th percentile
- **WebSocket Connection**: <100ms establishment time
- **Security Validation**: <10ms per request
- **Rate Limit Processing**: <5ms per request
- **Reference Encryption**: <1ms per operation

This architecture ensures you can handle the complexity of Traditional Finance regulations while embracing the innovation of Crypto and DeFi, with a clear path to scale as your platform grows. The current implementation provides a solid foundation with enterprise-grade security and comprehensive development tooling.