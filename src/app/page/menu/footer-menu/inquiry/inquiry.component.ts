import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { Overlay } from '@angular/cdk/overlay';
import { user } from 'src/app/entity/user';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';


@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {

  // ユーザー情報
  user?: user;

  /** フォームコントロール */
  name = new FormControl('名前', [
    Validators.required
  ]);

  mail = new FormControl('メール', [
    Validators.required
  ]);

    /** カテゴリーデータ */
    adminUserData = adminUserSelect;
    /** 管理ユーザーセレクト */
    adminSelect = '';


  /** フォームグループオブジェクト */
  groupForm = this.builder.group({
    name: this.name,
    mail: this.mail,
  })


  /** ローディングオーバーレイ */
  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private builder: FormBuilder,
    private cognito: CognitoService,
    public modal: MatDialog,
    private overlay: Overlay,
    private apiService: ApiSerchService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    // ログイン状態確認
    const authUser = this.cognito.initAuthenticated();
    if(authUser) {
      this.setUserInfo(authUser);
    }
    else {
      this.setContents();
    }
  }


  //** 以下内部処理 */

  /**
   * ユーザー情報を取得する
   * @param userId
   */
  private setUserInfo(userId: string) {
    this.apiService.getUser(userId).subscribe(data => {
      if(data) {
        this.user = data;
      }
      this.setContents;
    });
  }

  /**
   * 画面表示データを設定する
   */
  private setContents() {
    if(this.user) {

    } else {

    }

    // ローディング解除
    this.overlayRef.detach();
  }


}
