import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionBoardService } from './question-board.service';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { isNil as _isNil } from 'lodash';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
@Component({
  selector: 'app-question-board',
  templateUrl: './question-board.component.html',
  styleUrls: ['./question-board.component.scss']
})
export class QuestionBoardComponent implements OnInit {

  /** 伝票番号 */
  slipNo = '';
  /** 質問リスト */
  questionList: slipQuestion[] = [];
  /** 表示区分 */
  dispDiv: boolean = false;
  /** 表示区分 */
  noneMessage: string = 'このサービスへの質問は0件です。';
  /** 質問内容 */
  sernderQuestion: string = '';
  /** 質問投稿ボタンdisible制御フラグ */
  isDisabled :boolean = true;


  constructor(
    public _dialogRef: MatDialogRef<QuestionBoardComponent>,
    private service: QuestionBoardService,
    private auth: AuthUserService,
    private cognito: CognitoService,
    private apiGsiService: ApiGsiSerchService,
    @Inject(MAT_DIALOG_DATA)
    public data:{
      serviceId: string,
      userId: string,
      userName: string,
      serviceType: string
    }
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.initGetSlipQa();
  }

  /**
   * 表示情報を取得する
   */
  private initGetSlipQa() {
    // 表示情報取得
    this.apiGsiService.serchSlipQuestion(this.data.serviceId).subscribe(data => {
      if(data.length !== 0) {
        this.questionList = this.service.anserCheck(data);
        this.dispDiv = true;
      } else {
        this.dispDiv = false;
      }
    });

  }



  /**
   * 質問入力フォームが編集された際の監視イベント
   */
  sendQuest() {
    if (this.sernderQuestion != '') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * 質問を投稿するボタン
   */
  onSendQuestion() {
    if (_isNil(this.sernderQuestion) || this.sernderQuestion == '') {
      // 空文字の場合登録しない
      return;
    }

    this.service.sernderQuestion(
      this.data.userId, this.data.userName, this.data.serviceId ,this.data.serviceType, this.sernderQuestion)
    .subscribe(result => {
      if(result.ResponseMetadata.HTTPStatusCode === 200) {
        // 質問情報のクリア
        this.sernderQuestion = '';
        this.initGetSlipQa()
      } else {
        alert('登録に失敗しました')
      }
    });
  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

}
