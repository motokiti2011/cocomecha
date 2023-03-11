// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  Auth: {
    /** CognitoClientId */
    clientId: '3kr6gbd72g65eua0l066omt41h',
    /** CognitoIdentityPoolId */
    identityPoolId: 'us-east-1:6747c8ee-9abf-4c49-afac-9fb196143d5f',
    /** CognitoUserPoolId */
    userPoolId: 'us-east-1_TkryMD5xJ',
    /** Region */
    region: 'us-east-1',
  },
  Buket: {
    /** S3UploadBucketName */
    bucketName: 'hako-mecha-s3-1na2ce48e2jz1-s3bucket-14qyhraoerpxd',
  },
  EndPoint: {
    apiVersion: '/v1',
    apiGsiVersion: '/v1',
    apiCheckVersion: '/v1',
    /** APIエンドポイント */
    apiEmdPoint: 'https://qvomsmtrxg.execute-api.us-east-1.amazonaws.com/dev',
    /** GsiAPIエンドポイント */
    apiEmdPointGsi: 'https://7gp61qriwa.execute-api.us-east-1.amazonaws.com/dev',
    /** チェックエンドポイント */
    apiEmdPointCheck: 'https://qxx108xwbl.execute-api.us-east-1.amazonaws.com/dev',
    /** 単体機能エンドポイント */
    apiEmdPointUNIQUE : 'https://112xzhdi6h.execute-api.us-east-1.amazonaws.com/dev',
    /** 伝票機能エンドポイント */
    apiEmdPointSLIPPROSESS : 'https://lsj5cixeyi.execute-api.us-east-1.amazonaws.com/dev'
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
