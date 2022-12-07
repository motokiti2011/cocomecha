// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: 'd9efl3btvamhhu2uf77ghud5r',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:c6606fc8-c031-44c8-9f79-8b2bd8096742',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_nBdi9IWXv',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'coco9-s3-1erwjsxo8kmbu-s3bucket-qurkd9uanh07',
  },
  EndPoint: {
    /** APIエンドポイント */
    apiEmdPoint: 'https://j5l04n4uk7.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://gvcdez0n1g.execute-api.us-east-1.amazonaws.com/dev'
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
