import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const { searchParams } = new URL(request.url);
    const isAudio = searchParams.get('is_audio') || 'false';
    
    const backendUrl = process.env.NEXT_JS_GOOGLE_ADK_URL || 'http://localhost:8000';
    const backendResponse = await fetch(
      `${backendUrl}/events/${sessionId}?is_audio=${isAudio}`,
      {
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      }
    );

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }

    // Create a readable stream to proxy the SSE data
    const stream = new ReadableStream({
      start(controller) {
        const reader = backendResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }

        return pump();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('Error proxying SSE from backend:', error);
    return new Response('Error connecting to backend', { status: 500 });
  }
}
