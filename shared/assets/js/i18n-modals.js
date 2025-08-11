/**
 * diBoaS Internationalized Modal Functions
 * Enhanced modal functions with i18n support
 */

'use strict';

/**
 * Show Asset information modal with i18n support
 */
function showAssetInfoI18n(asset) {
  // Get asset data using i18n system
  const getAssetData = (assetKey) => {
    if (!window.i18n || !window.i18n.t) {
      // Fallback data if i18n not available
      const fallbackData = {
        bitcoin: { name: 'Bitcoin', symbol: 'BTC', description: 'The world first cryptocurrency', pros: ['Trusted by millions'], cons: ['Higher fees'], goodFor: 'Beginners' },
        gold: { name: 'Gold', symbol: 'XAU', description: 'Timeless asset', pros: ['Store of value'], cons: ['Price fluctuation'], goodFor: 'Safe investors' },
        stocks: { name: 'Stocks', symbol: 'Stocks', description: 'Company ownership', pros: ['Growth potential'], cons: ['Market risk'], goodFor: 'Traditional investors' },
        defi: { name: 'DeFi', symbol: 'DeFi', description: 'Digital finance', pros: ['High returns'], cons: ['Higher risk'], goodFor: 'Advanced investors' }
      };
      return fallbackData[assetKey] || { name: assetKey, symbol: assetKey, description: '', pros: [], cons: [], goodFor: '' };
    }
    
    return {
      name: window.i18n.t(`asset.${assetKey}.name`),
      symbol: window.i18n.t(`asset.${assetKey}.symbol`),
      description: window.i18n.t(`asset.${assetKey}.description`),
      pros: [
        window.i18n.t(`asset.${assetKey}.pros.1`),
        window.i18n.t(`asset.${assetKey}.pros.2`),
        window.i18n.t(`asset.${assetKey}.pros.3`)
      ].filter(p => p && !p.startsWith('asset.')), // Filter out missing translations
      cons: [
        window.i18n.t(`asset.${assetKey}.cons.1`),
        window.i18n.t(`asset.${assetKey}.cons.2`)
      ].filter(c => c && !c.startsWith('asset.')), // Filter out missing translations
      goodFor: window.i18n.t(`asset.${assetKey}.good_for`)
    };
  };

  const data = getAssetData(asset);
  if (!data.name || data.name.startsWith('asset.')) return; // Asset not found or no translation

  const assetSymbols = {
    bitcoin: '₿',
    gold: 'ⓐu', 
    stocks: 'Ⓢ',
    defi: 'Ⓓ'
  };

  const t = window.i18n?.t || ((key) => key); // Fallback translation function

  const content = `
    <div class="asset-info">
      <button class="asset-close-btn" onclick="closeModal()" aria-label="${t('modal.close')}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div class="asset-info-header">
        <div class="asset-header">
          <div class="asset-icon">
            ${assetSymbols[asset] || data.symbol}
          </div>
          <h1 class="asset-title">${data.name}</h1>
          <p class="asset-subtitle">${data.symbol} • Digital Asset</p>
        </div>
      </div>
      
      <div class="asset-info-content">
        <div class="asset-description">
          ${data.description}
        </div>
        
        <div class="section-divider"></div>
        
        <div class="asset-features">
          <div class="feature-section advantages">
            <h4>${t('modal.advantages')}</h4>
            <ul>
              ${data.pros.map(pro => `<li>${pro}</li>`).join('')}
            </ul>
          </div>
          
          <div class="feature-section considerations">
            <h4>${t('modal.considerations')}</h4>
            <ul>
              ${data.cons.map(con => `<li>${con}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="asset-recommendation">
          <h4>${t('modal.good_for')}</h4>
          <p>${data.goodFor}</p>
        </div>
        
        <div class="asset-actions">
          <button class="asset-primary-btn" onclick="closeModal(); showAssetConfirmationI18n('${asset}')">
            ${t('modal.choose')} ${data.name}
          </button>
          <button class="asset-secondary-btn" onclick="closeModal()">
            ${t('modal.compare')}
          </button>
        </div>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `asset-modal-${asset}`,
    primaryAction: null, // We handle actions in the content
    secondaryAction: null
  });
}

