import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import axios from 'axios';
import { RequestParametor, ChatResponse, Message } from '../type/type';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('[LOG] event', event);

  const res = await send([
    {
      role: 'user',
      content: '1から10まで数えてください',
    },
    { role: 'assistant', content: '1、2、3、4、5、6、7、8、9、10。' },
    { role: 'user', content: 'ありがとう' },
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
