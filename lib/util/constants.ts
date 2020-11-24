import { Runtime } from "@aws-cdk/aws-lambda"
import { Duration } from "@aws-cdk/core"

export class Constants {
  public static readonly PYTHON_RUNTIME: Runtime = Runtime.PYTHON_3_7
  public static readonly LAMBDA_HANDLER_ENTRYWAY: string = 'lambda_function.lambda_handler'
  public static readonly LAMBDA_DEFAULT_TIMEOUT: Duration = Duration.minutes(15)
}