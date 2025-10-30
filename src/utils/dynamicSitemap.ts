import { supabase } from '@/integrations/supabase/client';

export const generateDynamicSitemap = async () => {
  const baseUrl = 'https://rcconstrucoes.pt';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'monthly', lastmod: currentDate },
    { url: '/#about', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
    { url: '/#services', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
    { url: '/#gallery', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
    { url: '/#faq', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/#contact', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
  ];
  
  // Fetch dynamic project pages
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, updated_at')
    .eq('status', 'active')
    .order('updated_at', { ascending: false });
  
  const projectPages = (projects || []).map(project => ({
    url: `/projeto/${project.id}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: project.updated_at?.split('T')[0] || currentDate,
    title: project.title
  }));
  
  const allPages = [...staticPages, ...projectPages];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
  
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

// Function to download sitemap
export const downloadSitemap = async () => {
  const sitemap = await generateDynamicSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
