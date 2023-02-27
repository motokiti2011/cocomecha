import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { forkJoin, Observable, of } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { completionSlip } from 'src/app/entity/completionSlip';
import { ApiCheckService } from '../../service/api-check.service';
import { ApiUniqueService } from '../../service/api-unique.service';
import { CognitoService } from '../../auth/cognito.service';
import { result } from 'lodash';


/**
 * 過去取引コンポーネント
 */
@Component({
  selector: 'app-past-transactions',
  templateUrl: './past-transactions.component.html',
  styleUrls: ['./past-transactions.component.scss']
})
export class PastTransactionsComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkService: ApiCheckService,
    private uniqueService: ApiUniqueService,
    private cognito: CognitoService,
    private overlay: Overlay,
  ) { }

  /** 表示情報 */
  dispInfo: completionSlip[] = [];
  /** 管理者ID */
  adminId: string = '';
  /** サービスタイプ */
  serviceType: string = '';

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });


  ngOnInit(): void {
    // urlパラメータ取得
    this.route.queryParams.subscribe(params => {
      this.adminId = params['adminId'];
      this.serviceType = params['serviceType'];
      // ログインユーザー情報取得
      const authUser = this.cognito.initAuthenticated();
      let accessUser = '';
      if (authUser !== null) {
        // ログイン状態の場合
        accessUser = authUser
      }
      // 非同期で表示データ取得とアクセス者の管理対象判定を行う
      forkJoin(
        this.uniqueService.getPastTransaction(this.adminId,this.serviceType, accessUser),
        this.checkService.checkAdminPastTransaction(this.adminId,this.serviceType, this.adminId)
      ).subscribe(resultList => {
        console.log(resultList);
      });
      // ローディング解除
      this.overlayRef.detach();
    });








  }

}
