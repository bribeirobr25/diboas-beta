# Service Communication - diBoaS Platform

Inter-service communication patterns and protocols for the diBoaS unified financial platform, supporting both monolithic and microservices architectures.

## Communication Architecture Overview

### **Phase 1: Modular Monolith Communication**
During the initial implementation phase, services communicate within the same process through:
- **Direct Method Calls**: Between domain services
- **Event Bus**: For decoupled communication
- **Shared Data Access**: Through repository abstractions

### **Phase 2+: Distributed Services Communication**
As services are extracted, communication evolves to:
- **Event-Driven Messaging**: Primary communication method
- **Synchronous APIs**: For real-time requirements
- **Message Queues**: For reliable async processing

## Communication Patterns

### 1. **Event-Driven Communication (Primary)**

#### **Event Bus Architecture**
```javascript
// DataManager serves as central event coordinator
class DataManager {
  emit(eventType, eventData) {
    // Publishes events to all subscribers
    this.eventBus.publish(eventType, eventData)
  }
  
  subscribe(eventType, handler) {
    // Subscribes to specific event types
    return this.eventBus.subscribe(eventType, handler)
  }
}
```

#### **Cross-Service Event Flow**
```javascript
// Service A publishes domain event
transactionService.emit('transaction:completed', {
  transactionId: 'tx123',
  userId: 'user456',
  amount: new Money(100, 'USD'),
  type: 'SEND'
})

// Service B subscribes to event
walletService.subscribe('transaction:completed', (event) => {
  walletService.updateBalance(event.userId, event.amount)
})
```

### 2. **Request-Response Communication**

#### **Synchronous API Calls**
For operations requiring immediate response:
```javascript
// Provider health check (synchronous)
const providerStatus = await providerRegistry.getProviderHealth(providerId)

// Balance validation (synchronous)
const hasInsufficientFunds = await walletService.validateBalance(userId, amount)
```

#### **API Gateway Pattern**
```javascript
// API Gateway routes requests to appropriate services
class APIGateway {
  async routeRequest(request) {
    switch(request.domain) {
      case 'wallet':
        return await this.walletService.handle(request)
      case 'transaction':
        return await this.transactionService.handle(request)
      case 'provider':
        return await this.providerService.handle(request)
    }
  }
}
```

### 3. **Message Queue Communication**

#### **Reliable Async Processing**
```javascript
// High-priority financial operations
class FinancialMessageQueue {
  async publishTransaction(transaction) {
    await this.messageQueue.publish('financial.transactions', {
      transactionId: transaction.id,
      priority: 'high',
      retryPolicy: { maxAttempts: 3, backoff: 'exponential' }
    })
  }
}
```

#### **Dead Letter Queue Handling**
```javascript
// Failed message handling
class DeadLetterHandler {
  async handleFailedMessage(message) {
    await this.auditService.logFailedMessage(message)
    await this.alertService.notifyOperations(message)
    
    // Attempt manual recovery if possible
    if (this.canRecover(message)) {
      await this.retryMessage(message)
    }
  }
}
```

## Service Integration Protocols

### 1. **Provider Integration Communication**

#### **Provider Registry Pattern**
```javascript
class ProviderRegistry {
  async selectProvider(criteria) {
    // Health check communication
    const healthyProviders = await this.getHealthyProviders()
    
    // Cost optimization communication
    const quotes = await Promise.all(
      healthyProviders.map(provider => provider.getQuote(criteria))
    )
    
    // Select optimal provider
    return this.selectOptimalProvider(quotes)
  }
}
```

#### **Provider Failover Communication**
```javascript
class ProviderFailoverHandler {
  async handleProviderFailure(providerId, transaction) {
    // Mark provider as unhealthy
    await this.providerHealth.markUnhealthy(providerId)
    
    // Select backup provider
    const backupProvider = await this.selectBackupProvider(transaction)
    
    // Retry transaction with backup
    return await this.retryWithProvider(backupProvider, transaction)
  }
}
```

### 2. **Blockchain Communication**

#### **Multi-Chain Coordination**
```javascript
class BlockchainCommunicator {
  async executeMultiChainTransaction(transaction) {
    const sourceChain = this.getChainHandler(transaction.sourceChain)
    const targetChain = this.getChainHandler(transaction.targetChain)
    
    // Coordinate cross-chain transaction
    const sourceTx = await sourceChain.initiate(transaction)
    const bridgeTx = await this.bridgeHandler.bridge(sourceTx)
    const targetTx = await targetChain.complete(bridgeTx)
    
    return { sourceTx, bridgeTx, targetTx }
  }
}
```

