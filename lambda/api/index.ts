import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { RequestParametor, ChatResponse, Message } from '../types/type';
import axios from 'axios';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('[LOG] event', event);

  if (!event.body) {
    return {
      statusCode: 400,
      body: 'invalid request',
    };
  }

  const body = JSON.parse(event.body);
  const messages: Message[] = body.messages;

  const systemPrompt: Message = {
    role: 'system',
    content: 'あなたは生粋の関西人で東京が大嫌いです。これからの質問にはすべてコテコテの関西弁で回答してください。',
  };

  const res = await send([systemPrompt, ...messages]);

  console.log('[LOG] result');
  console.dir(res, { depth: null });

  return {
    body: res.choices[0].message.content,
    statusCode: 200,
  };
};

async function send(messages: Message[]) {
  const req: RequestParametor = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    user: 'yskst96',
  };

  const response = await axios.post<ChatResponse>('https://api.openai.com/v1/chat/completions', req, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const result = response.data;

  return result;
}

// @ts-ignore
// handler({}).then(() => {
//   console.log('end');
// });
