# Event System - diBoaS Platform

Event-driven architecture implementation for the diBoaS unified financial platform, ensuring decoupled services and complete audit trails.

## Event Architecture Overview

### Event Categories

#### 1. **Command Events** (User Intent)
Events representing user actions and system commands:
- `InitiateDepositCommand`
- `InitiateSendCommand`
- `InitiateWithdrawCommand`
- `InitiateBuyCommand`
- `InitiateSellCommand`
- `InitiateStrategyLaunchCommand`
- `InitiateStrategyStopCommand`

#### 2. **Domain Events** (State Changes)
Events representing changes in business state:
- `TransactionInitiated`
- `BalanceReserved`
- `ProviderSelected`
- `PaymentMethodAuthorized`
- `BlockchainTransactionBroadcast`
- `TransactionConfirmed`
- `BalanceUpdated`
- `TransactionCompleted`
- `TransactionFailed`

#### 3. **Integration Events** (External System Interactions)
Events representing external provider interactions:
- `OnRampPaymentRequested`
- `OffRampWithdrawalRequested`
- `DEXSwapRequested`
- `DeFiStrategyLaunched`
- `ProviderResponseReceived`
- `BlockchainConfirmationReceived`

## Event Flow Patterns by Transaction Type

### Banking - Add/Deposit Transaction Flow

**Event Sequence**:
1. `InitiateDepositCommand` → `DepositTransactionInitiated`
2. `DepositTransactionInitiated` → `PaymentMethodValidationRequested`
3. `PaymentMethodValidated` → `OnRampProviderSelected`
4. `OnRampProviderSelected` → `FiatPaymentRequested`
5. `FiatPaymentConfirmed` → `USDCConversionRequested`
6. `USDCConversionCompleted` → `AvailableBalanceUpdateRequested`
7. `AvailableBalanceUpdated` → `DepositTransactionCompleted`

**Compensation Events** (on failure):
- `FiatPaymentRefunded`
- `BalanceReservationReleased`
- `DepositTransactionFailed`

### Banking - Send Transaction Flow

**Event Sequence**:
1. `InitiateSendCommand` → `SendTransactionInitiated`
2. `SendTransactionInitiated` → `RecipientValidated`
3. `RecipientValidated` → `AvailableBalanceReserved`
4. `AvailableBalanceReserved` → `SolanaTransferRequested`
5. `SolanaTransferBroadcast` → `SolanaTransferConfirmed`
6. `SolanaTransferConfirmed` → `RecipientBalanceUpdated`
7. `RecipientBalanceUpdated` → `SendTransactionCompleted`

### Banking - Withdraw Transaction Flow

**External Wallet Withdraw**:
1. `InitiateWithdrawCommand` → `WithdrawTransactionInitiated`
2. `WithdrawTransactionInitiated` → `ExternalWalletValidated`
3. `ExternalWalletValidated` → `AvailableBalanceReserved`
4. `AvailableBalanceReserved` → `DEXProviderSelected`
5. `DEXProviderSelected` → `AssetConversionRequested`
6. `AssetConversionCompleted` → `CrossChainTransferRequested`
7. `CrossChainTransferConfirmed` → `WithdrawTransactionCompleted`

**Off-Ramp Withdraw**:
1. `InitiateWithdrawCommand` → `WithdrawTransactionInitiated`
2. `WithdrawTransactionInitiated` → `OffRampProviderSelected`
3. `OffRampProviderSelected` → `AvailableBalanceReserved`
4. `AvailableBalanceReserved` → `USDCToFiatConversionRequested`
5. `USDCToFiatConversionCompleted` → `FiatTransferRequested`
6. `FiatTransferConfirmed` → `WithdrawTransactionCompleted`

### Investment - Buy Transaction Flow

**On-Chain Buy**:
1. `InitiateBuyCommand` → `BuyTransactionInitiated`
2. `BuyTransactionInitiated` → `AvailableBalanceReserved`
3. `AvailableBalanceReserved` → `DEXProviderSelected`
4. `DEXProviderSelected` → `AssetSwapRequested`
5. `AssetSwapCompleted` → `InvestedBalanceUpdated`
6. `InvestedBalanceUpdated` → `BuyTransactionCompleted`

**On-Ramp Buy**:
1. `InitiateBuyCommand` → `BuyTransactionInitiated`
2. `BuyTransactionInitiated` → `OnRampProviderSelected`
3. `OnRampProviderSelected` → `FiatPaymentRequested`
4. `FiatPaymentConfirmed` → `DirectAssetPurchaseRequested`
5. `DirectAssetPurchaseCompleted` → `InvestedBalanceUpdated`
6. `InvestedBalanceUpdated` → `BuyTransactionCompleted`

