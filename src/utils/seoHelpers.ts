// SEO utility functions

export const generateSitemap = (projects: any[]) => {
  const baseUrl = 'https://rcconstrucoes.pt';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'monthly', lastmod: currentDate },
    { url: '/projetos', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
  ];
  
  const projectPages = projects.map(project => ({
    url: `/projetos/${project.id}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: project.updated_at?.split('T')[0] || currentDate
  }));
  
  const allPages = [...staticPages, ...projectPages];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  allPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });
  
  sitemap += `
</urlset>`;
  
  return sitemap;
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://rcconstrucoes.pt/sitemap.xml

# Block admin areas
Disallow: /admin
Disallow: /admin-login`;
};

export const extractKeywords = (text: string, maxKeywords: number = 10): string[] => {
  // Simple keyword extraction - remove common words and get most frequent
  const commonWords = ['o', 'a', 'de', 'do', 'da', 'e', 'em', 'para', 'com', 'um', 'uma', 'no', 'na', 'dos', 'das', 'por', 'se', 'que', 'como', 'mais', 'este', 'esta', 'ou', 'são', 'foi', 'tem', 'ser', 'sua', 'seu'];
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

export const generateOpenGraphImage = (title: string, category?: string) => {
  // This would generate a dynamic OG image URL
  // For now, return the static image
  return '/og-image.jpg';
};

export const optimizeDescription = (description: string, maxLength: number = 160): string => {
  if (description.length <= maxLength) return description;
  
  // Find the last complete sentence within the limit
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.7) {
    return description.substring(0, lastPeriod + 1);
  } else if (lastSpace > maxLength * 0.8) {
    return description.substring(0, lastSpace) + '...';
  } else {
    return truncated + '...';
  }
};