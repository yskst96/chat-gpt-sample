import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as path from 'path';

export class S3DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, 'ChatGptWebBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      bucketName: 'chat-gpt-sample',
    });

    const directoryAsset = new s3_deployment.BucketDeployment(this, 'ChatGptDeployment', {
      sources: [s3_deployment.Source.asset(path.join(__dirname, '../client/dist'))],
      destinationBucket: websiteBucket,
    });
  }
}
