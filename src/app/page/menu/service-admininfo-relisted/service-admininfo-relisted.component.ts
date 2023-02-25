import { Component, OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { user } from 'src/app/entity/user';
import { Observable } from 'rxjs';
import { serviceAdminInfo } from 'src/app/entity/serviceAdminInfo';
import { ApiUniqueService } from '../../service/api-unique.service';

@Component({
  selector: 'app-service-admininfo-relisted',
  templateUrl: './service-admininfo-relisted.component.html',
  styleUrls: ['./service-admininfo-relisted.component.scss']
})
export class ServiceAdmininfoRelistedComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private overlay: Overlay,
    private uniqueService: ApiUniqueService,
  ) { }

  /** ID */
  id: string = '';
  /** サービスID */
  serviceId: string = '';
  /** サービスタイプ */
  serviceType = '0';
  /** サービスタイプ名称 */
  serviceTypeName = '';
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
   * 過去の取引押下イベント
   */
  onPastTransaction() {

  }


  /**
   * 表示データを設定する
   * @param data 
   */
  private setDispData(data: serviceAdminInfo) {

  }

  /***************** *********************************/

  /**
   * 伝票管理者情報を取得する
   */
  private getAdminService(): Observable<serviceAdminInfo> {
    if(this.serviceType == '0') {
      return this.uniqueService.getSalesAdminInfo(this.id, this.serviceType);
    } 
      return this.uniqueService.getSlipAdminInfo(this.id);
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
