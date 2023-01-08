import { Component, OnInit } from '@angular/core';
import { find as _find, isNil as _isNil } from 'lodash';
import { Router } from '@angular/router';
import { TransactionMenuService } from './transaction-menu.service';
import { BrowsingHistoryComponent } from './browsing-history-tab/browsing-history-detail/browsing-history/browsing-history.component';
import { TansactionCompleteComponent } from './transaction-complete-tab/tansaction-complete.component';
import { TransactionListComponent } from './transaction/transaction-list/transaction-list.component';
import { FavoriteComponent } from './favorite-tab/favorite/favorite.component';
import { MyListComponent } from './mylist-tab/mylist-detail/my-list/my-list.component';
import { AuthUserService } from '../../auth/authUser.service';
import { CognitoService } from '../../auth/cognito.service';
import { loginUser } from 'src/app/entity/loginUser';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.component.html',
  styleUrls: ['./transaction-menu.component.scss']
})
export class TransactionMenuComponent implements OnInit {

  /**  */
  displayMethod = false;
  /**  */
  selected = 'listDisplay';
  /** 現在のタブ */
  currentTab: any;
  /** 表示タブ */
  displayTab: any;
  /** タブメニューデータ */
  tabs = [
    { name: 'お知らせ', contents: MyListComponent, current: true },
    { name: 'お気に入り', contents: FavoriteComponent, current: false },
    { name: '閲覧履歴', contents: BrowsingHistoryComponent, current: false },
    { name: '取引中', contents: TransactionListComponent, current: false },
    { name: '取引終了分', contents: TansactionCompleteComponent, current: false },
  ];
  /** 表示方法切替セレクト */
  data = [
    { label: '一覧表示', value: 'listDisplay', disabled: false },
    { label: '詳細表示', value: 'detailDisplay', disabled: false },
  ];

  constructor(
    private router: Router,
    private service: TransactionMenuService,
    private cognito: CognitoService,
    private auth: AuthUserService,


  ) { }

  ngOnInit(): void {
    this.authUserSetting();
    this.initDisplay();
    // 初回表示画面をセット
    this.currentTab = MyListComponent;
  }

  /**
   * アクセスユーザー情報の取得設定を行う
   */
  private authUserSetting() {
    // ログイン検証
    const authUser = this.cognito.initAuthenticated();
    if(authUser == null) {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
      return;
    }
    // アクセス情報の確認、設定
    // this.auth.userInfo$.subscribe(user => {
    //   if(user == null) {
    this.service.getUser(authUser).subscribe(result => {
      if(result[0] != null) {
        const acceseUser:loginUser = {
          userId: authUser,
          userName: result[0].userName,
          mechanicId: result[0].mechanicId,
          officeId: result[0].officeId
        }
        // Subjectにユーザー情報をセットする。
        this.auth.login(acceseUser);
      } else {
        alert('情報が取得できませんでした。再度アクセスしてください');
        this.router.navigate(["/main_menu"]);
        return;
      }
    });
    //   }
    // });
  }




  /**
   * 表示方式の初期設定を行う
   */
  private initDisplay() {
    if (this.selected === 'listDisplay') {
      this.displayMethod = true;
    }
    this.migrationDisplay();
  }


  /**
   * 表示方式の切り替えを行う
   */
  changeDisplay() {
    if (this.selected === 'listDisplay') {
      this.displayMethod = true;
    } else {
      this.displayMethod = false;
    }

    this.migrationDisplay();
  }

  /**
   * ボタンがクリックされた時のイベントハンドラ
   * @param {any} $event イベント情報
   * @memberof SwitchTabComponent
   */
  onClick($event: any) {
    // 表示方式情報とタブ選択情報により遷移先を変更
    // const selectTab = _find(this.tabs , {name:$event.target.innerHTML});
    this.displayTab = _find(this.tabs, { name: $event.target.innerHTML });

    // 選択状態フラグを切替える
    this.tabs.forEach((tab) => {
      if (tab.name === this.displayTab.name) {
        tab.current = true;
      } else {
        tab.current = false;
      }
    });
    this.migrationDisplay();
  }

  /**
   * タブ選択状態により表示するコンポーネントを切り替える
   */
  private migrationDisplay(): void {

    if (_isNil(this.displayTab)) {
      this.displayTab = _find(this.tabs, { current: true });
    }

    switch (this.displayTab.contents) {
      case MyListComponent:
        this.currentTab = MyListComponent;
        break;
      case FavoriteComponent:
        this.currentTab = FavoriteComponent;
        break;
      case BrowsingHistoryComponent:
        this.currentTab = BrowsingHistoryComponent;
        break;
      case TransactionListComponent:
        this.currentTab = TransactionListComponent;
        break;
      case TansactionCompleteComponent:
        this.currentTab = TansactionCompleteComponent;
        break;
    }
  }



}
