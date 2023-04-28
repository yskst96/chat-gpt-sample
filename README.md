# chat-GPTのAPI利用サンプル

openAIからはいろいろなAPIが提供されているがchat-GPTで利用されているAPIは以下  
https://platform.openai.com/docs/api-reference/chat  
現状はgpt-4の利用は不可  

[4/28追記]  
  waitlistに申請して3週間ほどでgpt-4が利用可能になった

上記APIを使ったAPIをLambda(FunctionURL)でホスト  

サンプルアプリ  
http://chat-gpt-sample.s3-website-ap-northeast-1.amazonaws.com 

## API仕様について

chatAPIでは大まかに2種類のレスポンス形式がある

###  Non Stream

デフォルトはこっち。  
1回リクエスト送ると1回で全体のレスポンスが返ってくる。
リクエストで送った内容によっては結構レスポンス時間がかかる。

ソース
```lambda/api```  
APIエンドポイント  
POST https://h2vbnfmpiblp4fislyelggsns40arwhz.lambda-url.ap-northeast-1.on.aws/

request sample
```
curl https://h2vbnfmpiblp4fislyelggsns40arwhz.lambda-url.ap-northeast-1.on.aws/ \
  -X
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "messages": [{"role": "user", "content": "こんにちは！"}]
  }'
```

### Stream

ChatGPT APIの```stream```パラメータをtrueにするとこちらの形式になる
APIからのレスポンスが細切れのChunkで返却されてくる。クライアント側で受け取ったchunkをガッチャンコして扱う。  
本家chatGPTのようにユーザーに結果を早く返して、インクリメンタルに結果表示されていくようなUIを実現したい場合こちらを使う。
サーバからのAPIレスポンスはSSE [ServerSentEvents](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)形式のイベントとして送られてくる。
中身もNon Streamとは少し異なっているため要注意。  
ChunkごとにBuuffer⇒String⇒Jsonと変換する必要があるため若干扱いが面倒くさい。
  
参照：https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb

サンプル
```lambda/stream-api```  
APIエンドポイント  
https://k74zotfdcbz64fcd7srvjx4dvu0wsfvn.lambda-url.ap-northeast-1.on.aws/

request sample
```
same as non stream
```