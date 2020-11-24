#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GlueCdkStack } from '../lib/glue-cdk-stack';

const app = new cdk.App();
new GlueCdkStack(app, 'GlueCdkStack');

app.synth()