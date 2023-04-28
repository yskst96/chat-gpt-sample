export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// Chat APIへのリクエスト
// 詳細はhttps://platform.openai.com/docs/api-reference/chat/create
export type RequestParametor = {
  model: 'gpt-3.5-turbo' | 'gpt-4';
  messages: Message[];
  user?: string;
  stream?: boolean;
  top_p?: number;
  n?: number;
  stop?: string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: {
    [token in string]: number;
  };
};

// Chat APIからのレスポンス(non stream版)
export type ChatResponse = {
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

export type ChatStreamResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: [
    {
      delta: { content?: string };
      index: number;
      finish_reason: 'stop' | null;
    }
  ];
};
