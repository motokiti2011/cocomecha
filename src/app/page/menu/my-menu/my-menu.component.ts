import { Component, OnInit } from '@angular/core';
import { ApiSerchService } from '../../service/api-serch.service';
import { CognitoService } from '../../auth/cognito.service';
import { Router } from '@angular/router';
import { user } from 'src/app/entity/user';

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
  ) { }


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


  ngOnInit(): void {
    const authUser = this.cognito.initAuthenticated();
    if(authUser !== null) {
      this.apiservice.getUser(authUser).subscribe(user => {
        console.log(user);
        this.setDispInfo(user[0]);
      });
    } else {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
    }

  }


  /**
   * 取得したユーザー情報を表示ように設定する
   * @param user
   */
  private setDispInfo(user: user) {
    this.dispInfo = {
      name: user.userName,
      mailadress: user.mailAdress,
      imageUrl: this.isSetImage(user.profileImageUrl),
      postNo: this.isSerParm(user.postCode, 'post'),
      adress: this.isSerParm(user.adress, 'adress'),
      tel1: this.isSerParm(user.TelNo1, 'tel'),
      tel2: this.isSerParm(user.TelNo2, 'tel'),
      introduction: this.isSerParm(user.introduction, 'intro'),
    }
  }

  /**
   * 画像有無を判定する
   * @param imageUrl
   * @returns
   */
  private isSetImage(imageUrl: string| null): string {
    const url = 'assets/images/noimage.png'
    if(imageUrl == null || imageUrl == '') {
      return url;
    }
    return imageUrl;
  }

  /**
   * 設定値を加工し返却
   * @param parm
   */
  private isSerParm(parm: string| null, subject: string): string {
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
    this.router.navigate(["/factory-mechanic-menu"]);
    console.log('factory')
  }



}
