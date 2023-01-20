import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { user } from 'src/app/entity/user';
import { mcfcItem } from 'src/app/entity/mcfcItem';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';


@Component({
  selector: 'app-factory-mechanic-contents-management',
  templateUrl: './factory-mechanic-contents-management.component.html',
  styleUrls: ['./factory-mechanic-contents-management.component.scss']
})
export class FactoryMechanicContentsManagementComponent implements OnInit {

  /** ユーザー情報 */
  user?: user
  /** 商品リスト */
  itemList: mcfcItem[] = [];
  /** サービスタイプ */
  serviceType: string = '';

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private router: Router,
    private cognito: CognitoService,
    private apiSerchService: ApiSerchService,
    private apiUniqService: ApiUniqueService,
    private activeRouter: ActivatedRoute,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.activeRouter.queryParams.subscribe(params => {
      this.serviceType = params['serviceType']
      // ログイン検証
      const authUser = this.cognito.initAuthenticated();
      if (authUser == null) {
        alert('ログインが必要です');
        this.router.navigate(["/main_menu"]);
        // ローディング解除
        this.overlayRef.detach();
        return;
      }
      this.apiSerchService.getUser(authUser).subscribe(res => {
        if (res != null) {
          // ユーザー情報を設定
          this.user = res[0];
          this.getMcFcItemList();
        }
      });
    });
  }

  /**
   * メカニック・工場商品一覧を取得する
   * @returns 
   */
  private getMcFcItemList() {
    let serchId = this.user?.mechanicId;
    if (this.serviceType == '1') {
      serchId = this.user?.officeId;
    }
    if (serchId == null) {
      // ローディング解除
      this.overlayRef.detach();
      return;
    }
    this.apiUniqService.getMcFcItemList(serchId, this.serviceType).subscribe(res => {
      this.itemList = res[0];
      // ローディング解除
      this.overlayRef.detach();
    });
  }

  /**
   * 商品名押下イベント
   * @param item 
   */
  onItemDisp(item: mcfcItem) {
    console.log(item);
  }



}

