import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { userFavorite } from 'src/app/entity/userFavorite';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';

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
          "officeId": user.officeId,
          "baseId": user.baseId,
          "officeRole": user.officeRole,
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
     * CognitoユーザーIDをPKに履歴情報をDynamoDBに登録する
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
          "slipAdminUserName":data.slipAdminUserName,
          "slipAdminOffice": data.slipAdminOffice,
          "slipAdminOfficeName": data.slipAdminOfficeName,
          "slipAdminBaseId": data.slipAdminBaseId,
          "slipAdminBaseName": data.slipAdminBaseName,
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
          "imageUrlList": data.imageUrlList,
          "messageOpenLebel": data.messageOpenLebel,
          "updateUserId": data.updateUserId,
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


}
