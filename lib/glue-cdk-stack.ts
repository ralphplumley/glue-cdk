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
    
    const myDb = new glue.Database(this, 'rp-glue-test-db', {
      databaseName: 'rp-glue-test-db'
    })

    const table = new glue.Table(this, 'rp-glue-test-table', {
      database: myDb,
      tableName: 'rp-glue-test-table',
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

    const role = new Role(this, 'rp-glue-test-role', {
      assumedBy: new ServicePrincipal('glue.amazonaws.com') 
    })
    role.addToPolicy(new PolicyStatement({
      resources: ["*"],
      actions: ["glue:*"],
    }))

    new glue.CfnJob(this, 'rp-glue-test-job', {
      command: {
        name: "rp-glue-test-command-name"
      },
      role: role.roleArn
    })

    new CfnCrawler(this, 'rp-glue-test-crawler', {
      role: role.roleArn,
      schemaChangePolicy: {
        deleteBehavior: 'LOG'
      },
      targets: {
        catalogTargets: [{ 
          databaseName: myDb.databaseName,
          tables: [table.tableName]
        }]
      }
    })
  }
}
