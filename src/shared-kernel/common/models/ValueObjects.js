/**
 * Core Value Objects for diBoaS Platform
 * Domain-Driven Design Foundation
 */

/**
 * Represents monetary values with currency
 */
export class Money {
  constructor(amount, currency = 'USD') {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Money amount must be a positive number')
    }
    if (typeof currency !== 'string' || currency.length === 0) {
      throw new Error('Currency must be a valid string')
    }
    
    this._amount = Number(amount.toFixed(2))
    this._currency = currency.toUpperCase()
    Object.freeze(this)
  }

  get amount() { return this._amount }
  get currency() { return this._currency }

  add(otherMoney) {
    this._validateSameCurrency(otherMoney)
    return new Money(this._amount + otherMoney.amount, this._currency)
  }

  subtract(otherMoney) {
    this._validateSameCurrency(otherMoney)
    const result = this._amount - otherMoney.amount
    if (result < 0) throw new Error('Cannot subtract to negative amount')
    return new Money(result, this._currency)
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error('Factor must be a positive number')
    }
    return new Money(this._amount * factor, this._currency)
  }

  isGreaterThan(otherMoney) {
    this._validateSameCurrency(otherMoney)
    return this._amount > otherMoney.amount
  }

  isEqual(otherMoney) {
    return this._currency === otherMoney.currency && 
           this._amount === otherMoney.amount
  }

  toString() {
    return `${this._amount.toFixed(2)} ${this._currency}`
  }

  toDisplayString() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._currency
    }).format(this._amount)
  }

  _validateSameCurrency(otherMoney) {
    if (this._currency !== otherMoney.currency) {
      throw new Error(`Cannot operate on different currencies: ${this._currency} vs ${otherMoney.currency}`)
    }
  }
}

/**
 * Represents percentage values (0-100)
 */
export class Percentage {
  constructor(value) {
    if (typeof value !== 'number' || value < 0 || value > 100) {
      throw new Error('Percentage must be between 0 and 100')
    }
    this._value = Number(value.toFixed(2))
    Object.freeze(this)
  }

  get value() { return this._value }

  add(otherPercentage) {
    const result = this._value + otherPercentage.value
    if (result > 100) throw new Error('Percentage cannot exceed 100')
    return new Percentage(result)
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error('Factor must be a positive number')
    }
    return new Percentage(Math.min(this._value * factor, 100))
  }

  asDecimal() {
    return this._value / 100
  }

  toString() {
    return `${this._value.toFixed(2)}%`
  }
}

/**
 * Represents user confidence levels in the journey
 */
export class ConfidenceLevel {
  static BEGINNER = new ConfidenceLevel(1, 'Beginner', 'Just starting the journey')
  static LEARNING = new ConfidenceLevel(2, 'Learning', 'Building knowledge and confidence')
  static GROWING = new ConfidenceLevel(3, 'Growing', 'Actively engaging with investments')
  static EXPERT = new ConfidenceLevel(4, 'Expert', 'Advanced investor with full access')

  constructor(level, name, description) {
    if (typeof level !== 'number' || level < 1 || level > 4) {
      throw new Error('Confidence level must be between 1 and 4')
    }
    this._level = level
    this._name = name
    this._description = description
    Object.freeze(this)
  }

  get level() { return this._level }
  get name() { return this._name }
  get description() { return this._description }

  canAdvanceTo(nextLevel) {
    return nextLevel.level === this._level + 1
  }

  isHigherThan(otherLevel) {
    return this._level > otherLevel.level
  }

  getMascotType() {
    const mascots = ['aqua', 'verde', 'mystic', 'coral']
    return mascots[this._level - 1]
  }

  static fromLevel(level) {
    const levels = [
      ConfidenceLevel.BEGINNER,
      ConfidenceLevel.LEARNING, 
      ConfidenceLevel.GROWING,
      ConfidenceLevel.EXPERT
    ]
    return levels[level - 1] || ConfidenceLevel.BEGINNER
  }

  toString() {
    return `${this._name} (Level ${this._level})`
  }
}

/**
 * Represents different asset types available in the platform
 */
export class AssetType {
  static BITCOIN = new AssetType('BTC', 'Bitcoin', 'Digital gold standard cryptocurrency')
  static ETHEREUM = new AssetType('ETH', 'Ethereum', 'Smart contract platform cryptocurrency')
  static SOLANA = new AssetType('SOL', 'Solana', 'High-performance blockchain cryptocurrency')
  static SUI = new AssetType('SUI', 'Sui', 'Next-generation smart contract platform')
  static GOLD = new AssetType('GOLD', 'Gold', 'Gold holds its worth over time, keeping your savings safe')
  static STOCKS = new AssetType('STOCKS', 'Stocks', 'Buy a slice of a company and share in its growth')
  static DEFI = new AssetType('DEFI', 'DeFi', 'Put your crypto to work. Staking, lending and more')