/**
 * Show asset selection confirmation with personalized content (i18n version)
 */
function showAssetConfirmationI18n(asset) {
  const t = window.i18n?.t || ((key) => key); // Fallback translation function
  
  const assetData = {
    bitcoin: {
      name: t('asset.bitcoin.name'),
      message: t('confirmation.bitcoin.message'),
      mascotImage: './assets/images/aqua_mascot_pose1.png',
      themeColor: '#FF8F00',
      glowColor: 'rgba(255, 143, 0, 0.4)'
    },
    gold: {
      name: t('asset.gold.name'),
      message: t('confirmation.gold.message'),
      mascotImage: './assets/images/aqua_mascot_pose2.png',
      themeColor: '#FFC107',
      glowColor: 'rgba(255, 193, 7, 0.4)'
    },
    stocks: {
      name: t('asset.stocks.name'),
      message: t('confirmation.stocks.message'),
      mascotImage: './assets/images/aqua_mascot_pose3.png',
      themeColor: '#3F51B5',
      glowColor: 'rgba(63, 81, 181, 0.4)'
    },
    defi: {
      name: t('asset.defi.name'),
      message: t('confirmation.defi.message'),
      mascotImage: './assets/images/aqua_mascot_pose.png',
      themeColor: '#9575CD',
      glowColor: 'rgba(149, 117, 205, 0.4)'
    }
  };

  const data = assetData[asset];
  if (!data) return;

  const content = `
    <div class="asset-confirmation themed-${asset}">
      <div class="mascot-celebration">
        <div class="mascot-glow-wrapper">
          <img src="${data.mascotImage}" alt="Aqua helping with ${data.name} choice">
          <div class="themed-glow" style="background: radial-gradient(circle, ${data.glowColor} 0%, transparent 70%);"></div>
        </div>
      </div>
      
      <h2>${data.name}</h2>
      <p class="aqua-message">${data.message}</p>
      
      <div class="cta-section">
        <a href="./app/" class="themed-cta-button" style="background: ${data.themeColor};">
          ${t('modal.get_started_with')} ${data.name}
        </a>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `asset-modal-${asset}`,
    primaryAction: null, // We handle the action in the content
    secondaryAction: {
      text: t('modal.maybe_later'),
      action: () => {
        closeModal();
      }
    }
  });
}

/**
 * Show security information popup with i18n support
 */
function showSecurityInfoI18n(securityType) {
  const t = window.i18n?.t || ((key) => key); // Fallback translation function
  
  const securityData = {
    'bank-grade': {
      title: t('security.bank_grade.title'),
      description: t('security.bank_grade.description'),
      details: [
        t('security.bank_grade.detail.1'),
        t('security.bank_grade.detail.2'),
        t('security.bank_grade.detail.3'),
        t('security.bank_grade.detail.4'),
        t('security.bank_grade.detail.5')
      ],
      themeColor: '#4ECDC4'
    },
    'non-custodial': {
      title: t('security.non_custodial.title'),
      description: t('security.non_custodial.description'),
      details: [
        t('security.non_custodial.detail.1'),
        t('security.non_custodial.detail.2'),
        t('security.non_custodial.detail.3'),
        t('security.non_custodial.detail.4'),
        t('security.non_custodial.detail.5')
      ],
      themeColor: '#A8E6CF'
    },
    'regulated-compliance': {
      title: t('security.regulated.title'),
      description: t('security.regulated.description'),
      details: [
        t('security.regulated.detail.1'),
        t('security.regulated.detail.2'),
        t('security.regulated.detail.3'),
        t('security.regulated.detail.4'),
        t('security.regulated.detail.5')
      ],
      themeColor: '#B39DDB'
    }
  };

  const data = securityData[securityType];
  if (!data) return;

  const content = `
    <div class="security-info-modal">
      <div class="security-header">
        <div class="security-icon" style="color: ${data.themeColor};">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h2 style="color: ${data.themeColor};">${data.title}</h2>
      </div>
      
      <p class="security-description">${data.description}</p>
      
      <div class="security-details">
        <h3>${t('common.how_we_protect')}</h3>
        <ul class="security-list">
          ${data.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
      
      <div class="security-cta">
        <a href="./app/" class="security-cta-button" style="background: ${data.themeColor}; border-color: ${data.themeColor};">
          ${t('common.start_secure_journey')}
        </a>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `security-modal-${securityType}`,
    primaryAction: null, // We handle the action in the content
    secondaryAction: {
      text: t('modal.close'),
      action: () => {
        closeModal();
      }
    }
  });
}

