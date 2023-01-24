import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ServiceDetailService } from './service-detail.service';
import { slipDetailInfo, defaultSlip } from 'src/app/entity/slipDetailInfo';
import { messageDialogData } from 'src/app/entity/messageDialogData';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { image } from 'src/app/entity/image';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';



@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {



  images: image[] = [];
  /** サービスタイプ */
  serviceType = '';

  /** サービスID */
  serviceId: string = '';
  /** タイトル */
  serviceTitle: string = '';
  /** 日付 */
  dispYMD: string = '';
  /** 価格 */
  dispPrice: string = '';
  /** 場所 */
  dispArea: string = '';
  /** 説明 */
  dispExplanation: string = ''
  /** 表示伝票情報 */
  dispContents: slipDetailInfo = defaultSlip;

  /** 再出品区分 */
  relistedDiv = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: ServiceDetailService,
    public dialog: MatDialog,
    private router: Router,
    private config: NgbCarouselConfig,
    private overlay: Overlay,
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
        this.dispYMD = this.dispContents.bidEndDate;
        this.dispPrice = this.dispContents.price;
        this.dispArea = this.dispContents.areaNo1;
        this.dispExplanation = this.dispContents.explanation;
        this.images = this.service.setImages(this.dispContents.imageUrlList)
        if (this.dispContents.processStatus == '3') {
          this.relistedDiv = true;
        }
        // ローディング解除
        this.overlayRef.detach();
      })
    });
    this.getUserInfo();
  }


  /**
   *
   */
  private getUserInfo() {

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

  // /**
  //  * マイリストに追加ボタン押下時の処理
  //  */
  // onMyList() {
  //   this.service.addMyList(this.dispContents).subscribe(result => {
  //     let modalData:messageDialogData = {
  //       massage: '',
  //       closeFlg:true,
  //       closeTime:400,
  //       btnDispDiv: false
  //     };
  //     if(result === 200) {
  //       modalData.massage = 'マイリストに追加しました'
  //     } else {
  //       modalData.massage = '追加に失敗しました。'
  //     }
  //     const dialogRef = this.dialog.open(MessageDialogComponent, {
  //       width: '300px',
  //       height: '100px',
  //       data: modalData
  //     })
  //   });
  // }

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

