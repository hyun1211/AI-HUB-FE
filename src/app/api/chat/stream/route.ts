import { findMockResponse } from "@/data/mockResponses";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, hasImage } = await req.json();

  // 이미지가 있는 경우 특별한 응답
  let responseText: string;
  if (hasImage && !message.trim()) {
    responseText = "흥미로운 이미지네요! 이미지에 대해 자세히 설명해주시면 더 도움이 될 수 있을 것 같습니다.";
  } else if (hasImage && message.trim()) {
    responseText = `이미지와 함께 보내주신 메시지를 잘 받았습니다. "${message}"에 대해 말씀드리자면, ${findMockResponse(message)}`;
  } else {
    // 사용자 메시지에 대한 응답 찾기
    responseText = findMockResponse(message);
  }

  // SSE 스트림 설정
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 응답을 한 글자씩 스트리밍
        for (let i = 0; i < responseText.length; i++) {
          const char = responseText[i];

          // SSE 형식으로 데이터 전송
          const data = {
            content: char,
            done: i === responseText.length - 1,
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );

          // 타이핑 효과를 위한 딜레이 (30-50ms)
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 20 + 30)
          );
        }

        // 스트림 종료
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
