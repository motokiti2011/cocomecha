import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, } from '@angular/common/http';
import { catchError, Observable, of, } from 'rxjs';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { map } from 'rxjs/operators';
import { userMyList } from 'src/app/entity/userMyList';

@Injectable({
  providedIn: 'root'
})
export class ServiceDetailService {

  private apiEndPoint: string = 'http://localhost:8080/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * 詳細表示する伝票情報を取得する
   * @param id 
   * @returns 
   */
  public getService(id: string): Observable<slipDetailInfo[]> {
    return this.http.get<slipDetailInfo[]>(`${this.apiEndPoint + 'slipdetail/' + id}`);
  }

  // /**
  // * 詳細表示する伝票情報を取得する
  // * @param slipDetail
  // * @returns 
  // */
  // public addMyList(slip: slipDetail): Observable<number> {
  //   // 伝票情報からマイリスト情報登録用データを生成する
  //   const myList :userMyList = {
  //     id: '',
  //     slipNo: slip.slipNo,
  //     userId: slip.userId,
  //     title: slip.title,
  //     category: slip.category,
  //     area: slip.area,
  //     price: slip.price,
  //     bidMethod: slip.bidMethod,
  //     bidderId: slip.bidderId,
  //     bidEndDate: slip.bidEndDate,
  //     explanation: slip.explanation,
  //     displayDiv: slip.displayDiv,
  //     preferredDate: slip.preferredDate,
  //     preferredTime: slip.preferredTime,
  //     completionDate: slip.completionDate,
  //     deleteDiv: slip.deleteDiv,
  //     imageUrl: slip.imageUrl
  //   }
  //   console.log(myList.imageUrl);
  //   return this.http.post(this.apiEndPoint + 'usermylist/postmylist', myList, { observe: 'response' })
  //     .pipe(
  //       // HTTPステータスコードを戻す
  //       map((res: HttpResponse<any>) => res.status),
  //       // エラー時もHTTPステータスコードを戻す
  //       catchError((err: HttpErrorResponse) => of(err.status))
  //     );    
  // }
  
}
