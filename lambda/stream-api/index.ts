import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { RequestParametor, ChatStreamResponse, Message } from '../types/type';
import { Writable } from 'stream';
import axios from 'axios';
import * as fs from 'fs';

type handler = (event: APIGatewayProxyEventV2, responseStream: fs.WriteStream) => Promise<void>;

declare const awslambda: {
  streamifyResponse: (fn: handler) => void;
  setContentType: (type: string) => void;
};

export const handler = awslambda.streamifyResponse(async (event: APIGatewayProxyEventV2, responseStream: Writable) => {
  console.log('[LOG] event', event);

  if (!event.body) {
    responseStream.end();
    return;
  }

  const body = JSON.parse(event.body);
  const messages: Message[] = body.messages;

  await send(
    [...messages],
    (content) => {
      responseStream.write(content);
      console.log('[LOG]stream write', content);
    },
    () => {
      responseStream.end();
      console.log('[LOG]stream end');
    }
  );

  return;
});

async function send(messages: Message[], dataCb: (content: string) => void, endCb: () => void) {
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

  // 以下流れでstreamで受け取ったデータを加工する
  // 1.レスポンスのBuffer⇒string(JSON文字列)変換
  // 2.prefixの「data:」をトリム
  // 3.複数のjsonが返ってくるケース("{....} \n {....}" みたいな)があるため文字列を改行で分割
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

      dataCb(jsonChunk.choices[0].delta.content ?? '');
    });
  });

  result.on('end', () => {
    console.log('[LOG]response end');
    endCb();
  });
}

// // @ts-ignore
// handler({ body: `"messages":[{"role":"user","content":"あなたのGPTのバージョンを教えてください。gpt-3.5とgpt-4のどちらですか？"}]` }).then(() => {
//   console.log('end');
// });
