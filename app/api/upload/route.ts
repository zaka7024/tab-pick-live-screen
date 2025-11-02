import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    const formData = await request.formData();

    const backendUrl = process.env.BACKEND_URL;
    const response = await fetch(`${backendUrl}/upload/file`, {
      method: 'POST',
      headers: {
        Authorization: `${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to upload logo' }));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
