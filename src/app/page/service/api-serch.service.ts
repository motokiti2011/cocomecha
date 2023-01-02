import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { slipQuestion } from 'src/app/entity/slipQuestion';
// import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { mechanicInfo } from 'src/app/entity/mechanicInfo';
import { officeInfo } from 'src/app/entity/officeInfo';

@Injectable({
  providedIn: 'root'
})
export class ApiSerchService {

  constructor(
    private http: HttpClient,
  ) { }


  private apiEndPoint: string = environment.EndPoint.apiEmdPoint + environment.EndPoint.apiVersion + '/serch';


  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public getUser(userId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "userId": userId,
        "userValidDiv": '0'
      }
    };
    return this.http.post<user>(this.apiEndPoint + '/userinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: user) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

    /**
     * CognitoユーザーIDをPKにユーザー情報をDynamoDBに登録する
     * @param user
     * @returns
     */
     public postUser(user: user): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "PUT",
        "Keys": {
          "userId": user.userId,
          "userValidDiv": user.userValidDiv,
          "corporationDiv": user.corporationDiv,
          "userName": user.userName,
          "mailAdress": user.mailAdress,
          "TelNo1": user.TelNo1,
          "TelNo2": user.TelNo2,
          "areaNo1": user.areaNo1,
          "areaNo2": user.areaNo2,
          "adress": user.adress,
          "postCode": user.postCode,
          "mechanicId": user.mechanicId,
          "officeId": user.officeId,
          "baseId": user.baseId,
          "officeRole": user.officeRole,
          "profileImageUrl": user.profileImageUrl,
          "Introduction": user.introduction,
          "updateUserId": user.updateUserId,
          "created": user.created,
          "updated": user.updated
        }
      };
      return this.http.post<user>(this.apiEndPoint + '/userinfo', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: user) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }


  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public getSlip(slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "GETSLIP",
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo/getslip', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: slipDetailInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

    /**
     * 伝票番号をPKに伝票情報をDynamoDBに登録する
     * @param user
     * @returns
     */
    public postSlip(data: slipDetailInfo): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "PUT",
        "Keys": {
          "slipNo": data.slipNo,
          "deleteDiv": data.deleteDiv,
          "category": data.category,
          "slipAdminUserId": data.slipAdminUserId,
          "adminDiv": data.adminDiv,
          "title": data.title,
          "areaNo1": data.areaNo1,
          "areaNo2": data.areaNo2,
          "price": data.price,
          "bidMethod": data.bidMethod,
          "bidderId": data.bidderId,
          "bidEndDate": data.bidEndDate,
          "explanation": data.explanation,
          "displayDiv": data.displayDiv,
          "processStatus": data.processStatus,
          "targetService": data.targetService,
          "targetVehicleId": data.targetVehicleId,
          "targetVehicleName": data.targetVehicleName,
          "targetVehicleInfo": data.targetVehicleInfo,
          "workAreaInfo": data.workAreaInfo,
          "preferredDate": data.preferredDate,
          "preferredTime": data.preferredTime,
          "completionDate": data.completionDate,
          "transactionCompletionDate": data.transactionCompletionDate,
          "thumbnailUrl": data.thumbnailUrl,
          "imageUrlList": data.imageUrlList,
          "messageOpenLebel": data.messageOpenLebel,
          "updateUserId": data.updateUserId,
          "created": new Date(),
          "updated": new Date()
        }
      };
      return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: slipDetailInfo) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }



    /**
     * CognitoユーザーIDをPKに履歴情報をDynamoDBに登録する
     * @param user
     * @returns
     */
    public postHistory(data: browsingHistory): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "PUT",
        "Keys": {
          "id": data.id,
          "userId": data.userId,
          "slipNo": data.slipNo,
          "title": data.title,
          "price": data.price,
          "whet": data.whet,
          "endDate": data.endDate,
          "imageUrl": data.imageUrl,
          "created": new Date(),
          "updated": new Date()

        }
      };
      return this.http.post<browsingHistory>(this.apiEndPoint + '/browsinghistory', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: browsingHistory) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }

    /**
     * CognitoユーザーIDをPKにお気に入り情報をDynamoDBに登録する
     * @param user
     * @returns
     */
    public postFavorite(data: userFavorite): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "PUT",
        "Keys": {
          "id": data.id,
          "userId": data.userId,
          "slipNo": data.slipNo,
          "title": data.title,
          "price": data.price,
          "whet": data.whet,
          "endDate": data.endDate,
          "imageUrl": data.imageUrl,
          "created": new Date(),
          "updated": new Date()
        }
      };
      return this.http.post<browsingHistory>(this.apiEndPoint + '/userfavorite', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: browsingHistory) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }

    /**
     * CognitoユーザーIDをPKにお気に入り情報をDynamoDBに登録する
     * @param user
     * @returns
     */
    public deleteFavorite(id: string): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "DELETE",
        "Keys": {
          "id": id
        }
      };
      return this.http.post<browsingHistory>(this.apiEndPoint + '/userfavorite', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: browsingHistory) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }

    /**
     * CognitoユーザーIDをPKにお気に入り情報をDynamoDBに登録する
     * @param user
     * @returns
     */
    public postQuestion(data: slipQuestion): Observable<any> {
      // リクエストボディ生成
      const body = {
        "OperationType": "PUT",
        "Keys": {
          "id": data.id,
          "slipNo": data.slipNo,
          "slipAdminUser": data.slipAdminUser,
          "senderId": data.senderId,
          "senderName": data.senderName,
          "senderText": data.senderText,
          "anserDiv": data.anserDiv,
          "anserText": data.anserText,
          "created": new Date(),
          "updated": new Date()
        }
      };
      return this.http.post<slipQuestion>(this.apiEndPoint + '/slipquestion', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: slipQuestion) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }


    // /**
    //  * 伝票メッセージ許可ユーザー情報にユーザーを追加する
    //  * @param user
    //  * @returns
    //  */
    // public postMessageReq(userId:string, userName:string, slipNo:string): Observable<any> {
    //   // リクエストボディ生成
    //   const body = {
    //     "OperationType": "MESSAGEREQ",
    //     "Keys": {
    //       "slipNo": slipNo,
    //       "userId": userId,
    //       "userName": userName
    //     }
    //   };
    //   return this.http.post<slipMegPrmUser>(this.apiEndPoint + '/slipmegprmuser/messageparmrequest', body).pipe(
    //     // 取得できた場合ユーザー情報を返却
    //     map((res: slipMegPrmUser) => res),
    //     // エラー時HTTPステータスコードを戻す
    //     catchError((err: HttpErrorResponse) => of(undefined))
    //   );
    // }

    // /**
    //  * メカニック情報を登録する
    //  * @param mechanic メカニック情報
    //  * @param officeDiv 工業区分
    //  * @returns
    //  */
    // public postMechanic(mechanic: mechanicInfo, officeDiv: boolean): Observable<any> {

    //   let operationType = 'INITMECHANIC'
    //   if(officeDiv) {
    //     operationType = 'INITMECHANICANDOFFICE'
    //   }
    //   // リクエストボディ生成
    //   const body = {
    //     "OperationType": operationType,
    //     "Keys": {
    //       'mechanicId': mechanic.mechanicId,
    //       'validDiv': mechanic.validDiv,
    //       'mechanicName': mechanic.mechanicName,
    //       'adminUserId': mechanic.adminUserId,
    //       'adminAddressDiv': mechanic.adminAddressDiv,
    //       'telList': mechanic.telList,
    //       'mailAdress': mechanic.mailAdress,
    //       'officeConnectionDiv': mechanic.officeConnectionDiv,
    //       'associationOfficeList': mechanic.associationOfficeList,
    //       'officeId': mechanic.officeId,
    //       'qualification': mechanic.qualification,
    //       'specialtyWork': mechanic.specialtyWork,
    //       'profileImageUrl': mechanic.profileImageUrl,
    //       'introduction': mechanic.introduction,
    //       'evaluationInfoIdList': mechanic.evaluationInfoIdList,
    //       'updateUserId': mechanic.updateUserId,
    //       'created': new Date(),
    //       'updated': new Date()
    //     }
    //   };
    //   return this.http.post<mechanicInfo>(this.apiEndPoint + '/mechanicinfo/initmechanicup', body).pipe(
    //     // 取得できた場合ユーザー情報を返却
    //     map((res: mechanicInfo) => res),
    //     // エラー時HTTPステータスコードを戻す
    //     catchError((err: HttpErrorResponse) => of(undefined))
    //   );
    // }

  /**
   * メカニックIDからメカニック情報を取得する。
   * @param mechanicId
   * @returns
   */
  public getMecha(mechanicId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "mechanicId": mechanicId
      }
    };
    return this.http.post<mechanicInfo>(this.apiEndPoint + '/mechanicinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: mechanicInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * メカニックIDからメカニック情報を取得する。
   * @param mechanicId
   * @returns
   */
  public getOfficeInfo(officeId: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "officeId": officeId
      }
    };
    return this.http.post<officeInfo>(this.apiEndPoint + '/mechanicinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: officeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


    // /**
    //  * メカニック情報を登録する
    //  * @param mechanic メカニック情報
    //  * @param officeDiv 工業区分
    //  * @returns
    //  */
    // public postFactory(officeInfo: officeInfo, userId: string, mechanicId: string| null): Observable<any> {

    //   // リクエストボディ生成
    //   const body = {
    //     "OperationType": 'PUT',
    //     "Keys": {
    //       'officeId': officeInfo.officeId,
    //       'officeName': officeInfo.officeName,
    //       'officeTel': officeInfo.officeTel,
    //       'officeMailAdress': officeInfo.officeMailAdress,
    //       'officeArea1': officeInfo.officeArea1,
    //       'officeArea': officeInfo.officeArea,
    //       'officeAdress': officeInfo.officeAdress,
    //       'officePostCode': officeInfo.officePostCode,
    //       'workContentList': officeInfo.workContentList,
    //       'businessHours': officeInfo.businessHours,
    //       'adminBaseId': officeInfo.adminBaseId,
    //       'baseInfoList': officeInfo.baseInfoList,
    //       'adminIdList': userId,
    //       'employeeList': mechanicId,
    //       'officePR': officeInfo.officePR,
    //       'officePRimageURL': officeInfo.officePRimageURL,
    //       'created': new Date(),
    //       'updated': new Date()
    //     }
    //   };
    //   return this.http.post<officeInfo>(this.apiEndPoint + '/officeinfo/initofficeup', body).pipe(
    //     // 取得できた場合ユーザー情報を返却
    //     map((res: officeInfo) => res),
    //     // エラー時HTTPステータスコードを戻す
    //     catchError((err: HttpErrorResponse) => of(undefined))
    //   );
    // }



}
