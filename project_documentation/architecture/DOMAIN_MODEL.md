# Domain Model - diBoaS Platform

Comprehensive domain model documentation for the diBoaS unified financial platform, following Domain-Driven Design (DDD) principles.

## Core Bounded Contexts

### 1. **Wallet Context**
**Purpose**: Manages user wallet balances and balance transitions

#### **Aggregates**:
- `UserWallet` (Root Aggregate)
  - `AvailableBalance` (USDC on SOL)
  - `InvestedBalance` (BTC, ETH, SOL, SUI)
  - `StrategyBalance` (DeFi positions)

#### **Domain Rules**:
- Balance transfers must be atomic across balance types
- Insufficient balance checks before any transaction initiation
- Balance reservations during transaction processing
- Automatic balance reconciliation after transaction completion

#### **Key Value Objects**:
- `Balance(amount, asset, chain)`
- `WalletAddress(address, chain)`
- `AssetAmount(value, decimals, symbol)`

#### **Entities**:
- `UserWallet`: Manages all user balance types
- `WalletTransaction`: Records balance changes
- `AssetHolding`: Tracks individual asset amounts

### 2. **Transaction Context**
**Purpose**: Orchestrates transaction lifecycles and state management

#### **Aggregates**:
- `Transaction` (Root Aggregate)
  - `TransactionState`
  - `TransactionSteps[]`
  - `ProviderInteractions[]`
  - `ErrorRecoveryAttempts[]`

#### **Domain Rules**:
- Transaction state transitions follow strict business rules
- Failed transactions must not result in fund loss
- All provider interactions must be idempotent
- Transaction history immutability

#### **Key Value Objects**:
- `TransactionId`
- `TransactionAmount(value, sourceAsset, targetAsset)`
- `TransactionFee(amount, asset, provider)`
- `UserAction(type, timestamp, approval)`

#### **Entities**:
- `Transaction`: Root entity managing transaction lifecycle
- `TransactionStep`: Individual transaction steps
- `TransactionHistory`: Immutable transaction records

### 3. **Provider Integration Context**
**Purpose**: Manages external provider interactions and failover

#### **Aggregates**:
- `ProviderRegistry` (Root Aggregate)
  - `OnRampProvider`
  - `OffRampProvider`
  - `DEXProvider`
  - `DeFiProvider`

#### **Domain Rules**:
- Provider health monitoring and automatic failover
- Rate limiting and circuit breaker patterns
- Provider response validation and security checks
- Cost optimization through provider selection

#### **Key Value Objects**:
- `ProviderId(id, type)`
- `ProviderResponse(data, status, timestamp)`
- `ProviderCredentials(apiKey, environment)`

#### **Entities**:
- `Provider`: Base provider entity
- `ProviderHealthStatus`: Monitors provider availability
- `ProviderTransaction`: Tracks provider-specific interactions

### 4. **Compliance Context**
**Purpose**: Handles regulatory requirements and risk management

#### **Aggregates**:
- `UserCompliance` (Root Aggregate)
  - `KYCStatus`
  - `AMLScreening`
  - `TransactionLimits`
  - `GeographicRestrictions`

#### **Domain Rules**:
- KYC verification before high-value transactions
- Real-time AML screening for all fund movements
- Dynamic transaction limits based on risk assessment
- Jurisdiction-specific compliance rules

#### **Key Value Objects**:
- `ComplianceLevel(level, requirements)`
- `TransactionLimit(amount, period, type)`
- `GeographicLocation(country, jurisdiction)`

#### **Entities**:
- `UserCompliance`: User compliance status
- `ComplianceCheck`: Individual compliance verifications
- `RiskAssessment`: Risk scoring for transactions

## Wallet Architecture Integration

### Non-Custodial Wallet Foundation
When users sign up, **4 non-custodial wallets are automatically created**:
- **Solana Wallet**: Stores USDC and SOL (gas fees)
- **Bitcoin Wallet**: Stores BTC and USDT assets
- **Ethereum Layer 1 Wallet**: Stores ETH, USDT, and USDC assets
- **Sui Wallet**: Stores SUI, USDT, and USDC assets

### Virtual Balance Representation
The diBoaS balance categories are **virtual UI representations** of actual wallet contents:

- **Available Balance**: Virtual representation of USDC in Solana wallet
- **Invested Balance**: Virtual representation of non-USDC assets across all 4 wallets
- **Strategy Balance**: Virtual tracking of DeFi-allocated assets with live P&L

## Domain Services

### 1. **Balance Management Service**
- Coordinates balance updates across all wallet types
- Handles cross-chain asset conversions
- Manages balance reservations and releases

### 2. **Transaction Orchestration Service**
- Manages complex transaction flows
- Coordinates provider interactions
- Handles transaction state transitions

### 3. **Provider Selection Service**
- Implements provider selection strategies
- Manages failover and health monitoring
- Optimizes for cost and reliability

### 4. **Compliance Validation Service**
- Performs real-time compliance checks
- Manages risk assessment
- Enforces transaction limits

## Domain Events

### **Command Events** (User Intent)
- `InitiateDepositCommand`
- `InitiateSendCommand`
- `InitiateWithdrawCommand`
- `InitiateBuyCommand`
- `InitiateSellCommand`
- `InitiateStrategyLaunchCommand`
- `InitiateStrategyStopCommand`

### **Domain Events** (State Changes)
- `TransactionInitiated`
- `BalanceReserved`
- `ProviderSelected`
- `PaymentMethodAuthorized`
- `BlockchainTransactionBroadcast`
- `TransactionConfirmed`
- `BalanceUpdated`
- `TransactionCompleted`
- `TransactionFailed`

## Repository Interfaces

### Core Repositories
- `IUserWalletRepository`: Wallet balance persistence
- `ITransactionRepository`: Transaction history and state
- `IProviderRepository`: Provider configuration and status
- `IComplianceRepository`: Compliance data and history

## Implementation Guidelines

### Aggregate Design
- Each aggregate has a clear root entity
- Aggregate boundaries respect transaction boundaries
- No cross-aggregate transactions without events

### Value Object Design
- Money values use `Money` value objects
- All financial calculations go through domain services
- Asset information encapsulated in value objects

### Domain Service Usage
- Complex business logic lives in domain services
- Services coordinate between aggregates
- UI components never contain business logic

---

This domain model ensures clean separation of concerns while maintaining the flexibility needed for a unified financial platform spanning traditional finance, cryptocurrency, and DeFi.