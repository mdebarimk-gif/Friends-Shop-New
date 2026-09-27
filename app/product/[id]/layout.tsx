import type { Metadata } from 'next';
import { supabase } from '../../../lib/supabase';

const SITE_URL = 'https://friends-shop-new-y91j-plum.vercel.app';

type Props = {
  children: React.ReactNode;
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

  const productUrl = `${SITE_URL}/product/${id}`;

  return {
    title: `${product.title} | Friends Shop`,
    description:
      product.description || `Buy ${product.title} from Friends Shop`,
    openGraph: {
      title: product.title,
      description:
        product.description || `Buy ${product.title} from Friends Shop`,
      url: productUrl,
      siteName: 'Friends Shop',
      type: 'website',
      ...(product.image_url
        ? {
            images: [
              {
                url: product.image_url,
                width: 1200,
                height: 1200,
                alt: product.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description:
        product.description || `Buy ${product.title} from Friends Shop`,
      ...(product.image_url
        ? {
            images: [product.image_url],
          }
        : {}),
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return children;
}
