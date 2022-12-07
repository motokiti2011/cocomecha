import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  find as _find,
  filter as _filter,
  isNil as _isNil,
  cloneDeep as _cloneDeep,
  uniq as _uniq,
} from 'lodash';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, distinct, map, switchMap, tap } from "rxjs/operators";
import { serchCategoryData } from 'src/app/entity/serchCategory';
import { prefecturesCoordinateData } from 'src/app/entity/prefectures';
import { serviceContents } from 'src/app/entity/serviceContents';
import { AuthUserService } from 'src/app/page/auth/authUser.service';
import { loginUser } from 'src/app/entity/loginUser';
import { userFavorite } from 'src/app/entity/userFavorite';
import { browsingHistory } from 'src/app/entity/browsingHistory';
import { ServiceListcomponentService } from '../../service-listcomponent.service';
import { Router } from '@angular/router';
import { serchSidAmount } from 'src/app/entity/serchSid';
import { noUndefined } from '@angular/compiler/src/util';


@Component({
  selector: 'app-service-list-side-menu',
  templateUrl: './service-list-side-menu.component.html',
  styleUrls: ['./service-list-side-menu.component.scss']
})
export class ServiceListSideMenuComponent implements OnInit {


  /** 検索条件：地域 */
  @Input() serchArea: number = 0;
  /** 検索条件：カテゴリー  */
  @Input() serchCategory: number = 0;
  /** お気に入り表示情報*/
  @Input() favoriteList: userFavorite[] = [];
  // /** 閲覧履歴表示情報*/
  // @Input() browsingHistoryList: serviceContents[] = [];
  /** エリア操作時のイベント */
  @Output() chengeArea = new EventEmitter<string>();
  /** カテゴリー操作時のイベント */
  @Output() chengeCateogry = new EventEmitter<string>();
  /** 金額操作時のイベント */
  @Output() chengeAmount = new EventEmitter<serchSidAmount[]>();
  /** 認証中ユーザー情報 */
  @Output() chengeAuth = new EventEmitter<Observable<loginUser>>();

  // 表示用お気に入り情報
  displayFavorite: userFavorite[] = [];
  // 表示用閲覧履歴情報
  displayBrowsing: browsingHistory[] = [];

  /** ユーザー認証済フラグ */
  userCertificationDiv = false;
  /** 地域情報選択状態初期値 */
  areaSelect = ''
  /** カテゴリー選択状態初期値 */
  categorySelect = '';
  /** 地域情報データ一覧 */
  areaData = _filter(prefecturesCoordinateData, detail => detail.data === 1);
  /** カテゴリーデータ一覧 */
  categoryData = serchCategoryData;
  
  /** 金額チェックボックスデータ */
  serchAmount = [
    { label: '1円~1,000円', value1: '1',value2: '1000', selected: false },
    { label: '1,000円~3,000円', value1: '1000',value2: '3000', selected: false },
    { label: '3,000円~5,000円', value1: '3000',value2: '5000', selected: false },
    { label: '3,000円~10,000円', value1: '3000',value2: '10000', selected: false },
    { label: '10,000円~30,000円', value1: '10000',value2: '30000', selected: false },
    { label: '30,000円~50,000円', value1: '30000',value2: '50000', selected: false },
    { label: '50,000円以上', value1: '50000',value2: '99999', selected: false },
  ];

  constructor(
    private auth: AuthUserService,
    private service: ServiceListcomponentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // 地域のセレクトボックス初期選択処理
    if (this.serchArea > 0) {
      const initArea = _find(this.areaData, data => data.id == this.serchArea)?.prefectures;
      if (initArea != undefined) {
        this.areaSelect = initArea;
      }
    }

    // 作業内容のセレクトボックス初期選択処理
    if (this.serchCategory > 0) {
      const initCategory = _find(this.categoryData, data => data.id == this.serchCategory)?.category;
      if (initCategory != undefined) {
        this.categorySelect = initCategory;
      }
    }
    // 認証ユーザー取得
    this.auth.user$.subscribe(userOrNull => {

      if (userOrNull === null) {
        // 認証情報がない場合、お気に入り、閲覧履歴は非表示
        this.userCertificationDiv = false;
      } else {
        this.userCertificationDiv = true;
      }
      if(this.userCertificationDiv) {
        // 閲覧履歴情報を取得
        this.initListDisplay(userOrNull?.userId);
      }
    });
  }

  /**
   * 初期処理：閲覧履歴情報を取得し画面表示する 
   */
  private initListDisplay(userId: string| undefined):void {
    if(userId === undefined) {
      return;
    }
    console.log(this.favoriteList)
    // 閲覧履歴情報を取得
    this.service.getBrowsingHistory(userId).subscribe( data => {
      this.displayBrowsing = this.service.browsingHistoryUnuq(data);
    });
  }

  /**
   * エリア押下時 
   * 選択した地域情報をイベント発火させ親へと戻す
   */
  onArea() {
    console.log(this.areaSelect)
    const areaId = _find(this.areaData, data => data.prefectures == this.areaSelect)?.id
    if(areaId == undefined ) {
      this.chengeArea.emit('0');
    } else {
      this.chengeArea.emit(String(areaId));
    }

  }

  /**
   * 作業内容押下時
   * 選択した作業内容をイベント発火させ親へと戻す
   */
  onWorkContents() {
    console.log(this.categorySelect)
    const category = _find(this.categoryData,data => data.category === this.categorySelect)?.id
    if(category === undefined) {
      this.chengeArea.emit('0');
    } else {
      this.chengeArea.emit(String(category));
    }
  }

  /**
   * 金額押下時
   */
  onAmount() {
    let checkAmount:serchSidAmount[] = [];
    // チェックボックスの状態をチェックする
    this.serchAmount.forEach(amount => {
      if(amount.selected) {
        let serch:serchSidAmount = {
          value1: Number(amount.value1),
          value2: Number(amount.value2)
        }
        checkAmount.push(serch);
      }
    })
    this.chengeAmount.emit(checkAmount);
  }

  /**
   * お気に入り、閲覧履歴コンテンツ押下時イベント
   */
  onContentsDetail(slipNo: number ) {
    console.log(slipNo);
    this.router.navigate(["service-detail-component"], { queryParams: { serviceId: slipNo } });
  }

  /**
   * 一覧へ押下時
   */
  listMenu() {
    console.log(323);
  }

}
