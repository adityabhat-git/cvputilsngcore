import { SSMHelper } from "./ssm-helper/ssmHelper";

process.env.SERVERLESS = process.env.SERVERLESS || `true`;
process.env.ENVIRONMENT = process.env.ENVIRONMENT || `qa`;
process.env.SSMSWITCH = process.env.SSMSWITCH || `true`;
process.env.MSEENV = process.env.MSEENV || `env-b`;
process.env.APPNAME = process.env.APPNAME || `cvputilsnextgencore`;
process.env.PLATFORM = process.env.PLATFORM || `ivr`;
process.env.COMMON = process.env.COMMON || `common`;
process.env.AWS_REGION = process.env.AWS_REGION || `us-east-1`;

SSMHelper.GetSSMParams(process.env.ENVIRONMENT,process.env.MSEENV,process.env.APPNAME);
let configuration_type = SSMHelper.GetAppSetting(`Configuration_Type`);
console.log(configuration_type);
