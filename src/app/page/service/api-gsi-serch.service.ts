import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { slipMessageInfo } from 'src/app/entity/slipMessageInfo';
import { userFavorite } from 'src/app/entity/userFavorite';

@Injectable({
  providedIn: 'root'
})
export class ApiGsiSerchService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = environment.EndPoint.apiEmdPointGsi + environment.EndPoint.apiGsiVersion + '/indexserch';


  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
  public initSerchSlip(serchArea1: string, serchArea2: string, serchCategory: string ): Observable<any> {

    let operation = '';

    // 引数設定状況によって検索条件を組み合わせる
    if(serchArea1 == '0') {
      operation = 'CATEGORY-INDEX';
    } else {
      operation = 'AREANO1-INDEX';
    }

    // リクエストボディ生成
    const body = {
      "IndexType": operation,
      "Keys": {
        "areaNo1": serchArea1,
        "areaNo2": serchArea2,
        "category": serchCategory
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザーIDからユーザー情報を取得する。
   * @param userId
   * @returns
   */
    public indexSerchSlip(serchArea1: string, serchArea2: string, serchCategory: string, subject: string ): Observable<any> {

      // リクエストボディ生成
      const body = {
        "IndexType": subject,
        "Keys": {
          "areaNo1": serchArea1,
          "areaNo2": serchArea2,
          "category": serchCategory
        }
      };
      return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: any) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }

  /**
   * ユーザーIDからお気に入り情報を取得
   * @param userId
   * @returns
   */
  public serchFavorite(userId: string ): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'USERID-INDEX',
      "Keys": {
        "userId": userId
      }
    };
    return this.http.post<userFavorite>(this.apiEndPoint + '/userfavorite', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: userFavorite) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }

  /**
   * ユーザーIDからお気に入り情報を取得
   * @param userId
   * @returns
   */
    public serchBrowsingHistory(userId: string ): Observable<any> {

      // リクエストボディ生成
      const body = {
        "IndexType": 'USERID-INDEX',
        "Keys": {
          "userId": userId
        }
      };
      return this.http.post<slipDetailInfo>(this.apiEndPoint + '/browsinghistory', body).pipe(
        // 取得できた場合ユーザー情報を返却
        map((res: any) => res),
        // エラー時HTTPステータスコードを戻す
        catchError((err: HttpErrorResponse) => of(undefined))
      );
    }


  /**
   * ユーザーIDから伝票情報を取得
   * @param userId
   * @returns
   */
  public serchSlipAuthCheck(userId: string ): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPADMINUSEID-INDEX',
      "Keys": {
        "userId": userId
      }
    };
    return this.http.post<slipDetailInfo>(this.apiEndPoint + '/slipdetailinfo', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: any) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }


  /**
   * 伝票番号から伝票質問情報を取得
   * @param slipNo
   * @returns
   */
  public serchSlipQuestion(slipNo: string ): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPNO-INDEX',
      "Keys": {
        "slipNo": slipNo
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
   * 伝票番号から伝票質問情報を取得
   * @param slipNo
   * @returns
   */
  public serchSlipMessage(slipNo: string ): Observable<any> {

    // リクエストボディ生成
    const body = {
      "IndexType": 'SLIPNO-INDEX',
      "Keys": {
        "slipNo": slipNo
      }
    };
    return this.http.post<slipMessageInfo>(this.apiEndPoint + '/slipmessage', body).pipe(
      // 取得できた場合ユーザー情報を返却
      map((res: slipMessageInfo) => res),
      // エラー時HTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(undefined))
    );
  }





}
