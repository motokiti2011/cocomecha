import { Component, OnInit } from '@angular/core';
import { find as _find, isNil as _isNil } from 'lodash';

import { TransactionMenuService } from './transaction-menu.service';
import { BrowsingHistoryComponent } from './browsing-history-tab/browsing-history-detail/browsing-history/browsing-history.component';
import { TansactionCompleteComponent } from './transaction-complete-tab/transaction-complete-detail/tansaction-complete/tansaction-complete.component';
import { TransactionListComponent } from './transaction/transaction-list/transaction-list.component';
import { FavoriteComponent } from './favorite-tab/favorite/favorite.component';
import { MyListComponent } from './mylist-tab/mylist-detail/my-list/my-list.component';
import { loginUser } from 'src/app/entity/loginUser';
// import { MylistDetailComponent } from './mylist-tab/mylist-detail/mylist-detail.component';
// import { BrowsingHistoryDetailComponent } from './browsing-history-tab/browsing-history-detail/browsing-history-detail.component';
// import { TransactionCompleteDetailComponent } from './transaction-complete-tab/transaction-complete-detail/transaction-complete-detail.component';
// import { TransactionDetailComponent } from './transaction/transaction-detail/transaction-detail.component';

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
    private transactionMenuService: TransactionMenuService,
  ) { }

  ngOnInit(): void {
    this.initDisplay();
    // 初回表示画面をセット
    this.currentTab = MyListComponent;
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
