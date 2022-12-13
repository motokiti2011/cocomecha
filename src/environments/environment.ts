// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '2qkuhukfcn46m3fvp1uqjk5m9l',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:af017d00-7d6e-4976-b0e1-5dd4f2cea523',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_hoEpbJvtO',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'coco10-s3-vyaemi7kop93-s3bucket-139pq7v2nvpd3',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://ywk23jrgv8.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://zxnt1q7sph.execute-api.us-east-1.amazonaws.com/dev'
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
