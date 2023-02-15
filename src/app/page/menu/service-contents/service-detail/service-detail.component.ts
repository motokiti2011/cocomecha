import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceDetailService } from './service-detail.service';
import { salesServiceInfo, defaulsalesService } from 'src/app/entity/salesServiceInfo';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { image } from 'src/app/entity/image';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MessageDialogComponent } from 'src/app/page/modal/message-dialog/message-dialog.component';
import { user } from 'src/app/entity/user';
import { CognitoService } from 'src/app/page/auth/cognito.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {


  /** 画像 */
  images: image[] = [];
  /** ユーザー情報 */
  user: string = '';
  /** サービスタイプ */
  serviceType = '';
  /** サービスID */
  serviceId: string = '';
  /** タイトル */
  serviceTitle: string = '';
  /** 日付 */
  dispYMD:string = '';
  // dispYMD:Date = new Date();
  /** 希望時間 */
  dispTime: string = '';
  /** 価格 */
  dispPrice: number = 0;
  /** 場所 */
  dispArea: string = '';
  /** 作業場所 */
  dispWorkArea: string = '';
  /** 対象車両 */
  dispTargetVehicle: string = '';
  /** 説明 */
  dispExplanation: string = ''
  /** 表示伝票情報 */
  dispContents: salesServiceInfo = defaulsalesService;
  /** 入札方式 */
  bidMethod: string = '';
  /** 再出品区分 */
  relistedDiv = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  dlocale = this.locale;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: ServiceDetailService,
    public dialog: MatDialog,
    private router: Router,
    private config: NgbCarouselConfig,
    private overlay: Overlay,
    private cognito: CognitoService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    config.interval = 0;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.route.queryParams.subscribe(params => {
      console.log(params['serviceId']);
      const serviceId: string = params['serviceId'];
      this.serviceType = params['searchTargetService'];
      // サービスIDから伝票情報を取得し表示する
      this.service.getService(serviceId, this.serviceType).subscribe(data => {
        this.dispContents = data[0];
        // 表示内容に取得した伝票情報を設定
        this.serviceTitle = this.dispContents.title;
        // 希望日を設定
        if(this.dispContents.preferredDate != undefined) {
          this.dispYMD = this.service.setDispYMDSt(this.dispContents.preferredDate);
          // console.log('日付フォーマット:'+formatDate(date, "yy/MM/dd", this.locale));
          // this.dispYMD = formatDate(date, "yy/MM/dd", this.locale)
          // this.dispYMD = date;
        }
        // 希望時間
        this.dispTime = this.dispContents.preferredTime;
        // 入札方式
        this.bidMethod = this.dispContents.bidMethod;
        // 表示価格
        this.dispPrice = this.dispContents.price;
        // 地域
        this.dispArea = this.service.setDispArea(this.dispContents.areaNo1, this.dispContents.areaNo2);
        // 作業場所
        this.dispWorkArea = this.dispContents.workAreaInfo;
        // 対象車両
        this.dispTargetVehicle = this.dispContents.targetVehicleName;
        // 説明
        this.dispExplanation = this.dispContents.explanation;
        // 画像
        this.images = this.service.setImages(this.dispContents.thumbnailUrl, this.dispContents.imageUrlList)
        if (this.dispContents.processStatus == '3') {
          this.relistedDiv = true;
        }
        this.getLoginUser();
        // ローディング解除
        this.overlayRef.detach();
      })
    });
  }


  /**
   *
   */
  private getLoginUser() {
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if (authUser != null) {
      this.user = authUser;
    }
    // ローディング解除
    this.overlayRef.detach();
  }


  /**
   * 取引するボタン押下時の処理
   */
  onTransaction() {
    console.log('serviceType1:' + this.serviceType)
    this.router.navigate(["service-transaction"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType,
          status: false
        }
      });
  }

  /**
   * お気に入りに追加ボタン押下時の処理
   */
  onFavorite() {
    this.service.addFavorite(this.dispContents, this.user).subscribe(result => {
      let modalData: messageDialogData = {
        massage: '',
        closeFlg: true,
        closeTime: 400,
        btnDispDiv: false
      };
      if (result === 200) {
        modalData.massage = 'マイリストに追加しました'
      } else {
        modalData.massage = '追加に失敗しました。'
      }
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '300px',
        height: '100px',
        data: modalData
      })
    });
  }

  /**
   * 取引状況確認ボタン押下時の処理
   */
  onTransactionStatus() {
    this.router.navigate(["service-transaction"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType,
          status: true
        }
      });
  }

  /**
   * 再出品ボタン押下イベント
   */
  onRelisted() {
    this.router.navigate(["service-relisted"],
      {
        queryParams: {
          slipNo: this.dispContents.slipNo,
          serviceType: this.serviceType
        }
      });
  }




  /**
   * 戻るボタン押下イベント
   * @return void
   */
  goBack(): void {
    this.location.back();
  }

}