  constructor(symbol, name, description) {
    this._symbol = symbol
    this._name = name
    this._description = description
    Object.freeze(this)
  }

  get symbol() { return this._symbol }
  get name() { return this._name }
  get description() { return this._description }

  isCryptocurrency() {
    return ['BTC', 'ETH', 'SOL', 'SUI'].includes(this._symbol)
  }

  isTraditionalAsset() {
    return ['GOLD', 'STOCKS'].includes(this._symbol)
  }

  isDeFiAsset() {
    return this._symbol === 'DEFI'
  }

  getDisplayColor() {
    const colors = {
      'BTC': '#f7931a',
      'ETH': '#627eea', 
      'SOL': '#9945ff',
      'SUI': '#6fbcf0',
      'GOLD': '#ffd700',
      'STOCKS': '#00d4aa',
      'DEFI': '#ff6b6b'
    }
    return colors[this._symbol] || '#333'
  }

  static getAllAssets() {
    return [
      AssetType.BITCOIN,
      AssetType.ETHEREUM,
      AssetType.SOLANA,
      AssetType.SUI,
      AssetType.GOLD,
      AssetType.STOCKS,
      AssetType.DEFI
    ]
  }

  static fromSymbol(symbol) {
    const assets = AssetType.getAllAssets()
    return assets.find(asset => asset.symbol === symbol.toUpperCase()) || null
  }

  toString() {
    return `${this._name} (${this._symbol})`
  }
}

/**
 * Represents user journey phases with mascot personalities
 */
export class UserPhase {
  static AQUA_PHASE = new UserPhase(1, 'aqua', 'Welcome & Discovery', 'Meet your AI guide and discover OneFi')
  static VERDE_PHASE = new UserPhase(2, 'verde', 'Learning & Growth', 'Build knowledge and start your investment journey')  
  static MYSTIC_PHASE = new UserPhase(3, 'mystic', 'Advanced Investing', 'Explore advanced strategies and diversification')
  static CORAL_PHASE = new UserPhase(4, 'coral', 'Wealth Optimization', 'Master wealth-building with full platform access')

  constructor(level, mascotName, title, description) {
    this._level = level
    this._mascotName = mascotName
    this._title = title
    this._description = description
    Object.freeze(this)
  }

  get level() { return this._level }
  get mascotName() { return this._mascotName }
  get title() { return this._title }
  get description() { return this._description }

  getNextPhase() {
    const phases = UserPhase.getAllPhases()
    return phases.find(phase => phase.level === this._level + 1) || null
  }

  getPreviousPhase() {
    const phases = UserPhase.getAllPhases()
    return phases.find(phase => phase.level === this._level - 1) || null
  }

  canAdvanceTo(targetPhase) {
    return targetPhase && targetPhase.level === this._level + 1
  }

  getMascotColor() {
    const colors = {
      'aqua': '#00d4aa',
      'verde': '#28a745', 
      'mystic': '#6f42c1',
      'coral': '#fd7e14'
    }
    return colors[this._mascotName] || '#333'
  }

  getAvailableAssets() {
    switch (this._level) {
      case 1: return [AssetType.BITCOIN] // Aqua: Start simple
      case 2: return [AssetType.BITCOIN, AssetType.GOLD] // Verde: Add stability
      case 3: return [AssetType.BITCOIN, AssetType.GOLD, AssetType.STOCKS] // Mystic: Diversify
      case 4: return AssetType.getAllAssets() // Coral: Full access
      default: return [AssetType.BITCOIN]
    }
  }

  static getAllPhases() {
    return [
      UserPhase.AQUA_PHASE,
      UserPhase.VERDE_PHASE,
      UserPhase.MYSTIC_PHASE,
      UserPhase.CORAL_PHASE
    ]
  }

  static fromLevel(level) {
    const phases = UserPhase.getAllPhases()
    return phases.find(phase => phase.level === level) || UserPhase.AQUA_PHASE
  }

  static fromMascotName(mascotName) {
    const phases = UserPhase.getAllPhases()
    return phases.find(phase => phase.mascotName === mascotName.toLowerCase()) || UserPhase.AQUA_PHASE
  }

  toString() {
    return `${this._title} - ${this._mascotName} (Phase ${this._level})`
  }
}