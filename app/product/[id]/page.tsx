import type { Metadata } from 'next';
import { supabase } from '../../../lib/supabase';
import ProductClient from './ProductClient';

const SITE_URL = 'https://friends-shop-new-y91j-plum.vercel.app';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;

  const { data: product } = await supabase
    .from('products')
    .select('title, description, image_url')
    .eq('id', Number(id))
    .single();

  if (!product) {
    return {
      title: 'Product | Friends Shop',
      description: 'Friends Shop Ecommerce',
    };
  }

  const title = `${product.title} | Friends Shop`;
  const description =
    product.description || `Buy ${product.title} from Friends Shop`;
  const productUrl = `${SITE_URL}/product/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: 'Friends Shop',
      type: 'website',
      images: product.image_url
        ? [
            {
              url: product.image_url,
              width: 1200,
              height: 1200,
              alt: product.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default function ProductPage() {
  return <ProductClient />;
}
