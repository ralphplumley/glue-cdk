import path = require('path')

import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue';
import { CfnCrawler, CfnJob, Schema } from '@aws-cdk/aws-glue';
import { PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam'

export class GlueCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    console.log("Scope: ", scope)
    console.log("id: ", id)

    super(scope, id, props)
    
    const myDb = new glue.Database(this, 'rp-test-db', {
      databaseName: 'rp-test-db'
    })

    new glue.Table(this, 'rp-MyTable', {
      database: myDb,
      tableName: 'rp-test-table',
      columns: [{
        name: 'col1',
        type: glue.Schema.STRING,
      }, {
        name: 'col2',
        type: glue.Schema.array(Schema.STRING),
        comment: 'col2 is an array of strings' // comments are optional
      }],
      dataFormat: glue.DataFormat.JSON
    })

    const role = new Role(this, 'rp-test-role', {
      assumedBy: new ServicePrincipal('glue.amazonaws.com') 
    })
    role.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: ['glue:*']
    }))

    new glue.CfnJob(this, 'rp-glue-job', {
      command: {
        name: "rp-glue-test-command-name"
      },
      role: 'rp-glue-test-role'
    })

    new CfnCrawler(this, 'rp-glue-test-crawler', {
      role: 'rp-glue-test-role',
      targets: {}
    })
  }
}
