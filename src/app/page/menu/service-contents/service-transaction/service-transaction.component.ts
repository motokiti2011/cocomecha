import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceTransactionService } from './service-transaction.service';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { messageOpenLevel, openLevel } from 'src/app/entity/messageOpenLevel';
import { slipDetailInfo, defaultSlip} from 'src/app/entity/slipDetailInfo';
import { QuestionBoardComponent } from 'src/app/page/modal/question-board/question-board/question-board.component';
import { OpenLevelComponent } from 'src/app/page/modal/open-level/open-level/open-level.component';
import { MessagePrmReqComponent } from 'src/app/page/modal/message-prm-req/message-prm-req/message-prm-req.component';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { CognitoService } from 'src/app/page/auth/cognito.service';


@Component({
  selector: 'app-service-transaction',
  templateUrl: './service-transaction.component.html',
  styleUrls: ['./service-transaction.component.scss']
})
export class ServiceTransactionComponent implements OnInit {

  /** 表示伝票番号 */
  dispSlipId: string = '';
  /** 伝票タイトル */
  dispTitle = '';
  /** 伝票日付 */
  dispYmd = '';
  /** 伝票価格 */
  dispPrice = '';
  /** 伝票地域 */
  dispArea = '';
  /** 伝票説明 */
  dispExplanation = '';
  /** 管理者フラグ */
  adminUserDiv: boolean = false;
  /** 一部公開フラグ */
  openDiv: boolean = false;
  /**  非公開フラグ　*/
  privateDiv: boolean = false;
  /** 許可済ユーザー */
  parmUserDiv = false;
  /** アクセスユーザー情報 */
  acsessUser = { userId: '', userName: '' }
  /** 伝票情報 */
  slip: slipDetailInfo = defaultSlip;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: ServiceTransactionService,
    private auth: AuthUserService,
    public questionBoardModal: MatDialog,
    public modal: MatDialog,
    private cognito: CognitoService
  ) { }

  ngOnInit(): void {
    // 伝票表示情報取得反映
    this.route.queryParams.subscribe(params => {
      this.dispSlipId = params['slipNo'];
      console.log(params['slipNo']);
      console.log(params['status']);
      this.service.getService(this.dispSlipId).subscribe(data => {
        this.slip = data[0];
        this.dispTitle = this.slip.title;
        this.dispYmd = this.slip.completionDate;
        this.dispPrice = this.slip.price;
        this.dispArea = this.service.areaNameSetting(this.slip.areaNo1);
        this.dispExplanation = this.slip.explanation;
        this.initChatArea(this.slip);
      });
    });
  }

  /**
   * チャットエリアの表示設定を行う
   */
  private initChatArea(slip: slipDetailInfo) {
    // 認証ユーザー情報取得
    const user = this.cognito.initAuthenticated();
    if(user !== null) {
      this.setAcsessUser();
      this.acsessUser.userId = user;
      // 管理者判定
      this.service.slipAuthCheck(this.dispSlipId, user).subscribe(result => {
        // 取得できない場合
        if (result.length === 0) {
          // 閲覧者設定を行う
          this.browseSetting(slip, user);
        } else {
          this.adminUserDiv = true;
        }
      });
    } else {
        // ダイアログ表示（ログインしてください）し前画面へ戻る
        const dialogData: messageDialogData = {
          massage: 'ログインが必要になります。',
          closeFlg: false,
          closeTime: 0,
          btnDispDiv: true
        }
        const dialogRef = this.modal.open(MessageDialogComponent, {
          width: '300px',
          height: '150px',
          data: dialogData
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          this.onReturn();
          return;
        });
    }
  }

/**
 * subjectのユーザー情報を設定する有効期限切れの場合メインメニューに戻る
 */
private setAcsessUser() {
  this.auth.user$.subscribe(data => {
    if(data != null) {
      this.acsessUser = data;
    } else {
      this.router.navigate(["mein-menu"]);
    }
  })
}


  /**
   * 閲覧者設定
   */
  private browseSetting(slip: slipDetailInfo, userId: string) {
    if (slip.messageOpenLebel == '2') {
      // 一部公開の場合許可済みユーザーかを確認
      this.service.isSlipUserPermission(slip.slipNo, userId).subscribe(re => {
        if (re) {
          // 許可済みユーザーの場合チャット許可する

        } else {
          // 未許可の場合　一時許可ボタンを表示
          this.openDiv = true;
          // チャット未許可表示を行う

        }
      });
    } else if (slip.messageOpenLebel == '3') {
      // 非公開の場合　非公開表示をする
      this.privateDiv = true;
    }
  }

  /**
   * 質問モーダルを展開する
   */
  onQuestion() {
    this.questionBoardModal.open(QuestionBoardComponent, {
      width: '600px',
      height: '800px',
      data: this.dispSlipId
    });
  }

  /**
   * メッセージ公開レベルを設定する(伝票管理者用)
   */
  onOpenLevelSet() {
    const dialogRef = this.modal.open(OpenLevelComponent, {
      width: '50vh',
      height: '50vh',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.service.postMessageLevel(this.slip, String(result)).subscribe(data => {
        console.log(data.messageOpenLebel)
      });
    });
  }

  /**
   * メッセージ許可申請を行う(伝票閲覧者用)
   */
  onMsgPrmReq() {
    // 許可済ユーザーまたは申請中の場合キャンセル確認を行う
    // 取得
    let title = '';
    if (this.parmUserDiv) {
      title = '申請を取り消しますか？'
    }
    const dialogRef = this.modal.open(MessagePrmReqComponent, {
      width: '400px',
      height: '200px',
      data: this.parmUserDiv
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        // メッセージ許可ユーザーの更新をおこなう（取消、追加はサーバーサイドでおこなう）
        if (result) {
          this.service.messagePrmReq(this.acsessUser.userId, this.acsessUser.userName, this.dispSlipId);
        }
      }
      console.log(result);
    });
  }

  /**
   * 詳細画面に戻る
   */
  onReturn() {
    this.location.back();
  }

  /**
   * 一覧画面に遷移する。
   */
  onServiceList() {
    this.router.navigate(["service_list"],
      { queryParams: { areaNum: 0, category: 0 } });
  }
}
