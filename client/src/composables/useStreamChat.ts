import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type RequestMessage = Omit<Message, 'id'>;

export default () => {
  const contents = ref<Message[]>([]);

  const sendMessage = async (message: Message['content']) => {
    const msg: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
    };

    const tmp: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
    };

    contents.value = [...contents.value, msg, tmp];

    const requestMessages: RequestMessage[] = contents.value.map((c) => {
      return { role: c.role, content: c.content };
    });

    const res = await fetch('https://k74zotfdcbz64fcd7srvjx4dvu0wsfvn.lambda-url.ap-northeast-1.on.aws/ ', {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({ messages: requestMessages }),
    });

    const stream = res.body?.getReader();
    console.log(stream);

    if (!stream) return;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await stream.read();

      console.log(done, value);

      if (done || !value) break;

      contents.value[contents.value.length - 1].content =
        contents.value[contents.value.length - 1].content + new TextDecoder().decode(value);
    }
  };

  return {
    contents,
    sendMessage,
  };
};
