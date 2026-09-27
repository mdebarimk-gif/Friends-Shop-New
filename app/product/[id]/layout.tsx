import type { Metadata } from 'next';

const SITE_URL = 'https://friends-shop-new-y91j-plum.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Friends Shop',
  description: 'Friends Shop Ecommerce',
  openGraph: {
    title: 'Friends Shop',
    description: 'Friends Shop Ecommerce',
    url: SITE_URL,
    siteName: 'Friends Shop',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Friends Shop',
    description: 'Friends Shop Ecommerce',
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
