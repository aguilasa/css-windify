import { NextRequest, NextResponse } from 'next/server';
import { transformCssText, MatchCtx } from '@css-windify/core';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { css, options } = body as { css: string; options: MatchCtx };

    if (!css) {
      return NextResponse.json({ error: 'CSS content is required' }, { status: 400 });
    }

    // Process CSS transformation on the server
    const result = transformCssText(css, options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error transforming CSS:', error);
    return NextResponse.json(
      {
        error: 'Failed to transform CSS',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
