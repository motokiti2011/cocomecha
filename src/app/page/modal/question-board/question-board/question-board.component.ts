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
  /** フォーム内容 */
  sernderMessage: string = '';
  /** 質問投稿ボタンdisible制御フラグ */
  isDisabled :boolean = true;
  /** 管理者区分 */
  adminDiv = true;
  /** 回答フラグ */
  anserDiv: boolean = false;
  /** 回答対象 */
  anserIndex = '';
  /** フォームプレスホルダーメッセージ */
  formPlaceholder = '質問はこちらに記入してください。'
  /** ボタンメッセージ */
  buttonMessage = '投稿する'

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
      serviceType: string,
      slipAdmin: boolean
    }
  ) { }

  ngOnInit(): void {
    console.log('初期データ：'+this.data);
    console.log(this.data);
    this.adminDiv = this.data.slipAdmin;
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
  sendMessageCheck() {
    if (this.sernderMessage != '') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  /**
   * 質問、回答ボタン押下時イベント
   */
  onSubmit() {
    if(this.anserDiv) {
      this.sendAnser();
    } else {
      this.sendQuestion();
    }
  }

  /**
   * 回答した場合のイベント
   */
  onAnser(index: number) {
    console.log(index);
    this.anserIndex = String(index)
    console.log(this.questionList);
    console.log(this.questionList[index]);
    this.anserDiv = true;
    console.log(this.anserDiv);
    this.formPlaceholder = '回答はこちらに記入してください。'
    this.buttonMessage = '回答する'
  }

  /**
   * 回答を止めるボタン押下時
   */
  onStopAnser() {
    this.anserDiv = false;
    this.anserIndex = '';
    this.sernderMessage = '';
    this.formPlaceholder = '質問はこちらに記入してください。'
    this.buttonMessage = '投稿する'
  }

  /**
   * 質問を投稿するボタン
   */
  sendQuestion() {
    if (_isNil(this.sernderMessage) || this.sernderMessage == '') {
      // 空文字の場合登録しない
      return;
    }

    this.service.sernderQuestion(
      this.data.userId, this.data.userName, this.data.serviceId ,this.data.serviceType, this.sernderMessage)
    .subscribe(result => {
      if(result.ResponseMetadata.HTTPStatusCode === 200) {
        // 質問情報のクリア
        this.sernderMessage = '';
        this.initGetSlipQa()
      } else {
        alert('登録に失敗しました')
      }
    });
  }

  /**
   * 回答ボタン押下時
   * @returns
   */
  sendAnser() {
    if(this.anserIndex == '') {
      alert('データが取得できませんでした。申し訳ございませんがもう一度操作してください。');
      this.onStopAnser();
      return;
    }
    if(this.sernderMessage == '') {
      alert('入力は必要です。');
      return
    }
    const index = Number(this.anserIndex);
    this.questionList[index].anserText = this.sernderMessage;
    this.service.anserQuestion(this.questionList[index]).subscribe(result => {
      if(result == 200) {
        this.onStopAnser();
        this.initGetSlipQa();
      } else {
        alert('登録に失敗ました。申し訳ございませんがもう一度操作してください。');
      }
    });
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

}