/**
 * Show legal information popup with i18n support
 */
function showLegalInfoI18n(legalType) {
  const t = window.i18n?.t || ((key) => key); // Fallback translation function
  
  const legalData = {
    'privacy': {
      title: t('legal.privacy.title'),
      description: t('legal.privacy.description'),
      details: [
        t('legal.privacy.detail.1'),
        t('legal.privacy.detail.2'),
        t('legal.privacy.detail.3'),
        t('legal.privacy.detail.4'),
        t('legal.privacy.detail.5'),
        t('legal.privacy.detail.6')
      ],
      themeColor: '#4ECDC4'
    },
    'terms': {
      title: t('legal.terms.title'),
      description: t('legal.terms.description'),
      details: [
        t('legal.terms.detail.1'),
        t('legal.terms.detail.2'),
        t('legal.terms.detail.3'),
        t('legal.terms.detail.4'),
        t('legal.terms.detail.5'),
        t('legal.terms.detail.6')
      ],
      themeColor: '#A8E6CF'
    },
    'compliance': {
      title: t('legal.compliance.title'),
      description: t('legal.compliance.description'),
      details: [
        t('legal.compliance.detail.1'),
        t('legal.compliance.detail.2'),
        t('legal.compliance.detail.3'),
        t('legal.compliance.detail.4'),
        t('legal.compliance.detail.5'),
        t('legal.compliance.detail.6')
      ],
      themeColor: '#B39DDB'
    }
  };

  const data = legalData[legalType];
  if (!data) return;

  const content = `
    <div class="legal-info-modal">
      <div class="legal-header">
        <div class="legal-icon" style="color: ${data.themeColor};">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h2 style="color: ${data.themeColor};">${data.title}</h2>
      </div>
      
      <p class="legal-description">${data.description}</p>
      
      <div class="legal-details">
        <h3>${t('common.key_points')}</h3>
        <ul class="legal-list">
          ${data.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      </div>
      
      <div class="legal-note">
        <p><strong>${t('common.note')}</strong> ${t('common.legal_note').replace('{title}', data.title)}</p>
      </div>
      
      <div class="legal-cta">
        <a href="./app/" class="legal-cta-button" style="background: ${data.themeColor}; border-color: ${data.themeColor};">
          ${t('modal.continue_to')}
        </a>
      </div>
    </div>
  `;

  showModal(content, {
    customClass: `legal-modal-${legalType}`,
    primaryAction: null, // We handle the action in the content
    secondaryAction: {
      text: t('modal.close'),
      action: () => {
        closeModal();
      }
    }
  });
}

// Override the original functions to use i18n versions
if (typeof window !== 'undefined') {
  // Only override if i18n is available
  document.addEventListener('DOMContentLoaded', () => {
    if (window.i18n) {
      window.showAssetInfo = showAssetInfoI18n;
      window.showAssetConfirmation = showAssetConfirmationI18n;
      window.showSecurityInfo = showSecurityInfoI18n;
      window.showLegalInfo = showLegalInfoI18n;
    }
  });
}