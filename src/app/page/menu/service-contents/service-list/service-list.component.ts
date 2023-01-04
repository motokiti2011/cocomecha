import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Location } from '@angular/common';
import {
  find as _find,
  isNil as _isNil,
  uniq as _uniq,
  cloneDeep as _cloneDeep,
} from 'lodash';
import { serviceContents } from 'src/app/entity/serviceContents';
import { slipDetailInfo } from 'src/app/entity/slipDetailInfo';
import { ServiceListcomponentService } from './service-listcomponent.service';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { userFavorite } from 'src/app/entity/userFavorite';
import { loginUser } from 'src/app/entity/loginUser';
import { serchSidAmount } from 'src/app/entity/serchSid';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { serchInfo, serchParam } from 'src/app/entity/serchInfo';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {


  // ページング表示開始位置
  begin= 0;
  // ページング最大件数
  length = 6;

  // NoImageURL
  noImage = "assets/images/noimage.png";

  /** タイトル */
  serviceTitle = 'サービス一覧画面'
  /** コンテンツリスト*/
  contentsList: serviceContents[] = [];
  /** 画面表示コンテンツリスト*/
  displayContentsList: serviceContents[] = [];
  /** 取得サービス(基準) */
  standardSlip: slipDetailInfo[] = [];
  /** 現在のページ*/
  currentIndex: number = 1;
  /** 総ページ数*/
  totalPage: number = 1;
  /** 表示ページ*/
  displayPage: number = 1;
  /** インデックス*/
  pageIndex: number[] = [];
  /** 検索件数 */
  displayCount: number = 1;
  /** 最大件数表示フラグ */
  maxPageDisp: boolean = false;
  /** 表示順セレクトボタン */
  selected = 'defult';
  /** 検索条件：対象サービス */
  searchTargetService = '';

  /** 検索条件：地域 */
  serchArea1 = '0';
  /** 検索条件：詳細地域 */
  serchArea2 = '0';
  /** 検索条件：カテゴリー  */
  serchCategory = '0';
  serchInfo:serchInfo = serchParam;


  /** 認証ユーザー情報有無フラグ */
  userCertificationDiv: boolean = false;
  /** お気に入り取得情報 */
  favoriteList: userFavorite[] = [];
  /** ユーザー情報 */
  authUser: loginUser = { userId: '', userName: '' };

  displayData = [
    { label: '表示順', value: 'defult', disabled: false },
    { label: '日付が新しいものから表示', value: 'newData', disabled: false },
    { label: '日付が古いものから表示', value: 'oldData', disabled: false },
    { label: '残り日付が短いものから表示', value: 'shortData', disabled: false },
  ];
  url = '';

  /** ユーザーID */
  userId = '0';

  /** お気に入り */
  favorteStyles = {
    favorite: false,
    anfavorite: false
  };

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private location: Location,
    private service: ServiceListcomponentService,
    // private loading: LoadingSpinnerService,
    private auth: AuthUserService,
    private apiService: ApiSerchService,
    private apiGsiService: ApiGsiSerchService,
    private apiUniqueService: ApiUniqueService

  ) { }

  ngOnInit() {
    // 検索条件画面からの条件から展開するサービス内容を抽出する
    this.activeRouter.queryParams.subscribe(params => {
      // this.loading.show();
      // 検索条件取得
      this.serchInfo.areaNo1 = params['areaNum'];
      this.searchTargetService = params['targetService'];

      if(this.searchTargetService !== '0') {
        this.getServiceContents();
      } else {
        this.getSlip();
      }
      // 認証有無状態を判定する
      this.auth.user$.subscribe(userOrNull => {
        if (userOrNull === null) {
          // 認証情報がない場合、お気に入り、閲覧履歴は非表示
          this.userCertificationDiv = false;
        } else {
          // ユーザー情報を基にお気に入り情報を取得
          this.userCertificationDiv = true;
          this.authUser = userOrNull;
        }
        // ユーザー情報ある場合
        if (this.userCertificationDiv) {
          this.apiGsiService.serchFavorite(this.authUser.userId).subscribe(data => {
            this.favoriteList = this.service.favoriteUnuq(data);
            if (data.length > 0) {
              this.setFavorite();
            }
          });
        }
      });
    });
  }

  /**
   * 検索情報を元に伝票情報を取得する
   */
  private getSlip() {
    this.apiUniqueService.serchSlip(this.serchInfo).subscribe(slip => {
      this.seviceListSetting(slip);
      this.initSetServiceContents(slip);
    });
  }

  /**
   * 検索条件を元にサービス商品情報を取得する
   */
  getServiceContents() {
    this.apiUniqueService.serchServiceContents(this.serchInfo).subscribe(slip => {
      this.seviceListSetting(slip);
      this.initSetServiceContents(slip);
    });
  }

  /**
   * 初回表示するサービスを取得し設定する
   * @return void
   */
  private initSetServiceContents(slipDetail: slipDetailInfo[]): void {
    // 初回のみ初期化
    this.displayContentsList = [];
    // コンテンツ全体から総ページ数を算出する
    this.totalPage = Math.round(slipDetail.length / 6);
    // 現在のページを設定する
    this.currentIndex = 1;
    // 大元となる取得コンテンツを設定
    this.standardSlip = _cloneDeep(slipDetail);
    // 6個表示のためページ数計算含め行う
    let count = 0;
    slipDetail.forEach((content) => {
      // 6コンテンツ分抽出する
      if (count < 6) {
        if (!(_isNil(content))) {
          this.displayContentsList.push(
            this.service.convertServiceContents(content));
        }
      } else {
        return;
      }
      count++
    });
    // 初期ページ設定を行う
    this.initPageSetting();
  }

  /**
   * 初回ページ設定を行う
   * @return void
   */
  private initPageSetting() {
    // 初回のみ初期化
    this.pageIndex = [];
    let count = 1;
    const maxIndex = this.totalPage;

    // ページ数は最大6個表示のためそれ以上であれば6個までの表示を行う
    if (this.totalPage > 6) {
      this.maxPageDisp = true;
    }
    // ページ数は最大6表示
    for (var i = 0; i < this.totalPage; i++) {
      if (count > 6) {
        return;
      }
      this.pageIndex.push(count);
      count++;
    }
  }

  /**
   * お気に入り情報を設定する
   */
  private setFavorite() {
    this.displayContentsList = this.service.setFavorite(this.displayContentsList, this.favoriteList);
  }

  /**
   * 取得した伝票からサービス情報を設定する(既存条件から表示ステータスの変更のみ)
   * @param slipDetail
   */
  private seviceListSetting(slipDetail: slipDetailInfo[]): void {
    slipDetail.forEach((content) => {
      if (!(_isNil(content))) {
        if(content.thumbnailUrl == '') {
          content.thumbnailUrl = this.noImage;
        }
        this.contentsList.push(
          this.service.convertServiceContents(content));
      }
    });
  }

  /**
   * 表示するサービスを取得し設定する
   * @return void
   */
  private setServiceContents(slipDetail: slipDetailInfo[]): void {
    this.displayContentsList = [];
    // コンテンツ全体から総ページ数を算出する
    this.totalPage = Math.round(slipDetail.length / 6);
    // 現在のページを設定する
    this.currentIndex = 1;
    // 6個表示のためページ数計算含め行う
    let count = 0;
    slipDetail.forEach((content) => {
      // 6コンテンツ分抽出する
      if (count < 6) {
        if (!(_isNil(content))) {
          this.displayContentsList.push(
            this.service.convertServiceContents(content));
        }
      } else {
        return;
      }
      count++
    });
    // 初期ページ設定を行う
    this.initPageSetting();
  }


  /**
   * 表示するサービス情報を取得する
   * @return void
   */
  private setDisplayService(): void {
    // 初期化
    this.displayContentsList = [];
    // 現在のページから取得する開始インデックスを出す
    // 開始位置　= 現在のページ数*6　-1
    const startIndex = (this.currentIndex * 6) - 1;

    let loopCount = 0;
    let count = 0;

    // 6個表示のためページ数計算含め行う
    this.contentsList.forEach((content) => {
      if (startIndex >= loopCount) {
        // 6コンテンツ分抽出する
        if (count < 6) {
          if (!(_isNil(content))) {
            this.displayContentsList.push(content);
          }
        } else {
          return;
        }
        count++
      }
      loopCount++
    });
    this.pageSetting();
  }

  /**
   * ページ数表示設定を行う
   */
  private pageSetting() {
    // 表示ページインデックスを初期化
    this.pageIndex = [];
    this.pageIndex = this.service.setPage(this.totalPage, this.currentIndex);
  }


  /********************* 画面操作イベント ************************/

  /**
   * 前へボタン押下イベント
   * @return void
   */
  onContentsForward(): void {
    // 1ページ目の場合何もしない
    if (this.currentIndex == 1) {
      return;
    }
    this.currentIndex = this.currentIndex - 1;
    this.setDisplayService();
  }
  /**
   * 次へボタン押下イベント
   * @return void
   */
  onContentsNext(): void {
    // 最終ページの場合何もしない
    if (this.currentIndex = this.totalPage) {
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    this.setDisplayService();
  }

  /**
   * Indexボタン押下イベント
   * @return void
   */
  onContentsIndex(index: number): void {
    console.log(index);
    this.currentIndex = index;
    this.setDisplayService();
  }

  /**
   * サービス選択時イベント
   * @param content 選択サービスコンテンツ
   * @return void
   */
  onContentsSelect(content: serviceContents): void {
    if (this.userCertificationDiv) {
      // 認証されている場合は閲覧履歴情報に登録
      this.service.postBrowsingHistory(content, this.authUser.userId);
    }

    this.router.navigate(["service-detail-component"],
     { queryParams: { serviceId: content.id, searchTargetService: this.searchTargetService } });
      console.log(content);
  }

  /**
   * お気に入り登録処理
   * @param contents
   */
  onContentFavorite(contents: serviceContents) {
    console.log('お気に入り：' + contents.id);

    // サービス一覧のお気に入りFlgを制御する
    this.contentsList = this.service.favoriteSetting(contents.id, this.contentsList);
    // 画面表示のお気に入りFlgを制御する
    this.displayContentsList = this.contentsList;
    // 認証情報取得
    this.auth.user$.subscribe(user => {
      if (user) {
        // お気に入り登録有無を判定し更新する。
        this.service.postFavorite(this.favoriteList, contents, user.userId);
      }
    });
  }

  /******************* トップイベント **************************/

  /**
   * 表示順セレクトボックス選択時
   */
  onDisplayList() {
    console.log(this.selected);
  }


  /******************* サイドメニューイベント **************************/

  /**
   * サイドメニューエリア選択時
   */
  onAreaChenge(e: string) {
    if(_isNil(e)) {
      this.serchArea1 = '0';
    } else {
      this.serchArea1 = e;
    }

    this.service.getSidSerchSlip(String(this.serchArea1), String(this.serchCategory)).subscribe(slip => {
      this.seviceListSetting(slip);
      this.initSetServiceContents(slip);
      if (this.userCertificationDiv) {
        this.apiGsiService.serchFavorite(this.authUser.userId).subscribe(data => {
          this.favoriteList = this.service.favoriteUnuq(data);
          if (data.length > 0) {
            this.setFavorite();
          }
        });
      }
    });
  }

  /**
   * サイドメニューカテゴリー選択時
   */
  onCategoryChenge(e: string) {
    if(_isNil(e)) {
      this.serchCategory = '0';
    } else {
      this.serchCategory = e;
    }
    this.service.getSidSerchSlip(String(this.serchArea1), String(this.serchCategory)).subscribe(slip => {
      this.seviceListSetting(slip);
      this.initSetServiceContents(slip);
      if (this.userCertificationDiv) {
        this.apiGsiService.serchFavorite(this.authUser.userId).subscribe(data => {
          this.favoriteList = this.service.favoriteUnuq(data);
          if (data.length > 0) {
            this.setFavorite();
          }
        });
      }
    });
  }

  /**
   * サイドメニュー金額選択時
  */
  onAmountChenge(e: serchSidAmount[]) {
    // 検索条件なしの場合全件表示
    if (e.length == 0) {
      this.setServiceContents(this.standardSlip);
    } else {
      // 金額絞り込み
      this.setServiceContents(this.service.serchAmtContent(this.standardSlip, e))
    }
  }

  /**
   * 絞り込みボタン押下時
   */
  onSerch() {

  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

}
