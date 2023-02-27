import { Component, OnInit } from '@angular/core';
import { ApiSerchService } from '../../service/api-serch.service';
import { CognitoService } from '../../auth/cognito.service';
import { Router } from '@angular/router';
import { user } from 'src/app/entity/user';
import { loginUser } from 'src/app/entity/loginUser';
import { AuthUserService } from '../../auth/authUser.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormService } from '../../service/form.service';

@Component({
  selector: 'app-my-menu',
  templateUrl: './my-menu.component.html',
  styleUrls: ['./my-menu.component.scss']
})
export class MyMenuComponent implements OnInit {

  constructor(
    private apiservice: ApiSerchService,
    private cognito: CognitoService,
    private router: Router,
    private auth: AuthUserService,
    private overlay: Overlay,
    private formService: FormService,
  ) { }

  /** 表示情報 */
  dispInfo = {
    name: '',
    mailadress: '',
    imageUrl: '',
    postNo: '',
    adress: '',
    tel1: '',
    tel2: '',
    introduction: ''
  }


  /** メカニックボタン表示 */
  mechanicButonTitle = '';
  /** メカニックボタンリンク */
  mechanicButonUrl = '';
  // メカニックID
  mechanicId = '';
  // ユーザー
  user? : user;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if (authUser !== null) {
      // ローディング開始
      this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
      this.apiservice.getUser(authUser).subscribe(user => {
        console.log(user);
        const acceseUser:loginUser = {
          userId: authUser,
          userName: user[0].userName,
          mechanicId: user[0].mechanicId,
          officeId: user[0].officeId
        }
        // Subjectにユーザー情報をセットする。
        this.auth.login(acceseUser);
        this.user = user[0];
        this.setDispInfo(user[0]);
        this.isMechanic(user[0]);
        // ローディング解除
        this.overlayRef.detach();
      });
    } else {
      alert('ログインが必要です');
      // ローディング解除
      this.overlayRef.detach();
      this.router.navigate(["/main_menu"]);
    }

  }


  /**
   * 取得したユーザー情報を表示ように設定する
   * @param user
   */
  private setDispInfo(user: user) {

    let post = '';
    let adless = '';
    let tel = '';
    let introduction = '';
    if(user.postCode) {
      post = user.postCode;
    }
    if(user.areaNo1) {
      adless = this.formService.setAreaName(user.areaNo1)
      + user.areaNo2 + user.adress;
    }
    if(user.TelNo1) {
      tel = user.TelNo1;
    }
    if(user.introduction) {
      introduction = user.introduction;
    }
    this.dispInfo = {
      name: user.userName,
      mailadress: user.mailAdress,
      imageUrl: this.isSetImage(user.profileImageUrl),
      postNo: post,
      adress: adless,
      tel1: tel,
      tel2: this.isSerParm(user.TelNo2, 'tel'),
      introduction: introduction,
    }
  }

  /**
   * メカニック登録有無を確認
   * @param user
   */
  private isMechanic(user: user) {
    if (user.mechanicId == null
      || user.mechanicId == '') {
      this.mechanicButonTitle = 'メカニック登録はこちら';
      this.mechanicButonUrl = 'mechanic-register';
      return;
    }
    this.mechanicButonTitle = '工場・メカニックメニューはこちら';
    this.mechanicButonUrl = 'factory-mechanic-menu';
    this.mechanicId = user.mechanicId;
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

  /**
   * 設定値を加工し返却
   * @param parm
   */
  private isSerParm(parm: string | null, subject: string): string {
    return '';
  }

  /**
   * 登録情報変更はこちらボタン押下イベント
   */
  onEditUserInfo() {
    this.router.navigate(["/edit-user-menu"]);
    console.log('chengeUserInfo')
  }

  /**
   * 取引情報はこちらボタン押下イベント
   */
  onTransaction() {
    this.router.navigate(["/transaction_menu"]);
    console.log('transaction')
  }

  /**
   * 工場・メカニックメニューはこちらボタン押下イベント
   */
  onFactoryMecanic() {
    this.router.navigate(["/" + this.mechanicButonUrl],
      {
        queryParams: {
          mechanicId: this.mechanicId
        }
      });
    console.log('mechanic-register')
  }

  /**
   * ご登録の車両情報はこちらボタン押下イベント
   */
  onVehcleInfo() {
    this.router.navigate(["/vehicle-menu"]);
    console.log('vehicle-menu')
  }

  /**
   * 工場メカニックお気に入りメニュー
   */
  onFcMcFavoriteMenu() {
    this.router.navigate(["/fcmc-favorite-menu"]);
  }


}
