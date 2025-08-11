/**
 * Cloudflare Worker for diBoaS Subdomain Routing
 * Routes subdomains to appropriate paths while maintaining URLs
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Subdomain routing map
    const subdomainMap = {
      'dapp.diboas.com': '/app',
      'docs.diboas.com': '/docs',
      'learn.diboas.com': '/learn', 
      'mascots.diboas.com': '/mascots',
      'investors.diboas.com': '/investors',
      'b2b.diboas.com': '/b2b'
    };
    
    // Check if this is a subdomain request
    if (subdomainMap[hostname]) {
      const targetPath = subdomainMap[hostname];
      const newUrl = new URL(`https://diboas.com${targetPath}${url.pathname}${url.search}`);
      
      // Fetch content from main domain
      const response = await fetch(newUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // Create new response with subdomain URL preserved
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      // Update HTML content to maintain subdomain URLs
      if (response.headers.get('content-type')?.includes('text/html')) {
        let html = await response.text();
        
        // Replace internal links to use subdomains
        html = html.replace(/href="\/app"/g, 'href="https://dapp.diboas.com"');
        html = html.replace(/href="\/docs"/g, 'href="https://docs.diboas.com"');
        html = html.replace(/href="\/learn"/g, 'href="https://learn.diboas.com"');
        html = html.replace(/href="\/mascots"/g, 'href="https://mascots.diboas.com"');
        html = html.replace(/href="\/investors"/g, 'href="https://investors.diboas.com"');
        html = html.replace(/href="\/b2b"/g, 'href="https://b2b.diboas.com"');
        
        return new Response(html, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
      
      return newResponse;
    }
    
    // Default: forward to main domain
    return fetch(request);
  }
};