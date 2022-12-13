import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { user } from 'src/app/entity/user';

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
          "useId": user.userId,
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





}
