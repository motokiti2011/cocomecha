import { Component, OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { user } from 'src/app/entity/user';
import { Observable } from 'rxjs';
import { serviceAdminInfo } from 'src/app/entity/serviceAdminInfo';
import { ApiUniqueService } from '../../service/api-unique.service';
import { FormService } from '../../service/form.service';

@Component({
  selector: 'app-service-admininfo-relisted',
  templateUrl: './service-admininfo-relisted.component.html',
  styleUrls: ['./service-admininfo-relisted.component.scss']
})
export class ServiceAdmininfoRelistedComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    private uniqueService: ApiUniqueService,
    private formService: FormService,
  ) { }

  /** ID */
  id: string = '';
  /** サービスID */
  serviceId: string = '';
  /** サービスタイプ */
  serviceType = '0';
  /** サービスタイプ名称 */
  serviceTypeName = '';
  /** 管理者ID */
  adminId = '';
  /** 管理者名称 */
  adminName = '';
  /** メールアドレス */
  mailAdless = '公開されていません';
  /** 電話番号 */
  telNo = '公開されていません';
  /** 郵便番号 */
  postNo = '公開されていません'
  /** 住所 */
  adress = '公開されていません'
  /** 画像URL */
  imageUrl = '';
  /** 説明 */
  introduction = '';
  /** 評価 */
  evaluation = '';
  // ユーザー
  user?: user;


  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });


  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.route.queryParams.subscribe(params => {
      console.log(params['serviceId']);
      const serviceId: string = params['serviceId'];
      this.id = params['id'];
      this.serviceType = params['serviceType'];
      this.serviceId = params['serviceId'];
      this.getAdminService().subscribe(data => {
        this.setDispData(data);
      });
      // ローディング解除
      this.overlayRef.detach();
    });
  }




  /**
   * 表示データを設定する
   * @param data 
   */
  private setDispData(data: serviceAdminInfo) {
    /** 管理者名称 */
    this.adminName = data.adminName;
    this.adminId = data.adminId;
    let mail = '公開されていません';
    let telNo = '公開されていません';
    let postNo = '公開されていません';
    let adress = '公開されていません';
    let introduction = '公開されていません';
    // let evaluation = '公開されていません';
    if (data.mail) {
      mail = data.mail;
    }
    if (data.telNo) {
      telNo = data.telNo;
    }
    if (data.post) {
      postNo = data.post;
    }
    if (data.adless) {
      if (this.serviceType == '0') {
        adress = this.formService.setAreaName(data.adless);
      } else {
        adress = data.adless;
      }
    }
    if (data.introduction) {
      introduction = data.introduction;
    }
    // if(data.evaluationInfo) {
    //   evaluation = data.evaluationInfo;
    // }
    /** メールアドレス */
    this.mailAdless = mail;
    /** 電話番号 */
    this.telNo = telNo;
    /** 郵便番号 */
    this.postNo = postNo
    /** 住所 */
    this.adress = adress
    /** 画像URL */
    this.imageUrl = this.isSetImage(data.profileImageUrl)
    /** 説明 */
    this.introduction = introduction;
    /** 評価 */
    this.evaluation = '';
  }

  /**
   * 過去の取引押下イベント
   */
  onPastTransaction() {
    this.router.navigate(["past-transactions"],
      {
        queryParams: {
          adminId: this.adminId,
          serviceType: this.serviceType,
        }
      });

    
  }


  /***************** *********************************/

  /**
   * 伝票管理者情報を取得する
   */
  private getAdminService(): Observable<serviceAdminInfo> {
    if (this.serviceType == '0') {
      return this.uniqueService.getSlipAdminInfo(this.id);
    }
    return this.uniqueService.getSalesAdminInfo(this.id, this.serviceType);
  }


  /**
   * 画像有無を判定する
   * @param imageUrl
   * @returns
   */
  private isSetImage(imageUrl: string | null): string {
    const url = 'assets/images/noimage.png'
    if (imageUrl == null || imageUrl == '') {
      return url;
    }
    return imageUrl;
  }


}