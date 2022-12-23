import { Injectable } from '@angular/core';
import { catchError, Observable, of, } from 'rxjs';
import { map } from 'rxjs/operators';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { loginUser } from 'src/app/entity/loginUser';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';


@Injectable({
  providedIn: 'root'
})
export class QuestionBoardService {



  constructor(
    private http: HttpClient,
    private apiService: ApiSerchService,
  ) { }

  /**
   * 解答状況を確認し設定を行う
   * @param slipQuestion
   * @param param1
   */
  public anserCheck(slipQuestion: slipQuestion[]): slipQuestion[] {
    let count = 1;
    slipQuestion.forEach(data => {
      data.id = count;
      // 未回答の場合解答メッセージを設定する。
      if (data.anserDiv == '0') {
        data.anserText = '未回答';
      } else if(data.anserDiv == ''
      && data.anserText =='') {
        data.anserText = '未回答';
      }
      count = count + 1;
    });
    return slipQuestion;
  }

  /**
   * 伝票に紐づく質問情報を登録する。
   * @param slipNo
   * @returns
   */
  public sernderQuestion(user:loginUser,slipNo: string,text: string): Observable<HttpResponse<any>> {
    const data = this.createQuestion(user, slipNo, text)
    return this.apiService.postQuestion(data)
    // return this.http.post(this.apiEndPoint + 'slipquestion/postslipquestion', data, { observe: 'response' });
  }

  /**
   * 登録用データを作成する。
   * @param user
   * @param slipNo
   * @param text
   * @returns
   */
  private createQuestion(user: loginUser, slipNo: string, text: string): slipQuestion {
    const data:slipQuestion = {
      id: 0,
      slipNo: slipNo,
      slipAdminUser: '',
      senderId: user.userId,
      senderName: user.userName,
      senderText: text,
      anserDiv: '0',
      anserText: ''
    }
    return data;
  }



}