### Goal Strategy - Launch/Stop Transaction Flow

**Strategy Launch**:
1. `InitiateStrategyLaunchCommand` → `StrategyLaunchInitiated`
2. `StrategyLaunchInitiated` → `AvailableBalanceReserved`
3. `AvailableBalanceReserved` → `DeFiProviderSelected`
4. `DeFiProviderSelected` → `RequiredAssetSwapRequested`
5. `RequiredAssetSwapCompleted` → `DeFiStrategyDeployRequested`
6. `DeFiStrategyDeployed` → `StrategyBalanceUpdated`
7. `StrategyBalanceUpdated` → `StrategyLaunchCompleted`

**Strategy Stop**:
1. `InitiateStrategyStopCommand` → `StrategyStopInitiated`
2. `StrategyStopInitiated` → `DeFiStrategyWithdrawRequested`
3. `DeFiStrategyWithdrawn` → `AssetToUSDCSwapRequested`
4. `AssetToUSDCSwapCompleted` → `AvailableBalanceUpdated`
5. `AvailableBalanceUpdated` → `StrategyStopCompleted`

## Event Bus Implementation

### DataManager Integration
The diBoaS platform uses a centralized DataManager for event coordination:

```javascript
// Event subscription example
useEffect(() => {
  const unsubscribe = dataManager.subscribe('balance:updated', (data) => {
    setBalance(data.balance)
  })
  
  return unsubscribe
}, [])

// Event emission example
dataManager.emit('transaction:completed', {
  transactionId: 'tx123',
  amount: new Money(100, 'USD'),
  type: 'SEND'
})
```

### Event Naming Convention
- **Format**: `domain:action` (e.g., `wallet:connected`, `transaction:completed`)
- **Domains**: `wallet`, `transaction`, `provider`, `compliance`, `strategy`
- **Actions**: `initiated`, `completed`, `failed`, `updated`, `validated`

## Event Store Architecture

### Event Persistence
- **Complete Audit Trail**: All events stored immutably
- **Event Replay**: Capability to rebuild state from events
- **Temporal Queries**: Query system state at any point in time
- **Compliance**: Full transaction history for regulatory requirements

### Event Schema
```javascript
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

interface EventMetadata {
  userId?: string
  correlationId: string
  causationId?: string
  ipAddress?: string
  userAgent?: string
}
```

## Error Handling & Compensation

### Saga Pattern Implementation

#### Choreography-Based Sagas (Simple Flows)
- Each service publishes events and listens for responses
- Self-contained compensation logic in each service
- Suitable for linear transaction flows (Send, basic Buy/Sell)

#### Orchestration-Based Sagas (Complex Flows)
- Central saga orchestrator manages transaction flow
- Handles complex compensation scenarios
- Better for multi-provider, multi-step transactions (Withdraw, Strategy operations)

### Compensation Events
- `FiatPaymentRefunded`
- `BalanceReservationReleased`
- `AssetSwapReverted`
- `ProviderTransactionCancelled`
- `DeFiPositionExited`

## Event Processing Patterns

### Real-time Processing
- **Immediate Response**: Critical user-facing events processed immediately
- **WebSocket Updates**: Live status updates to UI components
- **Balance Updates**: Real-time balance synchronization

### Batch Processing
- **Analytics Events**: Daily aggregation for reporting
- **Compliance Events**: Batch processing for regulatory reporting
- **Provider Health**: Periodic health check aggregation

## Event Security

### Event Validation
- **Schema Validation**: All events validated against schemas
- **Authorization**: Event publishing requires proper permissions
- **Encryption**: Sensitive event data encrypted at rest

### Audit Requirements
- **Immutable Log**: Events cannot be deleted or modified
- **Digital Signatures**: Critical events digitally signed
- **Retention Policy**: Events retained per regulatory requirements

## Monitoring & Observability

### Event Metrics
- **Event Volume**: Track events per type and domain
- **Processing Latency**: Monitor event processing times
- **Error Rates**: Track failed event processing
- **Replay Performance**: Monitor event replay capabilities

### Event Tracking
- **Correlation IDs**: Track related events across services
- **Event Chains**: Visualize complete transaction flows
- **Dead Letter Queues**: Handle failed event processing

---

This event system ensures complete auditability, loose coupling between services, and robust error handling for all financial operations in the diBoaS platform.