import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const setMetaTag = (selector: string, attribute: string, value: string, content: string) => {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  const { t, i18n } = useTranslation();

  const seoTitle = title || t('seo.title');
  const seoDescription = description || t('seo.description');
  const seoKeywords = keywords || t('seo.keywords');

  useEffect(() => {
    // Update document title
    document.title = seoTitle;

    // Update html lang attribute
    document.documentElement.lang = i18n.language.split('-')[0];

    // Basic meta tags
    setMetaTag('meta[name="description"]', 'name', 'description', seoDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', seoKeywords);
    setMetaTag('meta[name="author"]', 'name', 'author', 'FoxApply');
    setMetaTag('meta[name="publisher"]', 'name', 'publisher', 'FoxApply');
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');

    // Open Graph tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seoTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seoDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'FoxApply');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', i18n.language);

    // Twitter Card tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seoTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seoDescription);
  }, [seoTitle, seoDescription, seoKeywords, i18n.language]);

  return null;
};
