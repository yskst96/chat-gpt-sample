import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import axios from 'axios';

// https://platform.openai.com/docs/api-reference/chat/create

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type RequestParametor = {
  model: 'gpt-3.5-turbo';
  messages: Message[];
  user: string;
};

type ChatResponse = {
  id: string;
  object: string;
  created: number;
  choices: [
    {
      index: number;
      message: Message;
      finish_reason: 'stop';
    }
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('[LOG] event', event);

  const res = await send([
    {
      role: 'user',
      content: '1から10まで数えてください',
    },
  ]);

  console.log('[LOG] result');
  console.dir(res, { depth: null });

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
handler({}).then(() => {
  console.log('end');
});
