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

    contents.value = [...contents.value, msg];

    // const requestMessages: RequestMessage[] = contents.value.map((c) => {
    //   return { role: c.role, content: c.content };
    // });
    // const res = await fetch('https://h2vbnfmpiblp4fislyelggsns40arwhz.lambda-url.ap-northeast-1.on.aws/', {
    //   method: 'post',
    //   mode: 'cors',
    //   body: JSON.stringify({ messages: requestMessages }),
    // });

    // const resContent = await res.text();

    // const assistantMsg: Message = {
    //   id: uuidv4(),
    //   role: 'assistant',
    //   content: resContent,
    // };

    // contents.value = [...contents.value, assistantMsg];
  };

  return {
    contents,
    sendMessage,
  };
};
