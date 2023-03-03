import { config } from `aws-sdk`;
import ssm from `aws-sdk/clients/ssm`;
config.update({ region: process.env.AWS_REGION || `us-east-1` });

var ssmHelper = {
  GetSSMParams: async function (environment,mseEnvironment,applicationName) {
    let ssmClient = new ssm({ region: process.env.AWS_REGION || `us-east-1` });
    let ssmPath = [
      `/ivr/{ENV}/common/`,
      `/ivr/{ENV}/{APPNAME}/`,
      `/ivr/{ENV}/{MSEENV}/{APPNAME}/`,
      `/ivr/{ENV}/{MSEENV}/siteappsettings`,
      `/ivr/{ENV}/{MSEENV}/siteconstants`,
    ];
    let ssmParams = [];

    try {
      for (const path of ssmPath) {
        path = path.replace(`{ENV}`, environment);
        path = path.replace(`{APPNAME}`, applicationName);
        path = path.replace(`{MSEENV}`, mseEnvironment);

        let params = {
          Path: path,
          WithDecryption: false,
          Recursive: true,
        };

        let data = await ssmClient.getParametersByPath(params).promise();
        ssmParams.push.apply(ssmParams, data.Parameters);
        while (data.NextToken) {
          params.NextToken = data.NextToken;
          data = await ssmClient.getParametersByPath(params).promise();
          ssmParams.push.apply(ssmParams, data.Parameters);
        }
      }
      global.SSMParamsList = ssmParams;
    } catch (error) {
      console.log(
        `Error occured while fetching the data from SSM. Error Message : - ${error.message}`
      );
    }
  },

  GetAppSetting : async function(keyName){
    if(SSMParamsList != null){
        for (const parameter of SSMParamsList) {
            if(parameter.Name.indexOf(keyName)>-1){
                try {
                    return JSON.parse(parameter.Value);
                } catch (error) {
                    return parameter.Value;
                }
            }
        }
    }
  }
};

export const SSMHelper = ssmHelper;
