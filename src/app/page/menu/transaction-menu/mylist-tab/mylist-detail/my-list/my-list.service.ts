import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { catchError, Observable, of, map } from 'rxjs';
import { userMyList, dispUserMyList, MylistCategory, MylistCategoryMessage } from 'src/app/entity/userMyList';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MyListService {

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  private apiEndPoint: string = 'http://localhost:8080/v1/';

  /**
   * マイリスト情報を取得
   * @param userId 
   * @returns 
   */
  public getMyList(userId: string): Observable<userMyList[]> {
    return this.http.get<userMyList[]>(`${this.apiEndPoint + 'usermylist/getusermylisygroup/' + userId}`);
  }

  /**
   * 取得したマイリスト情報を表示用に加工する
   * @param userMyList 
   * @returns 
   */
  public displayFormatdisplayFormat(userMyList: userMyList[]): dispUserMyList[] {
    let resultList: dispUserMyList[] = [];
    userMyList.forEach(data => {
      let dispContents: dispUserMyList = {
        userId: data.userId,
        slipNo: data.slipNo,
        serviceTitle: data.serviceTitle,
        category: data.category,
        dispCategory: this.dispCategoryFormat(data.category),
        message: data.message,
        readDiv: data.readDiv,
        dispRead: this.readOrNoread(data.readDiv),
        messageDate: data.messageDate,
        dispMessageDate: String(formatDate(data.messageDate, "yy/MM/dd HH:mm", this.locale)),
        messageOrQuastionId: data.messageOrQuastionId,
        bidderId: data.bidderId,
        deleteDiv: data.deleteDiv
      }
      resultList.push(dispContents);
    });
    return resultList;
  }


  /**
   * 既読・未読を切替
   * @param data 
   * @returns 
   */
  private readOrNoread(data: string): string {
    if (data == '0') {
      return '未読';
    }
    return '既読';
  }

  /**
   * カテゴリーを表示用に加工する
   * @param category 
   */
  public dispCategoryFormat(category: string): string {
    let msg = '';
    switch (category) {
      case MylistCategory.operationMessage:
        return MylistCategoryMessage.OPERATION_MSG;
      case MylistCategory.fromMessage:
        return MylistCategoryMessage.FORM_MSG;
      case MylistCategory.anserMessage:
        return MylistCategoryMessage.ANSER_MSG;
      case MylistCategory.adminQuestion:
        return MylistCategoryMessage.ADMIN_QA;
      case MylistCategory.adminSlipBid:
        return MylistCategoryMessage.ADMIN_SLIP_BIT;
      case MylistCategory.adminSlipQuote:
        return MylistCategoryMessage.ADMIN_SLIP_QUOTO;
      default:
        return '';
    }



  }




}
