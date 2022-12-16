// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '2el6oqanqtvpb25dqfagcl85i2',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:7d7b4047-3acc-4726-9b5c-f33ec3b3e7d6',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_rvHhBv9Jw',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'cocomecha-s3-crvvgx6v4ryb-s3bucket-1tgr4ullzqmxg',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://7960fitip4.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://cac8rxnn1j.execute-api.us-east-1.amazonaws.com/dev'
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
