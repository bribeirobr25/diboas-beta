/**
 * diBoaS Internationalization System
 * Lightweight i18n solution for multiple language support
 */

'use strict';

// Language data for diBoaS platform
const LANGUAGES = {
  'en': {
    name: 'English',
    code: 'en',
    flag: '🇺🇸',
    translations: {
      // Meta tags
      'meta.title': 'diBoaS - Grow Your Wealth with AI-Guide | BTC • Gold • Stocks • DeFi',
      'meta.description': 'Wealth-building made simple, secure and fun. All it takes is $10, 5 min and 1 click. Own crypto, gold, stocks and DeFi yield with zero fuss. Aqua, your AI guide, makes it simple. Start building wealth with just $10.',
      'meta.keywords': 'crypto, Bitcoin, Gold, Stock, DeFi, Ethereum, Solana, Sui, AI guide, crypto investing, beginner crypto, OneFi, decentralized finance, diBoaS',
      
      // Navigation
      'nav.documentation': 'Documentation',
      'nav.learn': 'Learn',
      'nav.mascots': 'Mascots',
      'nav.investors': 'Investors',
      'nav.get_started': 'Get Started',
      'nav.skip_to_content': 'Skip to main content',
      'nav.toggle_menu': 'Toggle navigation menu',
      'nav.cta_description': 'Start your wealth journey with Aqua\'s AI guidance',
      
      // Hero Section
      'hero.headline_primary': 'Grow Your Wealth with Aqua.',
      'hero.headline_highlight': 'Start with Just $10 in 5 min and 1 Click',
      'hero.headline_secondary': 'Start Small, Grow Big.',
      'hero.assets_heading': 'Available Assets',
      'hero.btc_name': 'Bitcoin',
      'hero.btc_badge': 'Digital Gold',
      'hero.btc_description': 'Bitcoin: The original cryptocurrency and digital store of value.',
      'hero.gold_name': 'Gold',
      'hero.gold_badge': 'Physical Bitcoin',
      'hero.gold_description': 'Gold: holds its worth over time, keeping your savings safe.',
      'hero.stocks_name': 'Stocks',
      'hero.stocks_badge': 'More Traditional',
      'hero.stocks_description': 'Stocks: Buy a slice of a company and share in its growth.',
      'hero.defi_name': 'DeFi',
      'hero.defi_badge': 'Passive Income',
      'hero.defi_description': 'DeFi: Put your crypto to work. Stake, lend and more',
      'hero.cta_start': 'Start Now',
      'hero.cta_description': 'Start your wealth journey with Aqua\'s AI guidance',
      
      // Mascot
      'mascot.aqua_greeting': 'Hi! I\'m Aqua, your AI guide. I\'ll help you in your wealth-building journey',
      
      // Asset Selection
      'selection.heading': 'Not Sure Which Option to Choose?',
      'selection.decision_matrix': 'Asset selection decision matrix',
      'selection.want_crypto': 'Want to try crypto?',
      'selection.prefer_safety': 'You prefer safety?',
      'selection.like_traditional': 'Like traditional finance?',
      'selection.want_multiply': 'Want to multiply your $?',
      'selection.btc_title': 'Bitcoin',
      'selection.btc_description': 'Store of value & digital gold standard',
      'selection.btc_cta': 'Start with BTC',
      'selection.gold_title': 'Gold',
      'selection.gold_description': 'Gold holds its worth over time, keeping your savings safe.',
      'selection.gold_cta': 'Choose Gold',
      'selection.stocks_title': 'Stocks',
      'selection.stocks_description': 'Buy a slice of a company and share in its growth.',
      'selection.stocks_cta': 'Buy Stocks',
      'selection.defi_title': 'DeFi',
      'selection.defi_description': 'Put your crypto to work. Stake, lend and more',
      'selection.defi_cta': 'Choose DeFi',
      'selection.aqua_guidance': 'Still not sure?<br>What about joining 50+ Million People owning Bitcoin!',
      'selection.start_bitcoin': 'Start with Bitcoin',
      
      // Trust Building
      'trust.heading': 'Why Start Your Wealth Journey with diBoaS?',
      'trust.education_title': 'Education-First Approach',
      'trust.education_description': 'Aqua\'s AI make finance simple. No pressure, just education.',
      'trust.small_start_title': 'Start Small, Grow Big',
      'trust.small_start_description': '$10 minimum removes big-money pressure. Build confidence with small steps.',
      'trust.transparency_title': 'Secure and Transparent',
      'trust.transparency_description': 'diBoaS uses top security and is 100% transparent. No hidden costs or surprises.',
      'trust.support_title': 'AI Guides always available',
      'trust.support_description': 'Your AI guides provide support at every step. Never feel confused or alone.',
      'trust.security_heading': 'Security and compliance features',
      'trust.bank_grade': 'Bank-Grade Security',
      'trust.non_custodial': 'Non-Custodial',
      'trust.regulated': 'Regulated Compliance',
      
      // Final CTA
      'final_cta.heading': 'Ready to Start Your Financial Journey?',
      'final_cta.subtext': 'Join diBoas today. It is simple, fast, fun and secure!',
      'final_cta.get_started': 'Get Started',
      'final_cta.learn_more': 'Learn More First',
      'final_cta.assurance': '1-Click • Bank-grade security • Aqua\'s AI guide',
      
      // Footer
      'footer.tagline': 'Your Journey to Wealth Begins with Endless Possibilities',
      'footer.journey_phase': 'Foundation Phase • Guided by Aqua',
      'footer.platform': 'Platform',
      'footer.company': 'Company',
      'footer.support': 'Support',
      'footer.legal': 'Legal',
      'footer.about': 'About Us',
      'footer.careers': 'Careers',
      'footer.faqs': 'FAQs',
      'footer.community': 'Community Help',
      'footer.contact': 'Contact',
      'footer.security': 'Security',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.compliance': 'Compliance',
      'footer.copyright': '© 2025 diBoaS. All rights reserved.',
      'footer.disclaimer': 'Investing involve risk. Not financial advice. Do your own research.',
      'footer.social_twitter': 'Follow diBoaS on Twitter',
      'footer.social_linkedin': 'Follow diBoaS on LinkedIn',
      
      // Language selector
      'lang.select': 'Select Language',
      'lang.current': 'Current: English',
      
      // Asset Information Modals
      'asset.bitcoin.name': 'Bitcoin',
      'asset.bitcoin.symbol': 'BTC',
      'asset.bitcoin.description': 'The world first cryptocurrency, like digital gold you can own and trade easily.',
      'asset.bitcoin.pros.1': 'Trusted by millions, from startups to global brands',
      'asset.bitcoin.pros.2': 'Only 21 million coins – a rare asset that grows in value',
      'asset.bitcoin.pros.3': 'Pay anywhere, from online shops to real-world stores',
      'asset.bitcoin.cons.1': 'Fees can be higher for small transactions',
      'asset.bitcoin.cons.2': 'Transfers may take a few minutes',
      'asset.bitcoin.good_for': 'Investors wanting a trusted, long-term asset and Beginners starting their crypto journey',
      
      'asset.gold.name': 'Gold',
      'asset.gold.symbol': 'XAU',
      'asset.gold.description': 'A timeless asset you can own, like a golden safety net for your wealth',
      'asset.gold.pros.1': 'Trusted for centuries as a store of value',
      'asset.gold.pros.2': 'Protects your wealth during economic uncertainty',
      'asset.gold.pros.3': 'Easy to buy and hold with Aqua\'s AI guidance',
      'asset.gold.cons.1': 'Prices can fluctuate with market trends',
      'asset.gold.cons.2': 'No income like dividends or staking',
      'asset.gold.good_for': 'Investors seeking a safe, long-term way to preserve wealth.',
      
      'asset.stocks.name': 'Stocks',
      'asset.stocks.symbol': 'Stocks',
      'asset.stocks.description': 'Own a piece of top companies and easily diversify your investment',
      'asset.stocks.pros.1': 'Invest in brands you know, like Apple or Tesla',
      'asset.stocks.pros.2': 'Potential for growth and dividend income',
      'asset.stocks.pros.3': 'Diversify easily',
      'asset.stocks.cons.1': 'Prices can vary with market ups and downs',
      'asset.stocks.cons.2': 'Requires some research to pick winners',
      'asset.stocks.good_for': 'Investors wanting to grow wealth with familiar companies or diversify their portfolio.',
      
      'asset.defi.name': 'DeFi',
      'asset.defi.symbol': 'DeFi',
      'asset.defi.description': 'A new way to grow money through digital finance, powered by blockchain technology and crypto',
      'asset.defi.pros.1': 'Earn high returns through lending, staking and more',
      'asset.defi.pros.2': 'Access cutting-edge finance apps and tools',
      'asset.defi.pros.3': 'Take control with decentralized investments',
      'asset.defi.cons.1': 'Higher risk due to new technology and smart contract issues',
      'asset.defi.cons.2': 'Can be complex without proper guidance',
      'asset.defi.good_for': 'Adventurous investors eager to explore digital finance and high-growth opportunities.',
      
      // Modal Actions
      'modal.close': 'Close',
      'modal.choose': 'Choose',
      'modal.compare': 'Compare Others',
      'modal.advantages': 'Advantages',
      'modal.considerations': 'Considerations',
      'modal.good_for': 'Good For',
      'modal.maybe_later': 'Maybe Later',
      'modal.get_started_with': 'Get Started with',
      'modal.continue_to': 'Continue to diBoaS',
      
      // Asset Confirmation Messages
      'confirmation.bitcoin.message': 'Oh you want to join the 50+ million people owning BTC. I can help you. Got 5 mins for a quick and secure signup?',
      'confirmation.gold.message': 'You want safety. I get that! Gold has been around for centuries. Let me help you to protect your wealth. First you need 5 mins for a quick and secure signup.',
      'confirmation.stocks.message': 'I see you are more into traditional finance. That is fine! I guess you already have a company in mind you would like to buy a share. We can make it happen by creating your account in just 2 mins.',
      'confirmation.defi.message': 'Wow you are really All-in. Awesome! We just need to create your account, it only takes a minute.',
      
      // Security Information
      'security.bank_grade.title': 'Bank-Grade Security',
      'security.bank_grade.description': 'Your wealth is protected with military-grade encryption and the same security standards used by major financial institutions.',
      'security.bank_grade.detail.1': 'Military-grade encryption safeguards all your data and transactions',
      'security.bank_grade.detail.2': 'Multi-layered security protocols protect against unauthorized access',
      'security.bank_grade.detail.3': 'Regular security audits by independent cybersecurity firms',
      'security.bank_grade.detail.4': 'Advanced authentication systems including 2FA protection',
      'security.bank_grade.detail.5': 'Compliance with international security standards and regulations',
      
      'security.non_custodial.title': 'Non-Custodial Control',
      'security.non_custodial.description': 'You always maintain complete ownership and control of your assets. diBoaS never holds or touches your funds.',
      'security.non_custodial.detail.1': 'You own your private keys and maintain full control of your assets',
      'security.non_custodial.detail.2': 'diBoaS cannot access, freeze, or confiscate your investments',
      'security.non_custodial.detail.3': 'Your funds remain secure even if diBoaS ceases operations',
      'security.non_custodial.detail.4': 'Non-custody wallets automatically created behind the scenes',
      'security.non_custodial.detail.5': 'Complete transparency - you can verify your ownership at any time',
      
      'security.regulated.title': 'Regulated Compliance',
      'security.regulated.description': 'Fully regulated and compliant across multiple jurisdictions to ensure your investments meet the highest legal standards.',
      'security.regulated.detail.1': 'EU MiCA regulation compliance for European operations',
      'security.regulated.detail.2': 'US BSA and state money transmitter licenses',
      'security.regulated.detail.3': 'Brazil Law 14.478 compliance with Central Bank coordination',
      'security.regulated.detail.4': 'Transparent fee structure with no hidden costs (0.09% trading, 0.9% transfers)',
      'security.regulated.detail.5': 'Regular compliance audits and regulatory reporting',
      
      // Legal Information
      'legal.privacy.title': 'Privacy Policy',
      'legal.privacy.description': 'Your privacy is our top priority. We protect your personal information with the highest standards of data security and transparency.',
      'legal.privacy.detail.1': 'We collect only essential information required for platform functionality',
      'legal.privacy.detail.2': 'Your personal data is encrypted and stored securely in compliance with GDPR',
      'legal.privacy.detail.3': 'We never sell, rent, or share your personal information with third parties',
      'legal.privacy.detail.4': 'You maintain full control over your data and can request deletion at any time',
      'legal.privacy.detail.5': 'All data processing activities are logged and auditable for transparency',
      'legal.privacy.detail.6': 'We use industry-standard security measures to protect against data breaches',
      
      'legal.terms.title': 'Terms of Service',
      'legal.terms.description': 'Clear, fair terms that protect both you and diBoaS. We believe in transparency and user-friendly policies that you can actually understand.',
      'legal.terms.detail.1': 'Non-custodial service - you always maintain control of your assets',
      'legal.terms.detail.2': 'Transparent fee structure: 0.09% trading, 0.9% transfers, no hidden costs',
      'legal.terms.detail.3': 'Educational guidance only - we provide information, not financial advice',
      'legal.terms.detail.4': 'You are responsible for your investment decisions and risk management',
      'legal.terms.detail.5': 'Platform availability may vary by jurisdiction due to regulatory requirements',
      'legal.terms.detail.6': 'Account security is a shared responsibility between you and diBoaS',
      
      'legal.compliance.title': 'Regulatory Compliance',
      'legal.compliance.description': 'diBoaS operates under strict regulatory oversight across multiple jurisdictions to ensure the highest standards of financial compliance.',
      'legal.compliance.detail.1': 'EU MiCA regulation compliance for all European Union operations',
      'legal.compliance.detail.2': 'US Bank Secrecy Act (BSA) compliance and state money transmitter licenses',
      'legal.compliance.detail.3': 'Brazil Law 14.478 compliance with Central Bank of Brazil coordination',
      'legal.compliance.detail.4': 'Anti-Money Laundering (AML) and Know Your Customer (KYC) procedures',
      'legal.compliance.detail.5': 'Regular compliance audits by independent third-party firms',
      'legal.compliance.detail.6': 'Ongoing regulatory reporting and transparent fee disclosure requirements',
      
      // Common Modal Elements
      'common.how_we_protect': 'How We Protect You:',
      'common.key_points': 'Key Points:',
      'common.note': 'Note:',
      'common.legal_note': 'This is a summary of our {title}. For complete legal text and detailed terms, please contact us at legal@diboas.com',
      'common.start_secure_journey': 'Start Your Secure Journey'
    }
  },
  'es': {
    name: 'Español',
    code: 'es',
    flag: '🇪🇸',
    translations: {
      // Meta tags
      'meta.title': 'diBoaS - Haz Crecer tu Patrimonio con Guía IA | BTC • Oro • Acciones • DeFi',
      'meta.description': 'Construir patrimonio hecho simple, seguro y divertido. Solo se necesitan $10, 5 minutos y 1 clic. Posee crypto, oro, acciones y rendimiento DeFi sin complicaciones. Aqua, tu guía IA, lo hace simple. Comienza a construir patrimonio con solo $10.',
      'meta.keywords': 'crypto, Bitcoin, Oro, Acciones, DeFi, Ethereum, Solana, Sui, guía IA, inversión crypto, crypto principiante, OneFi, finanzas descentralizadas, diBoaS',
      
      // Navigation
      'nav.documentation': 'Documentación',
      'nav.learn': 'Aprender',
      'nav.mascots': 'Mascotas',
      'nav.investors': 'Inversores',
      'nav.get_started': 'Comenzar',
      'nav.skip_to_content': 'Saltar al contenido principal',
      'nav.toggle_menu': 'Alternar menú de navegación',
      'nav.cta_description': 'Comienza tu viaje de riqueza con la guía IA de Aqua',
      
      // Hero Section
      'hero.headline_primary': 'Haz Crecer tu Patrimonio con Aqua.',
      'hero.headline_highlight': 'Comienza con Solo $10 en 5 min y 1 Clic',
      'hero.headline_secondary': 'Comienza Pequeño, Crece Grande.',
      'hero.assets_heading': 'Activos Disponibles',
      'hero.btc_name': 'Bitcoin',
      'hero.btc_badge': 'Oro Digital',
      'hero.btc_description': 'Bitcoin: La criptomoneda original y reserva de valor digital.',
      'hero.gold_name': 'Oro',
      'hero.gold_badge': 'Bitcoin Físico',
      'hero.gold_description': 'Oro: mantiene su valor a lo largo del tiempo, manteniendo tus ahorros seguros.',
      'hero.stocks_name': 'Acciones',
      'hero.stocks_badge': 'Más Tradicional',
      'hero.stocks_description': 'Acciones: Compra una parte de una empresa y comparte su crecimiento.',
      'hero.defi_name': 'DeFi',
      'hero.defi_badge': 'Ingresos Pasivos',
      'hero.defi_description': 'DeFi: Pon tu crypto a trabajar. Stake, presta y más',
      'hero.cta_start': 'Comenzar Ahora',
      'hero.cta_description': 'Comienza tu viaje de riqueza con la guía IA de Aqua',
      
      // Mascot
      'mascot.aqua_greeting': '¡Hola! Soy Aqua, tu guía IA. Te ayudaré en tu viaje de construcción de patrimonio',
      
      // Asset Selection
      'selection.heading': '¿No Estás Seguro Qué Opción Elegir?',
      'selection.decision_matrix': 'Matriz de decisión de selección de activos',
      'selection.want_crypto': '¿Quieres probar crypto?',
      'selection.prefer_safety': '¿Prefieres seguridad?',
      'selection.like_traditional': '¿Te gustan las finanzas tradicionales?',
      'selection.want_multiply': '¿Quieres multiplicar tu $?',
      'selection.btc_title': 'Bitcoin',
      'selection.btc_description': 'Reserva de valor y estándar de oro digital',
      'selection.btc_cta': 'Comenzar con BTC',
      'selection.gold_title': 'Oro',
      'selection.gold_description': 'El oro mantiene su valor a lo largo del tiempo, manteniendo tus ahorros seguros.',
      'selection.gold_cta': 'Elegir Oro',
      'selection.stocks_title': 'Acciones',
      'selection.stocks_description': 'Compra una parte de una empresa y comparte su crecimiento.',
      'selection.stocks_cta': 'Comprar Acciones',
      'selection.defi_title': 'DeFi',
      'selection.defi_description': 'Pon tu crypto a trabajar. Stake, presta y más',
      'selection.defi_cta': 'Elegir DeFi',
      'selection.aqua_guidance': '¿Aún no estás seguro?<br>¡Qué tal unirte a más de 50 millones de personas que poseen Bitcoin!',
      'selection.start_bitcoin': 'Comenzar con Bitcoin',
      
      // Trust Building
      'trust.heading': '¿Por Qué Comenzar tu Viaje de Patrimonio con diBoaS?',
      'trust.education_title': 'Enfoque Educativo Primero',
      'trust.education_description': 'La IA de Aqua hace las finanzas simples. Sin presión, solo educación.',
      'trust.small_start_title': 'Comienza Pequeño, Crece Grande',
      'trust.small_start_description': 'El mínimo de $10 elimina la presión del dinero grande. Construye confianza con pasos pequeños.',
      'trust.transparency_title': 'Seguro y Transparente',
      'trust.transparency_description': 'diBoaS usa la mejor seguridad y es 100% transparente. Sin costos ocultos o sorpresas.',
      'trust.support_title': 'Guías IA siempre disponibles',
      'trust.support_description': 'Tus guías IA brindan apoyo en cada paso. Nunca te sientas confundido o solo.',
      'trust.security_heading': 'Características de seguridad y cumplimiento',
      'trust.bank_grade': 'Seguridad de Grado Bancario',
      'trust.non_custodial': 'No Custodial',
      'trust.regulated': 'Cumplimiento Regulado',
      
      // Final CTA
      'final_cta.heading': '¿Listo para Comenzar tu Viaje Financiero?',
      'final_cta.subtext': '¡Únete a diBoaS hoy. Es simple, rápido, divertido y seguro!',
      'final_cta.get_started': 'Comenzar',
      'final_cta.learn_more': 'Aprender Más Primero',
      'final_cta.assurance': '1-Clic • Seguridad de grado bancario • Guía IA de Aqua',
      
      // Footer
      'footer.tagline': 'Tu Viaje hacia la Riqueza Comienza con Posibilidades Infinitas',
      'footer.journey_phase': 'Fase Fundacional • Guiado por Aqua',
      'footer.platform': 'Plataforma',
      'footer.company': 'Empresa',
      'footer.support': 'Soporte',
      'footer.legal': 'Legal',
      'footer.about': 'Acerca de',
      'footer.careers': 'Carreras',
      'footer.faqs': 'Preguntas Frecuentes',
      'footer.community': 'Ayuda Comunitaria',
      'footer.contact': 'Contacto',
      'footer.security': 'Seguridad',
      'footer.privacy': 'Política de Privacidad',
      'footer.terms': 'Términos de Servicio',
      'footer.compliance': 'Cumplimiento',
      'footer.copyright': '© 2025 diBoaS. Todos los derechos reservados.',
      'footer.disclaimer': 'Invertir implica riesgo. No es consejo financiero. Investiga por tu cuenta.',
      'footer.social_twitter': 'Seguir diBoaS en Twitter',
      'footer.social_linkedin': 'Seguir diBoaS en LinkedIn',
      
      // Language selector
      'lang.select': 'Seleccionar Idioma',
      'lang.current': 'Actual: Español',
      
      // Asset Information Modals
      'asset.bitcoin.name': 'Bitcoin',
      'asset.bitcoin.symbol': 'BTC',
      'asset.bitcoin.description': 'La primera criptomoneda del mundo, como oro digital que puedes poseer y comerciar fácilmente.',
      'asset.bitcoin.pros.1': 'Confiado por millones, desde startups hasta marcas globales',
      'asset.bitcoin.pros.2': 'Solo 21 millones de monedas – un activo raro que crece en valor',
      'asset.bitcoin.pros.3': 'Paga en cualquier lugar, desde tiendas online hasta tiendas reales',
      'asset.bitcoin.cons.1': 'Las tarifas pueden ser más altas para transacciones pequeñas',
      'asset.bitcoin.cons.2': 'Las transferencias pueden tomar unos minutos',
      'asset.bitcoin.good_for': 'Inversores que quieren un activo confiable a largo plazo y principiantes comenzando su viaje crypto',
      
      'asset.gold.name': 'Oro',
      'asset.gold.symbol': 'XAU',
      'asset.gold.description': 'Un activo atemporal que puedes poseer, como una red de seguridad dorada para tu riqueza',
      'asset.gold.pros.1': 'Confiado durante siglos como reserva de valor',
      'asset.gold.pros.2': 'Protege tu riqueza durante incertidumbre económica',
      'asset.gold.pros.3': 'Fácil de comprar y mantener con la guía IA de Aqua',
      'asset.gold.cons.1': 'Los precios pueden fluctuar con las tendencias del mercado',
      'asset.gold.cons.2': 'Sin ingresos como dividendos o staking',
      'asset.gold.good_for': 'Inversores que buscan una forma segura y a largo plazo de preservar la riqueza.',
      
      'asset.stocks.name': 'Acciones',
      'asset.stocks.symbol': 'Acciones',
      'asset.stocks.description': 'Posee una parte de las mejores empresas y diversifica fácilmente tu inversión',
      'asset.stocks.pros.1': 'Invierte en marcas que conoces, como Apple o Tesla',
      'asset.stocks.pros.2': 'Potencial de crecimiento e ingresos por dividendos',
      'asset.stocks.pros.3': 'Diversifica fácilmente',
      'asset.stocks.cons.1': 'Los precios pueden variar con altibajos del mercado',
      'asset.stocks.cons.2': 'Requiere algo de investigación para elegir ganadores',
      'asset.stocks.good_for': 'Inversores que quieren hacer crecer la riqueza con empresas familiares o diversificar su cartera.',
      
      'asset.defi.name': 'DeFi',
      'asset.defi.symbol': 'DeFi',
      'asset.defi.description': 'Una nueva forma de hacer crecer el dinero a través de finanzas digitales, impulsada por tecnología blockchain y crypto',
      'asset.defi.pros.1': 'Gana altos rendimientos a través de préstamos, staking y más',
      'asset.defi.pros.2': 'Acceso a aplicaciones y herramientas financieras de vanguardia',
      'asset.defi.pros.3': 'Toma control con inversiones descentralizadas',
      'asset.defi.cons.1': 'Mayor riesgo debido a nueva tecnología y problemas de contratos inteligentes',
      'asset.defi.cons.2': 'Puede ser complejo sin orientación adecuada',
      'asset.defi.good_for': 'Inversores aventureros ansiosos por explorar finanzas digitales y oportunidades de alto crecimiento.',
      
      // Modal Actions
      'modal.close': 'Cerrar',
      'modal.choose': 'Elegir',
      'modal.compare': 'Comparar Otros',
      'modal.advantages': 'Ventajas',
      'modal.considerations': 'Consideraciones',
      'modal.good_for': 'Bueno Para',
      'modal.maybe_later': 'Tal vez Más Tarde',
      'modal.get_started_with': 'Comenzar con',
      'modal.continue_to': 'Continuar a diBoaS',
      
      // Asset Confirmation Messages
      'confirmation.bitcoin.message': 'Oh, quieres unirte a los 50+ millones de personas que poseen BTC. Puedo ayudarte. ¿Tienes 5 minutos para un registro rápido y seguro?',
      'confirmation.gold.message': 'Quieres seguridad. ¡Lo entiendo! El oro ha existido durante siglos. Déjame ayudarte a proteger tu riqueza. Primero necesitas 5 minutos para un registro rápido y seguro.',
      'confirmation.stocks.message': 'Veo que prefieres las finanzas tradicionales. ¡Está bien! Supongo que ya tienes una empresa en mente de la que te gustaría comprar una acción. Podemos hacerlo realidad creando tu cuenta en solo 2 minutos.',
      'confirmation.defi.message': 'Wow, realmente estás All-in. ¡Increíble! Solo necesitamos crear tu cuenta, solo toma un minuto.',
      
      // Security Information
      'security.bank_grade.title': 'Seguridad de Grado Bancario',
      'security.bank_grade.description': 'Tu riqueza está protegida con encriptación de grado militar y los mismos estándares de seguridad utilizados por las principales instituciones financieras.',
      'security.bank_grade.detail.1': 'Encriptación de grado militar protege todos tus datos y transacciones',
      'security.bank_grade.detail.2': 'Protocolos de seguridad multicapa protegen contra acceso no autorizado',
      'security.bank_grade.detail.3': 'Auditorías de seguridad regulares por firmas independientes de ciberseguridad',
      'security.bank_grade.detail.4': 'Sistemas de autenticación avanzados incluyendo protección 2FA',
      'security.bank_grade.detail.5': 'Cumplimiento con estándares y regulaciones de seguridad internacionales',
      
      'security.non_custodial.title': 'Control No Custodial',
      'security.non_custodial.description': 'Siempre mantienes propiedad y control completo de tus activos. diBoaS nunca retiene o toca tus fondos.',
      'security.non_custodial.detail.1': 'Posees tus llaves privadas y mantienes control total de tus activos',
      'security.non_custodial.detail.2': 'diBoaS no puede acceder, congelar o confiscar tus inversiones',
      'security.non_custodial.detail.3': 'Tus fondos permanecen seguros incluso si diBoaS cesa operaciones',
      'security.non_custodial.detail.4': 'Wallets no custodiales creadas automáticamente en segundo plano',
      'security.non_custodial.detail.5': 'Transparencia completa - puedes verificar tu propiedad en cualquier momento',
      
      'security.regulated.title': 'Cumplimiento Regulado',
      'security.regulated.description': 'Completamente regulado y conforme en múltiples jurisdicciones para asegurar que tus inversiones cumplan los más altos estándares legales.',
      'security.regulated.detail.1': 'Cumplimiento de regulación EU MiCA para operaciones europeas',
      'security.regulated.detail.2': 'Licencias BSA de EE.UU. y de transmisión de dinero estatal',
      'security.regulated.detail.3': 'Cumplimiento de Ley Brasil 14.478 con coordinación del Banco Central',
      'security.regulated.detail.4': 'Estructura de tarifas transparente sin costos ocultos (0.09% comercio, 0.9% transferencias)',
      'security.regulated.detail.5': 'Auditorías de cumplimiento regulares y reportes regulatorios',
      
      // Legal Information
      'legal.privacy.title': 'Política de Privacidad',
      'legal.privacy.description': 'Tu privacidad es nuestra máxima prioridad. Protegemos tu información personal con los más altos estándares de seguridad de datos y transparencia.',
      'legal.privacy.detail.1': 'Solo recopilamos información esencial requerida para la funcionalidad de la plataforma',
      'legal.privacy.detail.2': 'Tus datos personales son encriptados y almacenados de forma segura en cumplimiento con GDPR',
      'legal.privacy.detail.3': 'Nunca vendemos, alquilamos o compartimos tu información personal con terceros',
      'legal.privacy.detail.4': 'Mantienes control total sobre tus datos y puedes solicitar eliminación en cualquier momento',
      'legal.privacy.detail.5': 'Todas las actividades de procesamiento de datos son registradas y auditables para transparencia',
      'legal.privacy.detail.6': 'Usamos medidas de seguridad estándar de la industria para proteger contra violaciones de datos',
      
      'legal.terms.title': 'Términos de Servicio',
      'legal.terms.description': 'Términos claros y justos que protegen tanto a ti como a diBoaS. Creemos en transparencia y políticas amigables al usuario que realmente puedes entender.',
      'legal.terms.detail.1': 'Servicio no custodial - siempre mantienes control de tus activos',
      'legal.terms.detail.2': 'Estructura de tarifas transparente: 0.09% comercio, 0.9% transferencias, sin costos ocultos',
      'legal.terms.detail.3': 'Solo orientación educativa - proporcionamos información, no asesoramiento financiero',
      'legal.terms.detail.4': 'Eres responsable de tus decisiones de inversión y gestión de riesgo',
      'legal.terms.detail.5': 'La disponibilidad de la plataforma puede variar por jurisdicción debido a requisitos regulatorios',
      'legal.terms.detail.6': 'La seguridad de la cuenta es responsabilidad compartida entre tú y diBoaS',
      
      'legal.compliance.title': 'Cumplimiento Regulatorio',
      'legal.compliance.description': 'diBoaS opera bajo supervisión regulatoria estricta en múltiples jurisdicciones para asegurar los más altos estándares de cumplimiento financiero.',
      'legal.compliance.detail.1': 'Cumplimiento de regulación EU MiCA para todas las operaciones de la Unión Europea',
      'legal.compliance.detail.2': 'Cumplimiento de Ley de Secreto Bancario (BSA) de EE.UU. y licencias estatales de transmisión de dinero',
      'legal.compliance.detail.3': 'Cumplimiento de Ley Brasil 14.478 con coordinación del Banco Central de Brasil',
      'legal.compliance.detail.4': 'Procedimientos Anti-Lavado de Dinero (AML) y Conoce a Tu Cliente (KYC)',
      'legal.compliance.detail.5': 'Auditorías de cumplimiento regulares por firmas independientes de terceros',
      'legal.compliance.detail.6': 'Reportes regulatorios continuos y requisitos de divulgación de tarifas transparentes',
      
      // Common Modal Elements
      'common.how_we_protect': 'Cómo Te Protegemos:',
      'common.key_points': 'Puntos Clave:',
      'common.note': 'Nota:',
      'common.legal_note': 'Este es un resumen de nuestra {title}. Para el texto legal completo y términos detallados, contáctanos en legal@diboas.com',
      'common.start_secure_journey': 'Comienza Tu Viaje Seguro'
    }
  },
  'pt': {
    name: 'Português',
    code: 'pt',
    flag: '🇧🇷',
    translations: {
      // Meta tags
      'meta.title': 'diBoaS - Faça Crescer seu Patrimônio com Guia IA | BTC • Ouro • Ações • DeFi',
      'meta.description': 'Construção de patrimônio feita simples, segura e divertida. Precisa apenas de $10, 5 min e 1 clique. Possua crypto, ouro, ações e rendimento DeFi sem complicações. Aqua, seu guia IA, torna simples. Comece a construir patrimônio com apenas $10.',
      'meta.keywords': 'crypto, Bitcoin, Ouro, Ações, DeFi, Ethereum, Solana, Sui, guia IA, investimento crypto, crypto iniciante, OneFi, finanças descentralizadas, diBoaS',
      
      // Navigation
      'nav.documentation': 'Documentação',
      'nav.learn': 'Aprender',
      'nav.mascots': 'Mascotas',
      'nav.investors': 'Investidores',
      'nav.get_started': 'Começar',
      'nav.skip_to_content': 'Pular para o conteúdo principal',
      'nav.toggle_menu': 'Alternar menu de navegação',
      'nav.cta_description': 'Comece sua jornada de riqueza com a orientação IA da Aqua',
      
      // Hero Section
      'hero.headline_primary': 'Faça Crescer seu Patrimônio com Aqua.',
      'hero.headline_highlight': 'Comece com Apenas $10 em 5 min e 1 Clique',
      'hero.headline_secondary': 'Comece Pequeno, Cresça Grande.',
      'hero.assets_heading': 'Ativos Disponíveis',
      'hero.btc_name': 'Bitcoin',
      'hero.btc_badge': 'Ouro Digital',
      'hero.btc_description': 'Bitcoin: A criptomoeda original e reserva de valor digital.',
      'hero.gold_name': 'Ouro',
      'hero.gold_badge': 'Bitcoin Físico',
      'hero.gold_description': 'Ouro: mantém seu valor ao longo do tempo, mantendo suas economias seguras.',
      'hero.stocks_name': 'Ações',
      'hero.stocks_badge': 'Mais Tradicional',
      'hero.stocks_description': 'Ações: Compre uma fatia de uma empresa e compartilhe seu crescimento.',
      'hero.defi_name': 'DeFi',
      'hero.defi_badge': 'Renda Passiva',
      'hero.defi_description': 'DeFi: Coloque sua crypto para trabalhar. Stake, empreste e mais',
      'hero.cta_start': 'Começar Agora',
      'hero.cta_description': 'Comece sua jornada de riqueza com a orientação IA da Aqua',
      
      // Mascot
      'mascot.aqua_greeting': 'Oi! Eu sou Aqua, seu guia IA. Vou te ajudar em sua jornada de construção de patrimônio',
      
      // Asset Selection
      'selection.heading': 'Não Tem Certeza de Qual Opção Escolher?',
      'selection.decision_matrix': 'Matriz de decisão de seleção de ativos',
      'selection.want_crypto': 'Quer tentar crypto?',
      'selection.prefer_safety': 'Prefere segurança?',
      'selection.like_traditional': 'Gosta de finanças tradicionais?',
      'selection.want_multiply': 'Quer multiplicar seu $?',
      'selection.btc_title': 'Bitcoin',
      'selection.btc_description': 'Reserva de valor e padrão ouro digital',
      'selection.btc_cta': 'Começar com BTC',
      'selection.gold_title': 'Ouro',
      'selection.gold_description': 'O ouro mantém seu valor ao longo do tempo, mantendo suas economias seguras.',
      'selection.gold_cta': 'Escolher Ouro',
      'selection.stocks_title': 'Ações',
      'selection.stocks_description': 'Compre uma fatia de uma empresa e compartilhe seu crescimento.',
      'selection.stocks_cta': 'Comprar Ações',
      'selection.defi_title': 'DeFi',
      'selection.defi_description': 'Coloque sua crypto para trabalhar. Stake, empreste e mais',
      'selection.defi_cta': 'Escolher DeFi',
      'selection.aqua_guidance': 'Ainda não tem certeza?<br>Que tal se juntar a mais de 50 milhões de pessoas que possuem Bitcoin!',
      'selection.start_bitcoin': 'Começar com Bitcoin',
      
      // Trust Building
      'trust.heading': 'Por Que Começar sua Jornada de Patrimônio com diBoaS?',
      'trust.education_title': 'Abordagem Educação Primeiro',
      'trust.education_description': 'A IA da Aqua torna as finanças simples. Sem pressão, apenas educação.',
      'trust.small_start_title': 'Comece Pequeno, Cresça Grande',
      'trust.small_start_description': 'O mínimo de $10 remove a pressão do dinheiro grande. Construa confiança com pequenos passos.',
      'trust.transparency_title': 'Seguro e Transparente',
      'trust.transparency_description': 'diBoaS usa a melhor segurança e é 100% transparente. Sem custos ocultos ou surpresas.',
      'trust.support_title': 'Guias IA sempre disponíveis',
      'trust.support_description': 'Seus guias IA fornecem suporte a cada passo. Nunca se sinta confuso ou sozinho.',
      'trust.security_heading': 'Recursos de segurança e conformidade',
      'trust.bank_grade': 'Segurança de Grau Bancário',
      'trust.non_custodial': 'Não Custodial',
      'trust.regulated': 'Conformidade Regulamentada',
      
      // Final CTA
      'final_cta.heading': 'Pronto para Começar sua Jornada Financeira?',
      'final_cta.subtext': 'Junte-se ao diBoaS hoje. É simples, rápido, divertido e seguro!',
      'final_cta.get_started': 'Começar',
      'final_cta.learn_more': 'Aprender Mais Primeiro',
      'final_cta.assurance': '1-Clique • Segurança de grau bancário • Guia IA da Aqua',
      
      // Footer
      'footer.tagline': 'Sua Jornada para a Riqueza Começa com Possibilidades Infinitas',
      'footer.journey_phase': 'Fase Fundacional • Guiado por Aqua',
      'footer.platform': 'Plataforma',
      'footer.company': 'Empresa',
      'footer.support': 'Suporte',
      'footer.legal': 'Legal',
      'footer.about': 'Sobre Nós',
      'footer.careers': 'Carreiras',
      'footer.faqs': 'Perguntas Frequentes',
      'footer.community': 'Ajuda da Comunidade',
      'footer.contact': 'Contato',
      'footer.security': 'Segurança',
      'footer.privacy': 'Política de Privacidade',
      'footer.terms': 'Termos de Serviço',
      'footer.compliance': 'Conformidade',
      'footer.copyright': '© 2025 diBoaS. Todos os direitos reservados.',
      'footer.disclaimer': 'Investir envolve risco. Não é conselho financeiro. Faça sua própria pesquisa.',
      'footer.social_twitter': 'Seguir diBoaS no Twitter',
      'footer.social_linkedin': 'Seguir diBoaS no LinkedIn',
      
      // Language selector
      'lang.select': 'Selecionar Idioma',
      'lang.current': 'Atual: Português',
      
      // Asset Information Modals
      'asset.bitcoin.name': 'Bitcoin',
      'asset.bitcoin.symbol': 'BTC',
      'asset.bitcoin.description': 'A primeira criptomoeda do mundo, como ouro digital que você pode possuir e negociar facilmente.',
      'asset.bitcoin.pros.1': 'Confiado por milhões, de startups a marcas globais',
      'asset.bitcoin.pros.2': 'Apenas 21 milhões de moedas – um ativo raro que cresce em valor',
      'asset.bitcoin.pros.3': 'Pague em qualquer lugar, de lojas online a lojas físicas',
      'asset.bitcoin.cons.1': 'Taxas podem ser mais altas para transações pequenas',
      'asset.bitcoin.cons.2': 'Transferências podem levar alguns minutos',
      'asset.bitcoin.good_for': 'Investidores querendo um ativo confiável de longo prazo e iniciantes começando sua jornada crypto',
      
      'asset.gold.name': 'Ouro',
      'asset.gold.symbol': 'XAU',
      'asset.gold.description': 'Um ativo atemporal que você pode possuir, como uma rede de segurança dourada para sua riqueza',
      'asset.gold.pros.1': 'Confiado por séculos como reserva de valor',
      'asset.gold.pros.2': 'Protege sua riqueza durante incerteza econômica',
      'asset.gold.pros.3': 'Fácil de comprar e manter com orientação IA da Aqua',
      'asset.gold.cons.1': 'Preços podem flutuar com tendências do mercado',
      'asset.gold.cons.2': 'Sem renda como dividendos ou staking',
      'asset.gold.good_for': 'Investidores buscando uma forma segura e de longo prazo de preservar riqueza.',
      
      'asset.stocks.name': 'Ações',
      'asset.stocks.symbol': 'Ações',
      'asset.stocks.description': 'Possua uma parte das melhores empresas e diversifique facilmente seu investimento',
      'asset.stocks.pros.1': 'Invista em marcas que você conhece, como Apple ou Tesla',
      'asset.stocks.pros.2': 'Potencial de crescimento e renda de dividendos',
      'asset.stocks.pros.3': 'Diversifique facilmente',
      'asset.stocks.cons.1': 'Preços podem variar com altos e baixos do mercado',
      'asset.stocks.cons.2': 'Requer alguma pesquisa para escolher vencedores',
      'asset.stocks.good_for': 'Investidores querendo crescer riqueza com empresas familiares ou diversificar seu portfólio.',
      
      'asset.defi.name': 'DeFi',
      'asset.defi.symbol': 'DeFi',
      'asset.defi.description': 'Uma nova forma de crescer dinheiro através de finanças digitais, alimentada por tecnologia blockchain e crypto',
      'asset.defi.pros.1': 'Ganhe altos retornos através de empréstimos, staking e mais',
      'asset.defi.pros.2': 'Acesso a aplicativos e ferramentas financeiras de ponta',
      'asset.defi.pros.3': 'Assuma controle com investimentos descentralizados',
      'asset.defi.cons.1': 'Maior risco devido a nova tecnologia e problemas de contratos inteligentes',
      'asset.defi.cons.2': 'Pode ser complexo sem orientação adequada',
      'asset.defi.good_for': 'Investidores aventureiros ansiosos para explorar finanças digitais e oportunidades de alto crescimento.',
      
      // Modal Actions
      'modal.close': 'Fechar',
      'modal.choose': 'Escolher',
      'modal.compare': 'Comparar Outros',
      'modal.advantages': 'Vantagens',
      'modal.considerations': 'Considerações',
      'modal.good_for': 'Bom Para',
      'modal.maybe_later': 'Talvez Mais Tarde',
      'modal.get_started_with': 'Começar com',
      'modal.continue_to': 'Continuar para diBoaS',
      
      // Asset Confirmation Messages
      'confirmation.bitcoin.message': 'Oh, você quer se juntar aos 50+ milhões de pessoas que possuem BTC. Posso te ajudar. Tem 5 minutos para um cadastro rápido e seguro?',
      'confirmation.gold.message': 'Você quer segurança. Eu entendo! Ouro existe há séculos. Deixe-me ajudá-lo a proteger sua riqueza. Primeiro você precisa de 5 minutos para um cadastro rápido e seguro.',
      'confirmation.stocks.message': 'Vejo que você prefere finanças tradicionais. Tudo bem! Imagino que você já tem uma empresa em mente da qual gostaria de comprar uma ação. Podemos tornar isso realidade criando sua conta em apenas 2 minutos.',
      'confirmation.defi.message': 'Uau, você está realmente All-in. Incrível! Só precisamos criar sua conta, leva apenas um minuto.',
      
      // Security Information
      'security.bank_grade.title': 'Segurança de Grau Bancário',
      'security.bank_grade.description': 'Sua riqueza está protegida com criptografia de grau militar e os mesmos padrões de segurança usados por grandes instituições financeiras.',
      'security.bank_grade.detail.1': 'Criptografia de grau militar protege todos seus dados e transações',
      'security.bank_grade.detail.2': 'Protocolos de segurança multicamadas protegem contra acesso não autorizado',
      'security.bank_grade.detail.3': 'Auditorias de segurança regulares por firmas independentes de cibersegurança',
      'security.bank_grade.detail.4': 'Sistemas de autenticação avançados incluindo proteção 2FA',
      'security.bank_grade.detail.5': 'Conformidade com padrões e regulamentações de segurança internacionais',
      
      'security.non_custodial.title': 'Controle Não Custodial',
      'security.non_custodial.description': 'Você sempre mantém propriedade e controle completo de seus ativos. diBoaS nunca segura ou toca seus fundos.',
      'security.non_custodial.detail.1': 'Você possui suas chaves privadas e mantém controle total de seus ativos',
      'security.non_custodial.detail.2': 'diBoaS não pode acessar, congelar ou confiscar seus investimentos',
      'security.non_custodial.detail.3': 'Seus fundos permanecem seguros mesmo se diBoaS cessar operações',
      'security.non_custodial.detail.4': 'Carteiras não custodiais criadas automaticamente nos bastidores',
      'security.non_custodial.detail.5': 'Transparência completa - você pode verificar sua propriedade a qualquer momento',
      
      'security.regulated.title': 'Conformidade Regulamentada',
      'security.regulated.description': 'Totalmente regulamentado e conforme em múltiplas jurisdições para garantir que seus investimentos atendam os mais altos padrões legais.',
      'security.regulated.detail.1': 'Conformidade com regulamentação EU MiCA para operações europeias',
      'security.regulated.detail.2': 'Licenças BSA dos EUA e transmissão de dinheiro estadual',
      'security.regulated.detail.3': 'Conformidade com Lei Brasil 14.478 com coordenação do Banco Central',
      'security.regulated.detail.4': 'Estrutura de taxas transparente sem custos ocultos (0,09% negociação, 0,9% transferências)',
      'security.regulated.detail.5': 'Auditorias de conformidade regulares e relatórios regulatórios',
      
      // Legal Information
      'legal.privacy.title': 'Política de Privacidade',
      'legal.privacy.description': 'Sua privacidade é nossa máxima prioridade. Protegemos suas informações pessoais com os mais altos padrões de segurança de dados e transparência.',
      'legal.privacy.detail.1': 'Coletamos apenas informações essenciais requeridas para funcionalidade da plataforma',
      'legal.privacy.detail.2': 'Seus dados pessoais são criptografados e armazenados com segurança em conformidade com GDPR',
      'legal.privacy.detail.3': 'Nunca vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros',
      'legal.privacy.detail.4': 'Você mantém controle total sobre seus dados e pode solicitar exclusão a qualquer momento',
      'legal.privacy.detail.5': 'Todas atividades de processamento de dados são registradas e auditáveis para transparência',
      'legal.privacy.detail.6': 'Usamos medidas de segurança padrão da indústria para proteger contra violações de dados',
      
      'legal.terms.title': 'Termos de Serviço',
      'legal.terms.description': 'Termos claros e justos que protegem tanto você quanto diBoaS. Acreditamos em transparência e políticas amigáveis ao usuário que você pode realmente entender.',
      'legal.terms.detail.1': 'Serviço não custodial - você sempre mantém controle de seus ativos',
      'legal.terms.detail.2': 'Estrutura de taxas transparente: 0,09% negociação, 0,9% transferências, sem custos ocultos',
      'legal.terms.detail.3': 'Apenas orientação educacional - fornecemos informações, não aconselhamento financeiro',
      'legal.terms.detail.4': 'Você é responsável por suas decisões de investimento e gestão de risco',
      'legal.terms.detail.5': 'Disponibilidade da plataforma pode variar por jurisdição devido a requisitos regulatórios',
      'legal.terms.detail.6': 'Segurança da conta é responsabilidade compartilhada entre você e diBoaS',
      
      'legal.compliance.title': 'Conformidade Regulatória',
      'legal.compliance.description': 'diBoaS opera sob supervisão regulatória rigorosa em múltiplas jurisdições para garantir os mais altos padrões de conformidade financeira.',
      'legal.compliance.detail.1': 'Conformidade com regulamentação EU MiCA para todas operações da União Europeia',
      'legal.compliance.detail.2': 'Conformidade com Lei de Sigilo Bancário (BSA) dos EUA e licenças estaduais de transmissão de dinheiro',
      'legal.compliance.detail.3': 'Conformidade com Lei Brasil 14.478 com coordenação do Banco Central do Brasil',
      'legal.compliance.detail.4': 'Procedimentos Anti-Lavagem de Dinheiro (AML) e Conheça Seu Cliente (KYC)',
      'legal.compliance.detail.5': 'Auditorias de conformidade regulares por firmas independentes de terceiros',
      'legal.compliance.detail.6': 'Relatórios regulatórios contínuos e requisitos de divulgação de taxas transparentes',
      
      // Common Modal Elements
      'common.how_we_protect': 'Como Te Protegemos:',
      'common.key_points': 'Pontos Principais:',
      'common.note': 'Nota:',
      'common.legal_note': 'Este é um resumo de nossa {title}. Para texto legal completo e termos detalhados, contate-nos em legal@diboas.com',
      'common.start_secure_journey': 'Comece Sua Jornada Segura'
    }
  },
  'de': {
    name: 'Deutsch',
    code: 'de',
    flag: '🇩🇪',
    translations: {
      // Meta tags
      'meta.title': 'diBoaS - Vermögen aufbauen mit KI-Führung | BTC • Gold • Aktien • DeFi',
      'meta.description': 'Vermögensaufbau einfach, sicher und unterhaltsam gemacht. Benötigt nur $10, 5 Min und 1 Klick. Besitze Krypto, Gold, Aktien und DeFi-Rendite ohne Aufwand. Aqua, dein KI-Guide, macht es einfach. Beginne Vermögensaufbau mit nur $10.',
      'meta.keywords': 'Krypto, Bitcoin, Gold, Aktien, DeFi, Ethereum, Solana, Sui, KI-Guide, Krypto-Investment, Krypto-Anfänger, OneFi, dezentrale Finanzen, diBoaS',
      
      // Navigation
      'nav.documentation': 'Dokumentation',
      'nav.learn': 'Lernen',
      'nav.mascots': 'Maskottchen',
      'nav.investors': 'Investoren',
      'nav.get_started': 'Loslegen',
      'nav.skip_to_content': 'Zum Hauptinhalt springen',
      'nav.toggle_menu': 'Navigationsmenü umschalten',
      'nav.cta_description': 'Beginne deine Vermögensreise mit Aquas KI-Führung',
      
      // Hero Section
      'hero.headline_primary': 'Baue dein Vermögen mit Aqua auf.',
      'hero.headline_highlight': 'Beginne mit nur $10 in 5 Min und 1 Klick',
      'hero.headline_secondary': 'Klein anfangen, groß werden.',
      'hero.assets_heading': 'Verfügbare Assets',
      'hero.btc_name': 'Bitcoin',
      'hero.btc_badge': 'Digitales Gold',
      'hero.btc_description': 'Bitcoin: Die ursprüngliche Kryptowährung und digitale Wertreserve.',
      'hero.gold_name': 'Gold',
      'hero.gold_badge': 'Physisches Bitcoin',
      'hero.gold_description': 'Gold: behält seinen Wert über die Zeit und hält deine Ersparnisse sicher.',
      'hero.stocks_name': 'Aktien',
      'hero.stocks_badge': 'Traditioneller',
      'hero.stocks_description': 'Aktien: Kaufe einen Anteil an einem Unternehmen und teile sein Wachstum.',
      'hero.defi_name': 'DeFi',
      'hero.defi_badge': 'Passives Einkommen',
      'hero.defi_description': 'DeFi: Lass deine Krypto arbeiten. Stake, verleihe und mehr',
      'hero.cta_start': 'Jetzt starten',
      'hero.cta_description': 'Beginne deine Vermögensreise mit Aquas KI-Führung',
      
      // Mascot
      'mascot.aqua_greeting': 'Hallo! Ich bin Aqua, dein KI-Guide. Ich helfe dir auf deiner Vermögensaufbau-Reise',
      
      // Asset Selection
      'selection.heading': 'Nicht sicher, welche Option zu wählen?',
      'selection.decision_matrix': 'Asset-Auswahl Entscheidungsmatrix',
      'selection.want_crypto': 'Willst du Krypto ausprobieren?',
      'selection.prefer_safety': 'Bevorzugst du Sicherheit?',
      'selection.like_traditional': 'Magst du traditionelle Finanzen?',
      'selection.want_multiply': 'Willst du dein $ vermehren?',
      'selection.btc_title': 'Bitcoin',
      'selection.btc_description': 'Wertreserve & digitaler Goldstandard',
      'selection.btc_cta': 'Mit BTC beginnen',
      'selection.gold_title': 'Gold',
      'selection.gold_description': 'Gold behält seinen Wert über die Zeit und hält deine Ersparnisse sicher.',
      'selection.gold_cta': 'Gold wählen',
      'selection.stocks_title': 'Aktien',
      'selection.stocks_description': 'Kaufe einen Anteil an einem Unternehmen und teile sein Wachstum.',
      'selection.stocks_cta': 'Aktien kaufen',
      'selection.defi_title': 'DeFi',
      'selection.defi_description': 'Lass deine Krypto arbeiten. Stake, verleihe und mehr',
      'selection.defi_cta': 'DeFi wählen',
      'selection.aqua_guidance': 'Immer noch unsicher?<br>Wie wäre es, sich den 50+ Millionen Menschen anzuschließen, die Bitcoin besitzen!',
      'selection.start_bitcoin': 'Mit Bitcoin beginnen',
      
      // Trust Building
      'trust.heading': 'Warum deine Vermögensreise mit diBoaS beginnen?',
      'trust.education_title': 'Bildung-Erst Ansatz',
      'trust.education_description': 'Aquas KI macht Finanzen einfach. Kein Druck, nur Bildung.',
      'trust.small_start_title': 'Klein anfangen, groß werden',
      'trust.small_start_description': '$10 Minimum beseitigt großen Gelddruck. Baue Vertrauen mit kleinen Schritten auf.',
      'trust.transparency_title': 'Sicher und transparent',
      'trust.transparency_description': 'diBoaS nutzt Top-Sicherheit und ist 100% transparent. Keine versteckten Kosten oder Überraschungen.',
      'trust.support_title': 'KI-Guides immer verfügbar',
      'trust.support_description': 'Deine KI-Guides bieten Unterstützung bei jedem Schritt. Fühle dich nie verwirrt oder allein.',
      'trust.security_heading': 'Sicherheits- und Compliance-Features',
      'trust.bank_grade': 'Bank-Standard Sicherheit',
      'trust.non_custodial': 'Nicht-Verwahrend',
      'trust.regulated': 'Regulierte Compliance',
      
      // Final CTA
      'final_cta.heading': 'Bereit, deine Finanzreise zu beginnen?',
      'final_cta.subtext': 'Tritt diBoaS heute bei. Es ist einfach, schnell, unterhaltsam und sicher!',
      'final_cta.get_started': 'Loslegen',
      'final_cta.learn_more': 'Zuerst mehr lernen',
      'final_cta.assurance': '1-Klick • Bank-Standard Sicherheit • Aquas KI-Guide',
      
      // Footer
      'footer.tagline': 'Deine Reise zum Reichtum beginnt mit endlosen Möglichkeiten',
      'footer.journey_phase': 'Grundlagenphase • Geführt von Aqua',
      'footer.platform': 'Plattform',
      'footer.company': 'Unternehmen',
      'footer.support': 'Support',
      'footer.legal': 'Rechtliches',
      'footer.about': 'Über uns',
      'footer.careers': 'Karriere',
      'footer.faqs': 'Häufige Fragen',
      'footer.community': 'Community-Hilfe',
      'footer.contact': 'Kontakt',
      'footer.security': 'Sicherheit',
      'footer.privacy': 'Datenschutzerklärung',
      'footer.terms': 'Nutzungsbedingungen',
      'footer.compliance': 'Compliance',
      'footer.copyright': '© 2025 diBoaS. Alle Rechte vorbehalten.',
      'footer.disclaimer': 'Investieren birgt Risiken. Keine Finanzberatung. Mache deine eigenen Nachforschungen.',
      'footer.social_twitter': 'diBoaS auf Twitter folgen',
      'footer.social_linkedin': 'diBoaS auf LinkedIn folgen',
      
      // Language selector
      'lang.select': 'Sprache auswählen',
      'lang.current': 'Aktuell: Deutsch',
      
      // Asset Information Modals
      'asset.bitcoin.name': 'Bitcoin',
      'asset.bitcoin.symbol': 'BTC',
      'asset.bitcoin.description': 'Die weltweit erste Kryptowährung, wie digitales Gold, das du besitzen und handeln kannst.',
      'asset.bitcoin.pros.1': 'Vertraut von Millionen, von Startups bis zu globalen Marken',
      'asset.bitcoin.pros.2': 'Nur 21 Millionen Coins – ein seltenes Asset, das an Wert gewinnt',
      'asset.bitcoin.pros.3': 'Überall bezahlen, von Online-Shops bis zu realen Geschäften',
      'asset.bitcoin.cons.1': 'Gebühren können bei kleinen Transaktionen höher sein',
      'asset.bitcoin.cons.2': 'Überweisungen können einige Minuten dauern',
      'asset.bitcoin.good_for': 'Investoren, die ein vertrauenswürdiges, langfristiges Asset wollen und Anfänger, die ihre Krypto-Reise beginnen',
      
      'asset.gold.name': 'Gold',
      'asset.gold.symbol': 'XAU',
      'asset.gold.description': 'Ein zeitloses Asset, das du besitzen kannst, wie ein goldenes Sicherheitsnetz für dein Vermögen',
      'asset.gold.pros.1': 'Seit Jahrhunderten als Wertreserve vertraut',
      'asset.gold.pros.2': 'Schützt dein Vermögen während wirtschaftlicher Unsicherheit',
      'asset.gold.pros.3': 'Einfach zu kaufen und zu halten mit Aquas KI-Führung',
      'asset.gold.cons.1': 'Preise können mit Markttrends schwanken',
      'asset.gold.cons.2': 'Kein Einkommen wie Dividenden oder Staking',
      'asset.gold.good_for': 'Investoren, die einen sicheren, langfristigen Weg zur Vermögenserhaltung suchen.',
      
      'asset.stocks.name': 'Aktien',
      'asset.stocks.symbol': 'Aktien',
      'asset.stocks.description': 'Besitze einen Teil von Top-Unternehmen und diversifiziere deine Investition einfach',
      'asset.stocks.pros.1': 'Investiere in Marken, die du kennst, wie Apple oder Tesla',
      'asset.stocks.pros.2': 'Potenzial für Wachstum und Dividendeneinkommen',
      'asset.stocks.pros.3': 'Einfach diversifizieren',
      'asset.stocks.cons.1': 'Preise können mit Markt-Ups und -Downs variieren',
      'asset.stocks.cons.2': 'Erfordert etwas Recherche, um Gewinner zu wählen',
      'asset.stocks.good_for': 'Investoren, die Vermögen mit bekannten Unternehmen aufbauen oder ihr Portfolio diversifizieren wollen.',
      
      'asset.defi.name': 'DeFi',
      'asset.defi.symbol': 'DeFi',
      'asset.defi.description': 'Ein neuer Weg, Geld durch digitale Finanzen zu vermehren, angetrieben von Blockchain-Technologie und Krypto',
      'asset.defi.pros.1': 'Hohe Renditen durch Verleihen, Staking und mehr verdienen',
      'asset.defi.pros.2': 'Zugang zu hochmodernen Finanz-Apps und -Tools',
      'asset.defi.pros.3': 'Kontrolle mit dezentralen Investitionen übernehmen',
      'asset.defi.cons.1': 'Höheres Risiko durch neue Technologie und Smart Contract-Probleme',
      'asset.defi.cons.2': 'Kann ohne richtige Führung komplex sein',
      'asset.defi.good_for': 'Abenteuerlustige Investoren, die digitale Finanzen und Hochwachstums-Möglichkeiten erkunden möchten.',
      
      // Modal Actions
      'modal.close': 'Schließen',
      'modal.choose': 'Wählen',
      'modal.compare': 'Andere vergleichen',
      'modal.advantages': 'Vorteile',
      'modal.considerations': 'Überlegungen',
      'modal.good_for': 'Gut für',
      'modal.maybe_later': 'Vielleicht später',
      'modal.get_started_with': 'Loslegen mit',
      'modal.continue_to': 'Weiter zu diBoaS',
      
      // Asset Confirmation Messages
      'confirmation.bitcoin.message': 'Oh, du willst dich den 50+ Millionen Menschen anschließen, die BTC besitzen. Ich kann dir helfen. Hast du 5 Minuten für eine schnelle und sichere Anmeldung?',
      'confirmation.gold.message': 'Du willst Sicherheit. Das verstehe ich! Gold gibt es seit Jahrhunderten. Lass mich dir helfen, dein Vermögen zu schützen. Zuerst brauchst du 5 Minuten für eine schnelle und sichere Anmeldung.',
      'confirmation.stocks.message': 'Ich sehe, du stehst mehr auf traditionelle Finanzen. Das ist in Ordnung! Ich vermute, du hast bereits ein Unternehmen im Kopf, von dem du einen Anteil kaufen möchtest. Wir können das möglich machen, indem wir dein Konto in nur 2 Minuten erstellen.',
      'confirmation.defi.message': 'Wow, du bist wirklich All-in. Fantastisch! Wir müssen nur dein Konto erstellen, das dauert nur eine Minute.',
      
      // Security Information
      'security.bank_grade.title': 'Bank-Standard Sicherheit',
      'security.bank_grade.description': 'Dein Vermögen ist mit militärischer Verschlüsselung und den gleichen Sicherheitsstandards geschützt, die von großen Finanzinstituten verwendet werden.',
      'security.bank_grade.detail.1': 'Militärische Verschlüsselung schützt alle deine Daten und Transaktionen',
      'security.bank_grade.detail.2': 'Mehrschichtige Sicherheitsprotokolle schützen vor unbefugtem Zugriff',
      'security.bank_grade.detail.3': 'Regelmäßige Sicherheitsaudits durch unabhängige Cybersicherheitsfirmen',
      'security.bank_grade.detail.4': 'Fortgeschrittene Authentifizierungssysteme einschließlich 2FA-Schutz',
      'security.bank_grade.detail.5': 'Einhaltung internationaler Sicherheitsstandards und -vorschriften',
      
      'security.non_custodial.title': 'Nicht-Verwahrende Kontrolle',
      'security.non_custodial.description': 'Du behältst immer vollständiges Eigentum und Kontrolle über deine Assets. diBoaS hält oder berührt niemals deine Gelder.',
      'security.non_custodial.detail.1': 'Du besitzt deine privaten Schlüssel und behältst volle Kontrolle über deine Assets',
      'security.non_custodial.detail.2': 'diBoaS kann nicht auf deine Investitionen zugreifen, sie einfrieren oder beschlagnahmen',
      'security.non_custodial.detail.3': 'Deine Gelder bleiben sicher, auch wenn diBoaS den Betrieb einstellt',
      'security.non_custodial.detail.4': 'Nicht-verwahrende Wallets werden automatisch im Hintergrund erstellt',
      'security.non_custodial.detail.5': 'Vollständige Transparenz - du kannst dein Eigentum jederzeit verifizieren',
      
      'security.regulated.title': 'Regulierte Compliance',
      'security.regulated.description': 'Vollständig reguliert und konform in mehreren Jurisdiktionen, um sicherzustellen, dass deine Investitionen den höchsten rechtlichen Standards entsprechen.',
      'security.regulated.detail.1': 'EU MiCA-Verordnung Compliance für europäische Operationen',
      'security.regulated.detail.2': 'US BSA und staatliche Geldübertragungslizenzen',
      'security.regulated.detail.3': 'Brasilien Gesetz 14.478 Compliance mit Zentralbank-Koordination',
      'security.regulated.detail.4': 'Transparente Gebührenstruktur ohne versteckte Kosten (0,09% Handel, 0,9% Überweisungen)',
      'security.regulated.detail.5': 'Regelmäßige Compliance-Audits und regulatorische Berichterstattung',
      
      // Legal Information
      'legal.privacy.title': 'Datenschutzerklärung',
      'legal.privacy.description': 'Deine Privatsphäre ist unsere oberste Priorität. Wir schützen deine persönlichen Informationen mit den höchsten Standards der Datensicherheit und Transparenz.',
      'legal.privacy.detail.1': 'Wir sammeln nur wesentliche Informationen, die für die Plattform-Funktionalität erforderlich sind',
      'legal.privacy.detail.2': 'Deine persönlichen Daten werden verschlüsselt und sicher in DSGVO-Konformität gespeichert',
      'legal.privacy.detail.3': 'Wir verkaufen, vermieten oder teilen niemals deine persönlichen Informationen mit Dritten',
      'legal.privacy.detail.4': 'Du behältst volle Kontrolle über deine Daten und kannst jederzeit Löschung beantragen',
      'legal.privacy.detail.5': 'Alle Datenverarbeitungsaktivitäten werden für Transparenz protokolliert und auditierbar gemacht',
      'legal.privacy.detail.6': 'Wir verwenden branchenübliche Sicherheitsmaßnahmen zum Schutz vor Datenverletzungen',
      
      'legal.terms.title': 'Nutzungsbedingungen',
      'legal.terms.description': 'Klare, faire Bedingungen, die sowohl dich als auch diBoaS schützen. Wir glauben an Transparenz und benutzerfreundliche Richtlinien, die du tatsächlich verstehen kannst.',
      'legal.terms.detail.1': 'Nicht-verwahrende Dienstleistung - du behältst immer die Kontrolle über deine Assets',
      'legal.terms.detail.2': 'Transparente Gebührenstruktur: 0,09% Handel, 0,9% Überweisungen, keine versteckten Kosten',
      'legal.terms.detail.3': 'Nur Bildungsberatung - wir bieten Informationen, keine Finanzberatung',
      'legal.terms.detail.4': 'Du bist verantwortlich für deine Investitionsentscheidungen und Risikomanagement',
      'legal.terms.detail.5': 'Plattform-Verfügbarkeit kann je nach Jurisdiktion aufgrund regulatorischer Anforderungen variieren',
      'legal.terms.detail.6': 'Kontosicherheit ist eine geteilte Verantwortung zwischen dir und diBoaS',
      
      'legal.compliance.title': 'Regulatorische Compliance',
      'legal.compliance.description': 'diBoaS operiert unter strenger regulatorischer Aufsicht in mehreren Jurisdiktionen, um die höchsten Standards der Finanz-Compliance zu gewährleisten.',
      'legal.compliance.detail.1': 'EU MiCA-Verordnung Compliance für alle Europäische Union Operationen',
      'legal.compliance.detail.2': 'US Bank Secrecy Act (BSA) Compliance und staatliche Geldübertragungslizenzen',
      'legal.compliance.detail.3': 'Brasilien Gesetz 14.478 Compliance mit Zentralbank von Brasilien Koordination',
      'legal.compliance.detail.4': 'Anti-Geldwäsche (AML) und Know Your Customer (KYC) Verfahren',
      'legal.compliance.detail.5': 'Regelmäßige Compliance-Audits durch unabhängige Drittpartei-Firmen',
      'legal.compliance.detail.6': 'Laufende regulatorische Berichterstattung und transparente Gebührenoffenlegungsanforderungen',
      
      // Common Modal Elements
      'common.how_we_protect': 'Wie wir dich schützen:',
      'common.key_points': 'Hauptpunkte:',
      'common.note': 'Hinweis:',
      'common.legal_note': 'Dies ist eine Zusammenfassung unserer {title}. Für den vollständigen rechtlichen Text und detaillierte Bedingungen kontaktiere uns bitte unter legal@diboas.com',
      'common.start_secure_journey': 'Starte deine sichere Reise'
    }
  }
};

