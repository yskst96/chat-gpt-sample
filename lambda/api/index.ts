import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log(event);
  return {
    body: 'ok',
    statusCode: 200,
  };
};
