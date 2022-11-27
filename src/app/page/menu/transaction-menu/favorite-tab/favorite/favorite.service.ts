import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { catchError, Observable, of, map} from 'rxjs';
import { userFavorite } from 'src/app/entity/userFavorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiEndPoint: string = 'http://localhost:8080/v1/';


  /**
   * お気に入り情報を取得する
   * @returns 
   */
  public getFavoriteList(userId: string): Observable<userFavorite[]> {
    return this.http.get<userFavorite[]>(`${this.apiEndPoint + 'favorite/getuserbyfavorite/' + userId}`);
  }

  /**
   * お気に入り情報を削除する
   * @param list 
   */
  public deleteMyFavorite(list: userFavorite[]): Observable<number> {
    return this.http.post(this.apiEndPoint + 'favorite/deletefavoritelist', list, { observe: 'response' }).pipe(
      // HTTPステータスコードを戻す
      map((res: HttpResponse<any>) => res.status),
      // エラー時もHTTPステータスコードを戻す
      catchError((err: HttpErrorResponse) => of(err.status))
    );
  }

}
