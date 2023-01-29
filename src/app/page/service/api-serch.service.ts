import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { formatDate } from '@angular/common';

import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { mechanicInfo } from 'src/app/entity/mechanicInfo';
import { officeInfo } from 'src/app/entity/officeInfo';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { slipMegPrmUser } from 'src/app/entity/slipMegPrmUser';
import { userVehicle } from 'src/app/entity/userVehicle';

@Injectable({
  providedIn: 'root'
})
export class ApiSerchService {

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
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
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
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
      "OperationType": "POST",
      "Keys": {
        "id": data.id,
        "userId": data.userId,
        "slipNo": data.slipNo,
        "title": data.title,
        "price": data.price,
        "whet": data.whet,
        "endDate": data.endDate,
        "imageUrl": data.imageUrl,
        "serviceType": data.serviceType,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))

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
      "OperationType": "POST",
      "Keys": {
        "id": data.id,
        "userId": data.userId,
        "slipNo": data.slipNo,
        "title": data.title,
        "price": data.price,
        "whet": data.whet,
        "endDate": data.endDate,
        "imageUrl": data.imageUrl,
        "serviceType": data.serviceType,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
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
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<slipQuestion>(this.apiEndPoint + '/slipquestion', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: slipQuestion) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

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
    return this.http.post<officeInfo>(this.apiEndPoint + '/officeinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: officeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * 伝票メッセージ情報を更新する。
   * @param mechanicId
   * @returns
   */
  public postMessage(message: slipMessageInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "messageId": message.messageId,
        "slipNo": message.slipNo,
        "displayOrder": message.displayOrder,
        "userId": message.userId,
        "sendUserName": message.sendUserName,
        "comment": message.comment,
        "sendAdressId": message.sendAdressId,
        "logicalDeleteDiv": message.logicalDeleteDiv,
        "created": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale)),
        "updated": String(formatDate(new Date, "yy/MM/dd HH:mm", this.locale))
      }
    };
    return this.http.post<slipMessageInfo>(this.apiEndPoint + '/slipmessageinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: slipMessageInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



  /**
   * 伝票メッセージ許可ユーザー情報を取得する。
   * @param mechanicId
   * @returns
   */
  public getSlipMegPrmUser(slipNo: string): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "QUERY",
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<slipMegPrmUser>(this.apiEndPoint + '/slipmegprmuser', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: slipMegPrmUser) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * ユーザー車両情報を登録する
   * @param mechanicId
   * @returns
   */
  public postUserVehicle(data: userVehicle): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "POST",
      "Keys": {
        "vehicleId": '',
        "userId": data.userId,
        "vehicleName": data.vehicleName,
        "vehicleNo": data.vehicleNo.serialNum,
        "chassisNo": data.chassisNo,
        "designatedClassification": data.designatedClassification,
        "coler": data.coler,
        "colerNo": data.colerNo,
        "mileage": data.mileage,
        "firstRegistrationDate": data.firstRegistrationDate,
        "InspectionExpirationDate": data.inspectionExpirationDate,
        "updateUserId": data.userId
      }
    };
    return this.http.post<userVehicle>(this.apiEndPoint + '/uservehicleinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: userVehicle) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザー車両情報を登録する
   * @param mechanicId
   * @returns
   */
  public postOffice(data: officeInfo): Observable<any> {
    // リクエストボディ生成
    const body = {
      "OperationType": "PUT",
      "Keys": {
        "officeId":  data.officeId,
        "officeName": data.officeName,
        "officeTel": data.officeTel,
        "officeMailAdress": data.officeMailAdress,
        "officeArea1": data.officeArea1,
        "officeArea": data.officeArea,
        "officeAdress": data.officeAdress,
        "officePostCode": data.officePostCode,
        'workContentList' : data.workContentList,
        "businessHours": data.businessHours,
        "adminBaseId": data.adminBaseId,
        "baseInfoList": data.baseInfoList,
        "adminIdList": data.adminIdList,
        "employeeList": data.employeeList,
        "officePR": data.officePR,
        "officePRimageURL": data.officePRimageURL,
        "officeFormList": data.officeFormList,
        "created": data.created,        
      }
    };
    return this.http.post<officeInfo>(this.apiEndPoint + '/officeinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: officeInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }



}
