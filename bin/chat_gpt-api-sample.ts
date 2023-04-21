#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatGptApiSampleStack } from '../lib/chat_gpt-api-sample-stack';
import { S3DeploymentStack } from '../lib/s3-deployment-stack';

const app = new cdk.App();
new ChatGptApiSampleStack(app, 'ChatGptApiSampleStack', {});
new S3DeploymentStack(app, 'ChatGptS3DeploymentStack', {});