// Default language
const DEFAULT_LANGUAGE = 'en';

// Current language state
let currentLanguage = DEFAULT_LANGUAGE;

/**
 * i18n Namespace
 */
window.i18n = {
  
  /**
   * Initialize internationalization
   */
  init() {
    // Detect browser language
    const browserLang = this.detectBrowserLanguage();
    
    // Check for stored language preference
    const storedLang = localStorage.getItem('diboas_language');
    
    // Set initial language
    const initialLang = storedLang || browserLang || DEFAULT_LANGUAGE;
    this.setLanguage(initialLang);
    
    // Initialize language selector
    this.initLanguageSelector();
    
    console.log('🌍 i18n initialized with language:', currentLanguage);
  },
  
  /**
   * Detect browser language
   */
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // Get primary language code
    
    // Check if we support this language
    return LANGUAGES[langCode] ? langCode : DEFAULT_LANGUAGE;
  },
  
  /**
   * Set the current language
   */
  setLanguage(langCode) {
    if (!LANGUAGES[langCode]) {
      console.warn(`Language ${langCode} not supported, falling back to ${DEFAULT_LANGUAGE}`);
      langCode = DEFAULT_LANGUAGE;
    }
    
    const previousLanguage = currentLanguage;
    currentLanguage = langCode;
    
    // Store preference
    localStorage.setItem('diboas_language', langCode);
    
    // Update HTML lang attribute
    document.documentElement.lang = langCode;
    
    // Update all translatable elements
    this.updateTranslations();
    
    // Update meta tags
    this.updateMetaTags();
    
    // Update all language selectors
    this.updateAllLanguageSelectors();
    
    // Trigger language change event
    this.triggerLanguageChange(langCode, previousLanguage);
  },
  
  /**
   * Get translation for a key
   */
  t(key) {
    const translations = LANGUAGES[currentLanguage]?.translations || LANGUAGES[DEFAULT_LANGUAGE].translations;
    return translations[key] || key;
  },
  
  /**
   * Update all translatable elements in the DOM
   */
  updateTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.innerHTML = translation;
      }
    });
    
    // Update elements with data-i18n-aria attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = this.t(key);
      
      element.setAttribute('aria-label', translation);
    });
    
    // Update elements with data-i18n-title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      const translation = this.t(key);
      
      element.title = translation;
    });
  },
  
  /**
   * Update meta tags for SEO
   */
  updateMetaTags() {
    // Update title
    const title = this.t('meta.title');
    document.title = title;
    
    // Update meta description
    const description = this.t('meta.description');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = description;
    }
    
    // Update meta keywords
    const keywords = this.t('meta.keywords');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content = keywords;
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = title;
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.content = description;
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.content = title;
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.content = description;
    }
  },
  
  /**
   * Initialize language selector UI
   */
  initLanguageSelector() {
    // Create language selector if it doesn't exist
    let selector = document.getElementById('language-selector');
    if (!selector) {
      selector = this.createLanguageSelector();
    }
    
    // Update selector content
    this.updateLanguageSelector(selector);
    
    // Force update after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.updateAllLanguageSelectors();
    }, 100);
  },
  
  /**
   * Create language selector element
   */
  createLanguageSelector() {
    const selector = document.createElement('div');
    selector.id = 'language-selector';
    selector.className = 'language-selector';
    selector.innerHTML = `
      <button class="language-toggle" aria-label="${this.t('lang.select')}" aria-expanded="false">
        <span class="current-language">
          <span class="flag">${LANGUAGES[currentLanguage].flag}</span>
          <span class="code">${LANGUAGES[currentLanguage].code.toUpperCase()}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>
      <div class="language-options">
        ${Object.entries(LANGUAGES).map(([code, lang]) => `
          <button class="language-option ${code === currentLanguage ? 'active' : ''}" 
                  data-lang="${code}"
                  aria-label="Switch to ${lang.name}">
            <span class="flag">${lang.flag}</span>
            <span class="name">${lang.name}</span>
          </button>
        `).join('')}
      </div>
    `;
    
    // Add to navigation
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
      navActions.insertBefore(selector, navActions.firstChild);
    }
    
    // Add event listeners
    this.addLanguageSelectorListeners(selector);
    
    return selector;
  },
  
  /**
   * Update language selector content
   */
  updateLanguageSelector(selector) {
    const currentFlag = selector.querySelector('.current-language .flag');
    const currentCode = selector.querySelector('.current-language .code');
    
    if (currentFlag) currentFlag.textContent = LANGUAGES[currentLanguage].flag;
    if (currentCode) currentCode.textContent = LANGUAGES[currentLanguage].code.toUpperCase();
    
    // Update active option
    selector.querySelectorAll('.language-option').forEach(option => {
      option.classList.toggle('active', option.dataset.lang === currentLanguage);
    });
  },
  
  /**
   * Update all language selectors on the page
   */
  updateAllLanguageSelectors() {
    document.querySelectorAll('.language-selector').forEach(selector => {
      this.updateLanguageSelector(selector);
    });
  },
  
  /**
   * Add event listeners to language selector
   */
  addLanguageSelectorListeners(selector) {
    const toggle = selector.querySelector('.language-toggle');
    const options = selector.querySelector('.language-options');
    
    // Toggle dropdown
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      options.classList.toggle('open');
    });
    
    // Language option clicks
    selector.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        const previousLang = currentLanguage;
        
        this.setLanguage(lang);
        
        // Close dropdown
        toggle.setAttribute('aria-expanded', 'false');
        options.classList.remove('open');
        
        // Track language change
        if (window.trackEvent) {
          window.trackEvent('language_changed', {
            from: previousLang,
            to: lang,
            method: 'selector'
          });
        }
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        options.classList.remove('open');
      }
    });
  },
  
  /**
   * Trigger language change event
   */
  triggerLanguageChange(langCode, previousLanguage) {
    const event = new CustomEvent('languageChanged', {
      detail: { 
        language: langCode, 
        previousLanguage: previousLanguage,
        translations: LANGUAGES[langCode].translations 
      }
    });
    document.dispatchEvent(event);
  },
  
  /**
   * Get current language
   */
  getCurrentLanguage() {
    return currentLanguage;
  },
  
  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return Object.keys(LANGUAGES);
  },
  
  /**
   * Get language data
   */
  getLanguageData(langCode) {
    return LANGUAGES[langCode] || LANGUAGES[DEFAULT_LANGUAGE];
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.i18n.init();
  });
} else {
  window.i18n.init();
}