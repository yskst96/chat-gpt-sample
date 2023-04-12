import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class ChatGptApiSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaRole = iam.Role.fromRoleArn(this, 'ChatGptLambdaRolen', 'arn:aws:iam::304359057226:role/service-role/myLambdaRole');

    const apiFunction = new NodejsFunction(this, 'ChatGptApiFunction', {
      handler: 'handler',
      entry: path.join(__dirname, '../lambda/api/index.ts'),
      role: lambdaRole,
    });

    apiFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedMethods: [HttpMethod.ALL],
        allowedOrigins: ['http://localhost:3000'],
      },
    });
  }
}
