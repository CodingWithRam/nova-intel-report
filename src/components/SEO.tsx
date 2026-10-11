import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  schemaType?: 'WebSite' | 'Article' | 'Course' | 'FAQPage';
  schemaData?: any;
}

export default function SEO({
  title,
  description,
  keywords = ['education', 'AI', 'engineering', 'programming', 'interview prep', 'roadmaps'],
  canonicalUrl = window.location.href,
  schemaType = 'WebSite',
  schemaData
}: SEOProps) {
  useEffect(() => {
    // 1. Update document title
    document.title = `${title} | Nova Intel Report`;

    // 2. Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    // 4. Update Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${title} | Nova Intel Report`);

    // 5. Update Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // 6. Update Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    // 7. Inject JSON-LD Schema Markup
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: `${title} | Nova Intel Report`,
      description: description,
      url: canonicalUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Nova Intel Report',
        logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop'
      },
      ...schemaData
    };

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(defaultSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const scriptToRemove = document.getElementById('json-ld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, schemaType, schemaData]);

  return null; // SEO component does not render visual layout itself
}
