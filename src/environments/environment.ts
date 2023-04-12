// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '69qff3nsjsuvuj8ic425qjm18i',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:b4194079-a15c-4db5-99b4-83f571a67940',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_oEyp7Ab8a',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'hako-mecha-s3-7y75s1z7h8am-s3bucket-1wr46rkdtod1d',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://rr776s28sa.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://ardlh9fg39.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://oa5otzi1rj.execute-api.us-east-1.amazonaws.com/dev',
    /** 単体機能エンドポイント */
    apiEmdPointUNIQUE : 'https://4o8lu628uj.execute-api.us-east-1.amazonaws.com/dev',
    /** 伝票機能エンドポイント */
    apiEmdPointSLIPPROSESS : 'https://j6qrtkyab0.execute-api.us-east-1.amazonaws.com/dev',
    /** 認証エンドポイント */
    apiEmdAuth : 'https://j0fw8atwsl.execute-api.us-east-1.amazonaws.com/dev'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
