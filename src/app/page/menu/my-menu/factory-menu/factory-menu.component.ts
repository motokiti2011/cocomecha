import { Component, OnInit } from '@angular/core';
import { officeInfo, initOfficeInfo } from 'src/app/entity/officeInfo';
import { UploadService } from 'src/app/page/service/upload.service';
import { Router } from '@angular/router';
import { user } from 'src/app/entity/user';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { CognitoService } from 'src/app/page/auth/cognito.service';

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-factory-menu',
  templateUrl: './factory-menu.component.html',
  styleUrls: ['./factory-menu.component.scss']
})
export class FactoryMenuComponent implements OnInit {

  /** ファイル情報 */
  imageFile: any = null;
  /** ユーザー情報 */
  user?: user
  //編集モード区分
  editModeDiv = false;
  // 表示情報
  dispInfo: officeInfo = initOfficeInfo;
  // 工場情報登録区分
  fcRegisDiv = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    private s3: UploadService,
    private router: Router,
    private cognito: CognitoService,
    private overlay: Overlay,
    private apiService: ApiSerchService,
  ) { }

  ngOnInit(): void {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      this.apiService.getUser(authUser).subscribe(user => {
        this.user = user[0];
        if (this.user) {
          if (this.user.officeId != '0' && this.user.officeId != null) {
            // 工場登録ある場合表示
            this.fcRegisDiv = false;
            this.officeSetting();
          } else {
            // 登録がない場合、登録ボタンのみ表示
            this.fcRegisDiv = true;
            // ローディング解除
            this.overlayRef.detach();
          }
        } else {
          alert('ログインが必要です');
          // ローディング解除
          this.overlayRef.detach();
          this.router.navigate(["/main_menu"]);
        }
      });

    }
  }

  show(info: officeInfo, editFlg: boolean) {
    this.editModeDiv = editFlg;
    this.dispInfo = info;
  }

  /**
   * アップロードファイル選択時イベント
   * @param event
   */
  onInputChange(event: any) {
    const file = event.target.files[0];
    console.log(file);
    this.imageFile = file;
  }

  /**
   * 登録ボタン押下イベント
   */
  onResister() {
    if (this.imageFile != null) {
      this.setImageUrl();
    } else {
      this.officeResister();
    }
  }

  /**
   * 工場登録はこちらからボタン押下イベント
   */
  onInitFactory() {
    this.router.navigate(["factory-register"]);
  }




  /************  以下内部処理 ****************/


  /**
   * 工場情報を取得する
   */
  private officeSetting() {
    if(!this.user?.officeId) {
      return;
    }
    this.apiService.getOfficeInfo(this.user.officeId).subscribe(res => {
      console.log(res);
    });


    // ローディング解除
    this.overlayRef.detach();
  }



  /**
   * イメージを設定する
   */
  private setImageUrl() {
    this.s3.onManagedUpload(this.imageFile).then((data) => {
      if (data) {
        console.log(data);
        // this.mechanicInfo.profileImageUrl = data.Location;
        this.officeResister();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * 工場情報を登録する
   */
  private officeResister() {

  }








}