#### **Transaction Status Communication**
```javascript
class TransactionStatusHandler {
  async trackTransactionStatus(transactionId) {
    // Poll multiple chains for status
    const statusChecks = this.supportedChains.map(chain => 
      chain.getTransactionStatus(transactionId)
    )
    
    const results = await Promise.allSettled(statusChecks)
    return this.consolidateStatus(results)
  }
}
```

## Communication Security

### 1. **Authentication & Authorization**
```javascript
class ServiceAuth {
  async authenticateServiceCall(request) {
    // Validate service JWT token
    const token = this.extractToken(request)
    const payload = await this.validateToken(token)
    
    // Check service permissions
    return await this.checkPermissions(payload.serviceId, request.operation)
  }
}
```

### 2. **Secure Communication Channels**
```javascript
// TLS/mTLS for inter-service communication
const serviceClient = new SecureServiceClient({
  cert: process.env.SERVICE_CERT,
  key: process.env.SERVICE_KEY,
  ca: process.env.CA_CERT,
  rejectUnauthorized: true
})
```

### 3. **Data Encryption**
```javascript
class SecureCommunication {
  async sendSecureMessage(recipient, data) {
    // Encrypt sensitive financial data
    const encryptedData = await this.encryptionService.encrypt(data)
    
    // Send with integrity check
    return await this.messageBus.send(recipient, {
      data: encryptedData,
      checksum: this.calculateChecksum(encryptedData),
      timestamp: new Date().toISOString()
    })
  }
}
```

## Communication Monitoring

### 1. **Service Health Monitoring**
```javascript
class ServiceHealthMonitor {
  async checkServiceHealth() {
    const services = ['wallet', 'transaction', 'provider', 'compliance']
    
    const healthChecks = await Promise.allSettled(
      services.map(service => this.pingService(service))
    )
    
    return this.generateHealthReport(healthChecks)
  }
}
```

### 2. **Communication Metrics**
```javascript
class CommunicationMetrics {
  trackServiceCall(serviceName, operation, latency, success) {
    this.metrics.increment(`service.${serviceName}.${operation}.calls`)
    this.metrics.histogram(`service.${serviceName}.${operation}.latency`, latency)
    
    if (!success) {
      this.metrics.increment(`service.${serviceName}.${operation}.errors`)
    }
  }
}
```

### 3. **Distributed Tracing**
```javascript
class DistributedTracing {
  createServiceSpan(serviceName, operation, parentSpan) {
    const span = this.tracer.startSpan(`${serviceName}.${operation}`, {
      childOf: parentSpan,
      tags: {
        'service.name': serviceName,
        'operation.name': operation
      }
    })
    
    return span
  }
}
```

## Error Handling & Circuit Breakers

### 1. **Circuit Breaker Pattern**
```javascript
class ServiceCircuitBreaker {
  async callService(serviceName, operation, params) {
    const circuitBreaker = this.getCircuitBreaker(serviceName)
    
    if (circuitBreaker.isOpen()) {
      throw new ServiceUnavailableError(`${serviceName} circuit breaker is open`)
    }
    
    try {
      const result = await this.executeServiceCall(serviceName, operation, params)
      circuitBreaker.recordSuccess()
      return result
    } catch (error) {
      circuitBreaker.recordFailure()
      throw error
    }
  }
}
```

### 2. **Retry Mechanisms**
```javascript
class ServiceRetryHandler {
  async retryServiceCall(serviceName, operation, params, maxRetries = 3) {
    let lastError
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.callService(serviceName, operation, params)
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries && this.isRetriableError(error)) {
          await this.delay(this.calculateBackoff(attempt))
          continue
        }
        
        break
      }
    }
    
    throw lastError
  }
}
```

## Migration Strategy Communication

### **Phase 1: Monolith Communication**
- Direct method calls between domain services
- Shared event bus for loose coupling
- Repository pattern for data access

### **Phase 2: Hybrid Communication**
- Extract high-value services first
- Maintain event-driven communication
- Add service-to-service API calls

### **Phase 3: Full Microservices Communication**
- Complete event-driven architecture
- Service mesh for communication management
- API gateway for external communication

## Best Practices

### 1. **Communication Principles**
- **Async First**: Prefer asynchronous communication
- **Event-Driven**: Use events for loose coupling
- **Idempotent**: All operations should be idempotent
- **Timeout Handling**: Always set appropriate timeouts

### 2. **Error Handling**
- **Graceful Degradation**: Services should handle failures gracefully
- **Circuit Breakers**: Prevent cascade failures
- **Dead Letter Queues**: Handle failed messages appropriately

### 3. **Monitoring & Observability**
- **Distributed Tracing**: Track requests across services
- **Metrics Collection**: Monitor communication patterns
- **Health Checks**: Regular service health monitoring

---

This service communication architecture ensures reliable, secure, and scalable inter-service communication throughout the diBoaS platform's evolution from monolith to microservices.