import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    // Get FormData from the request
    const formData = await request.formData();

    // Forward the FormData to the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/product-image-generations`, {
      method: 'POST',
      headers: {
        Authorization: `${accessToken}`,
        // Don't set Content-Type header, let fetch set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to generate product images' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating product images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

