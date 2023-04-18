import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import axios from 'axios';
import { RequestParametor, ChatStreamResponse, Message } from '../type/type';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('[LOG] event', event);

  await send([
    {
      role: 'user',
      content: '1から10まで数えてください',
    },
  ]);

  return {
    body: 'ok',
    statusCode: 200,
  };
};

async function send(messages: Message[]) {
  const req: RequestParametor = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    user: 'yskst96',
    stream: true,
  };

  const response = await axios.post('https://api.openai.com/v1/chat/completions', req, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    responseType: 'stream',
  });

  const result = response.data;
  let msg = '';

  // 以下流れでstreamで受け取ったデータを加工する
  // 1.レスポンスのBuffer⇒string(JSON)変換
  // 2.prefixの「data:」をトリム
  // 3.複数のjsonが返ってくるケースがあるため文字列を改行で分割
  // 4.分割した文字列ごとにjson文字列としてparse
  result.on('data', (chunk: Buffer) => {
    // 1.
    const rawStrChunk = chunk.toString('utf-8');

    // レスポンスの終端はスキップ
    if (rawStrChunk.startsWith('data: [DONE]')) return;

    console.log('[LOG]rawStrChunk:', rawStrChunk);

    // 2.
    const strChunk = rawStrChunk.replace(/data:/g, '');

    // 3.
    const chunkArray = strChunk.split('\n');

    chunkArray.forEach((c) => {
      // JSON文字列に該当しない要素はスキップ
      if (!c.includes('{')) return;

      // 4.
      const jsonChunk: ChatStreamResponse = JSON.parse(c);

      msg += jsonChunk.choices[0].delta.content ?? '';
    });
  });

  result.on('end', () => {
    console.log('[LOG]response end:\n', msg);
  });
}

// @ts-ignore
handler({}).then(() => {
  console.log('end');
});
