import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { CognitoService } from '../cognito.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {


  title = '新規登録';

  /** 表示切替区分 */
  confirmationDiv = false;
  /** エラーメッセージ */
  dispMsg: any = '';
  userInfo = { userId: '', userName: '', mailAdress: '' }

  loading = false;

  user = {
    loginId: 'login',
    passwd: 'passwd',
    mail: 'email@.com',
    confirmationMail: 'email@.com',
    name: 'yamada',
    area: ''
  }

  constructor(
    private location: Location,
    private cognito: CognitoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  /**
   * 戻るボタン押下イベント
   * @return void
   */
   goBack():void {
    this.location.back();
  }

  show() {
    console.log(1);
  }

  /**
   * 新規ユーザー登録を行う
   * @param email 
   * @param password 
   * @param userId 
   */
  onSignup(email: string, password: string, userId: string) {
    this.cognito.signUp(userId, password, email)
      .then((result) => {
        this.confirmationDiv = true;
        this.dispMsg = '';
        this.userInfo.userId = userId;
        this.userInfo.userName = '';
        this.userInfo.mailAdress = email;
        console.log(result);
      }).catch((err) => {
        // this.dispMsg = errorMsg[0].value;
        // if (err == errorMsg[1].message) {
        //   this.dispMsg = errorMsg[1].value;
        // }
        console.log(err);
      });
  }

  /**
   * ユーザー登録後、確認コード入力を行いユーザー登録を完了させる。
   * @param confirmationEmail 
   * @param confirmationCode 
   */
  onConfirmation(confirmationEmail: string, confirmationCode: string) {
    console.log(confirmationEmail);
    this.cognito.confirmation(confirmationEmail, confirmationCode)
      .then((result) => {
        this.dispMsg = '';
        console.log(result);
        if (result) {
          alert('登録完了！！')
          this.router.navigate(["main_menu"])
        } else {
          alert('失敗')
        }
      });
  }







}
