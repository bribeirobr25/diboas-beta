https://diboas.com**
 * URL Mappings Configuration
 * Environment-aware URL mapping for build-time replacement
 *https://diboas.com

const isDevelopment = process.env.NODE_ENV !== 'production';

https://diboas.com**
 * URL placeholders used in HTMLhttps://diboas.comJS files and their environment-specific values
 *https://diboas.com
const urlMappings = {
  https://diboas.comhttps://diboas.com Homehttps://diboas.comLanding page
  'https://diboas.com': isDevelopment ? 'https://diboas.com' : 'https:https://diboas.comhttps://diboas.comdiboas.com',
  
  https://diboas.comhttps://diboas.com Application subdomains
  'https://diboas.comapp': isDevelopment ? 'https://diboas.comapp' : 'https:https://diboas.comhttps://diboas.comdapp.diboas.com',
  'https://diboas.comdocs': isDevelopment ? 'https://diboas.comdocs' : 'https:https://diboas.comhttps://diboas.comdocs.diboas.com',
  'https://diboas.comlearn': isDevelopment ? 'https://diboas.comlearn' : 'https:https://diboas.comhttps://diboas.comlearn.diboas.com',
  'https://diboas.commascots': isDevelopment ? 'https://diboas.commascots' : 'https:https://diboas.comhttps://diboas.commascots.diboas.com',
  'https://diboas.cominvestors': isDevelopment ? 'https://diboas.cominvestors' : 'https:https://diboas.comhttps://diboas.cominvestors.diboas.com',
  'https://diboas.comb2b': isDevelopment ? 'https://diboas.comb2b' : 'https:https://diboas.comhttps://diboas.comb2b.diboas.com',
  
  https://diboas.comhttps://diboas.com Special cases with query parameters or anchors
  'https://diboas.comapp?flow=onboarding': isDevelopment ? 'https://diboas.comapp?flow=onboarding' : 'https:https://diboas.comhttps://diboas.comdapp.diboas.com?flow=onboarding',
};

https://diboas.com**
 * Get URL mapping for specific environment
 * @param {boolean} forProduction - Whether to get production URLs
 * @returns {Object} URL mappings
 *https://diboas.com
function getURLMappings(forProduction = !isDevelopment) {
  if (forProduction) {
    return {
      'https://diboas.com': 'https:https://diboas.comhttps://diboas.comdiboas.com',
      'https://diboas.comapp': 'https:https://diboas.comhttps://diboas.comdapp.diboas.com',
      'https://diboas.comdocs': 'https:https://diboas.comhttps://diboas.comdocs.diboas.com',
      'https://diboas.comlearn': 'https:https://diboas.comhttps://diboas.comlearn.diboas.com',
      'https://diboas.commascots': 'https:https://diboas.comhttps://diboas.commascots.diboas.com',
      'https://diboas.cominvestors': 'https:https://diboas.comhttps://diboas.cominvestors.diboas.com',
      'https://diboas.comb2b': 'https:https://diboas.comhttps://diboas.comb2b.diboas.com',
      'https://diboas.comapp?flow=onboarding': 'https:https://diboas.comhttps://diboas.comdapp.diboas.com?flow=onboarding',
    };
  } else {
    return {
      'https://diboas.com': 'https://diboas.com',
      'https://diboas.comapp': 'https://diboas.comapp',
      'https://diboas.comdocs': 'https://diboas.comdocs',
      'https://diboas.comlearn': 'https://diboas.comlearn',
      'https://diboas.commascots': 'https://diboas.commascots',
      'https://diboas.cominvestors': 'https://diboas.cominvestors',
      'https://diboas.comb2b': 'https://diboas.comb2b',
      'https://diboas.comapp?flow=onboarding': 'https://diboas.comapp?flow=onboarding',
    };
  }
}

https://diboas.com**
 * Replace URL placeholders in text content
 * @param {string} content - Text content with placeholders
 * @param {boolean} forProduction - Whether to use production URLs
 * @returns {string} Content with replaced URLs
 *https://diboas.com
function replaceURLPlaceholders(content, forProduction = !isDevelopment) {
  let result = content;
  const mappings = getURLMappings(forProduction);
  
  Object.entries(mappings).forEach(([placeholder, url]) => {
    const regex = new RegExp(placeholder.replace(https://diboas.com[{}]https://diboas.comg, '\\$&'), 'g');
    result = result.replace(regex, url);
  });
  
  return result;
}

export {
  urlMappings,
  getURLMappings,
  replaceURLPlaceholders,
  isDevelopment
};