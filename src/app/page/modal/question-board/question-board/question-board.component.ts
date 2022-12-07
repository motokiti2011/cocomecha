import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionBoardService } from './question-board.service';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { isNil as _isNil } from 'lodash';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';

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
  /** アクセスユーザー */
  user: loginUser = { userId: '', userName: '' };
  /** 質問投稿ボタンdisible制御フラグ */
  isDisabled :boolean = true;
  

  constructor(
    public _dialogRef: MatDialogRef<QuestionBoardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: string,
    private service: QuestionBoardService,
    private auth: AuthUserService,
  ) { }

  ngOnInit(): void {
    // 認証情報確認
    this.auth.user$.subscribe(login => {
      if (login?.userId !== undefined) {
        this.user = login;
      }
    });
    this.slipNo = this.data;
    // 表示情報取得
    this.service.getSlipQuestion(this.data).subscribe(data => {
      console.log(data);
      if (data.length !== 0) {
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
    if(this.user.userId == '') {
      return;
    }

    if (!_isNil(this.user.userId)) {
      this.service.sernderQuestion(this.user, this.slipNo,this.sernderQuestion)
      .subscribe(data => {
        if(data.body != null) {
          this.questionList.push(data.body);
          this.questionList = this.service.anserCheck(this.questionList);
        }
      });
    }
  }


  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }

}
