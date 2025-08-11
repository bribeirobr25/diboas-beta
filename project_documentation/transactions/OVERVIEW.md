# Transaction System Overview

diBoaS Transactions enable seamless On/Off-Ramp and multi-chain operations with complex swap and bridging operations hidden from users. The system presents a unified wallet experience while supporting BTC, ETH Layer 1, SOL, and SUI chains behind the scenes.

## Transaction Categories

diBoaS has 3 main categories allowing users to easily deal with Financial solutions:

### 1. Banking Category (Add, Send and Withdraw Transactions)
This is the category allowing users to perform bank like operations: Add/Deposit Money, Send and Withdraw. This category is the entry point and facilitator by allowing On/Off-Ramp as well as On-Chain transactions.

### 2. Investing Category (Buy and Sell Transactions)
This is the category allowing users to easily invest into Crypto, Stocks, Gold, Indexes and Real State Funds with quick and simple Buy and Sell transactions. This category is fully On-Chain as all assets are tokenized assets.

### 3. Goal Strategies (Create, Start and Stop objective driven strategies)
This is the category allowing users to create, start/launch and stop Goal Strategies to grow their wealth and get consistent yielding via DeFi. Goal Strategies use a goal-oriented approach where each strategy is designed around specific financial objectives like Emergency Fund, Dream Vacation, or Custom Goals.

## Balance System

### Balance Structure
- **Total Balance**: Available Balance + Invested Balance + Strategy Balance
- **Available Balance**: USDC only on Solana chain (liquid funds ready for spending)
- **Invested Balance**: Physical assets held in non-custodial wallets (BTC, ETH, SOL, SUI, Tokenized Gold, Stocks) - excludes USDC
- **Strategy Balance**: Virtual tracking of funds deployed in active DeFi Goal Strategies with live P&L updates

### Balance Categories

#### Available Balance
- **Asset**: USDC on Solana chain only
- **Purpose**: Liquid funds for sends, withdrawals, buying assets, and launching Goal Strategies
- **Storage**: User's non-custodial Solana wallet
- **Updates**: Real-time with transaction completion

#### Invested Balance  
- **Assets**: BTC, ETH, SOL, SUI, and tokenized assets (Gold, Stocks, Real Estate)
- **Purpose**: Physical cryptocurrency and tokenized assets owned by the user
- **Storage**: User's non-custodial wallets across 4 supported chains (BTC, ETH, SOL, SUI)
- **Updates**: Direct reflection of actual wallet holdings
- **Asset Tracking**: Individual asset amounts and FIAT values tracked separately
- **Exclusion**: USDC is never part of Invested Balance (always in Available Balance)

#### Strategy Balance
- **Nature**: Virtual balance tracking, not physical asset storage
- **Purpose**: Monitor funds allocated to active DeFi Goal Strategies
- **Initial Value**: Amount originally moved from Available Balance when launching strategy
- **Updates**: Live P&L updates from 3rd party DeFi providers showing gains/losses
- **Strategy Tracking**: Individual strategy performance, yields, and current values
- **Settlement**: When strategy is stopped, final amount (including P&L) moves to Available Balance

## Wallet Architecture & Balance Implementation

### Non-Custodial Wallet Foundation
When users sign up, **4 non-custodial wallets are automatically created** to support different blockchain networks:
- **Solana Wallet**: Stores USDC and SOL (gas fees)
- **Bitcoin Wallet**: Stores BTC and USDT assets
- **Ethereum Layer 1 Wallet**: Stores ETH, USDT, and USDC assets
- **Sui Wallet**: Stores SUI, USDT, and USDC assets

### Virtual Balance Representation
The diBoaS balance categories are **virtual UI representations** of what's actually stored in the real non-custodial wallets:

- **Available Balance**: Virtual representation of USDC amount and USD value in the Solana wallet only
- **Invested Balance**: Virtual representation of all non-USDC assets across all 4 wallets with their USD values
- **Strategy Balance**: Virtual tracking of assets allocated to 3rd party DeFi platforms with live P&L updates

### Asset-to-Chain Assignment
Each asset has inherent chain information that determines:
- **Network fees**: Applied based on the asset's native chain
- **Wallet storage**: Which of the 4 wallets holds the physical asset
- **Transaction routing**: How swaps and bridges are executed between chains

**Important**: When documentation refers to "sending" or "swapping" between diBoaS balances, these operations actually occur between the user's non-custodial wallets, with balances serving as user-friendly visual representations of the underlying wallet contents.

> **Implementation Improvement Note**: All assets should have explicit chain information metadata to enable automatic network fee calculation and proper wallet routing. This will eliminate manual chain detection and ensure consistent fee application across all transaction types.

## Transaction Flow

| Category | Operations | From Balance | To Balance |
|----------|------------|--------------|------------|
| **Banking** | Add | External → Available |
| **Banking** | Send | Available → Available (P2P) |
| **Banking** | Withdraw | Available → External |
| **Investing** | Buy | Available/External → Invested |
| **Investing** | Sell | Invested → Available |
| **Strategies** | Start | Available → Strategy |
| **Strategies** | Stop | Strategy → Available |

## Navigation Flow

```
App Dashboard → Transaction Categories → Transaction Pages → Progress → Success/Error
     ↑              ↓                      ↓              ↓           ↓
Portfolio Overview → Category Selection → Transaction Config → Processing → Balance Update
```

## Related Documentation

- [Banking Operations](./BANKING.md) - Add, Send, Withdraw transactions
- [Investment Operations](./INVESTMENTS.md) - Buy, Sell assets  
- [Goal Strategies](./STRATEGIES.md) - Automated investment strategies
- [Fee System](./FEES.md) - Fee calculations and structures
- [Validation System](./VALIDATION.md) - Transaction validation rules