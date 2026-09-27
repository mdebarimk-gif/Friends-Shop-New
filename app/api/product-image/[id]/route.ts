import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: Context
) {
  const { id } = await params;

  const { data: product } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', Number(id))
    .single();

  if (!product?.image_url) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const imageResponse = await fetch(product.image_url, {
    cache: 'no-store',
  });

  if (!imageResponse.ok) {
    return new NextResponse('Image unavailable', { status: 404 });
  }

  const imageBuffer = await imageResponse.arrayBuffer();

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      'Content-Type':
        imageResponse.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
