// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '5lbffbtojugq5fajq63jt370b6',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:73732d87-b89e-4421-ac2c-bc26bc6e4722',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_Ir9PYjnNP',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'cocomecha-s3-13nag8xo2toim-s3bucket-54ckxb3h1is8',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: ' https://5oyq7a36e0.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://h93tmoudv2.execute-api.us-east-1.amazonaws.com/dev'
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
