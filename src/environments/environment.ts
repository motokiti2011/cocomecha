// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '3fp96ej0i3k7u6u461qosog1ki',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:1bffe1b3-7b95-4967-a019-49d08c200a65',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_pdVRtrhXQ',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'yoko-mecha-s3-11jnndbc2deax-s3bucket-1sywb8y3vlk27',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://f0co2gp3te.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://81y4cb4916.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://sxzipk5at9.execute-api.us-east-1.amazonaws.com/dev'

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
