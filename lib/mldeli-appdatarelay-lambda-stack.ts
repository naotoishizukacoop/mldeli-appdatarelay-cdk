import { Stack, aws_iam as iam } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppStackProps } from "types";

export class IamStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // --------------------------------------------------------------
    // スタックにPermissionsBoundary を適用
    //

    const permissionsBoundaryPolicy = iam.ManagedPolicy.fromManagedPolicyArn(
      this,
      "builders-delegated-iam-boundary",
      `arn:aws:iam::${props.account}:policy/builders-delegated-iam-boundary`,
      //permissionsBoundaryArn
    );

    iam.PermissionsBoundary.of(this).apply(permissionsBoundaryPolicy);
        
    
    // --------------------
    // create-mldeli-file-lambda
    //
    const createmldeliLambdaName = "create-mldeli-file";
    const createMldeliFileRoleName = `${props.env}-${createMldeliFileRoleName}-role`;
    new iam.Role(this, createmldeliLambdaName, {
      roleName: createmldeliLambdaName,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      permissionsBoundary: permissionsBoundaryPolicy,
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaExecute"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
      ],
    });

  }
}
export class MldeliAppdatarelayLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MldeliAppdatarelayLambdaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
