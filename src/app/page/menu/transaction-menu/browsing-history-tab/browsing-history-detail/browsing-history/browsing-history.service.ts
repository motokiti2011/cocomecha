import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { catchError, Observable, of, map} from 'rxjs';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';

@Injectable({
  providedIn: 'root'
})
export class BrowsingHistoryService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = 'http://localhost:8080/v1/';


  /**
   * お気に入り情報を取得する
   * @returns
   */
  public getMyBrosingHistory(userId: string): Observable<browsingHistory[]> {
    return this.http.get<browsingHistory[]>(`${this.apiEndPoint + 'userbrowsinghistory/getuserbybrowsinghistory/' + userId}`);
  }

  /**
   * お気に入り情報を削除する
   * @param list
   */
  public deleteMyBrosingHistory(list: browsingHistory[]): Observable<number> {




    return this.http.post(this.apiEndPoint + 'userbrowsinghistory/deletebrowsinghistorylist', list, { observe: 'response' }).pipe(
      // HTTPステータスコードを戻す
      map((res: HttpResponse<any>) => res.status),
      // エラー時もHTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }
}
