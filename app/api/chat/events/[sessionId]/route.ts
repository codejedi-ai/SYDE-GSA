import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const { searchParams } = new URL(request.url);
    const isAudio = searchParams.get('is_audio') || 'false';
    
    const backendHost = process.env.NEXT_PUBLIC_GOOGLE_ADK_CHAT_AGENT_HOST || 'http://localhost:8000';
    const backendUrl = `${backendHost}/events/${sessionId}?is_audio=${isAudio}`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }
    
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error proxying SSE to backend:', error);
    return NextResponse.json(
      { error: 'Failed to connect to events stream' },
      { status: 500 }
    );
  }
}
