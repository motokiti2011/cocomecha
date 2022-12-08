import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CognitoService } from '../../auth/cognito.service';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { user } from 'src/app/entity/user';

export interface DialogData {
  userName: string,
  passwd: string,
  selected:boolean;
  reissuePasswd:boolean;
  newResister:boolean;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // ログイン情報
  loginData = {
    userName: '',
    passwd: '',
  }

  loading = false;

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  constructor(
    public _dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    private cognito: CognitoService,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
  }

  // logoutボタンクリックイベントで呼び出される関数
  actionFunction() {
    this.data.userName = this.loginData.userName;
    this.data.passwd = this.loginData.passwd;
    this.closeModal();
  }

  /**
   * パスワードを忘れた方の処理
   */
  reissuePasswd() {
    // this.login.reissuePasswd = true;
    this.data.reissuePasswd = true;
    this._dialogRef.close(this.data);
  }

  /**
   * 新規登録画面遷移
   */
  newResister() {
    // this.login.newResister = true;
    this.data.newResister = true;
    this._dialogRef.close(this.data);
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }


  /**
   * ログインボタン押下イベント
   */
  btnAction() {
    // ローディング開始
    this.overlayRef.attach(new ComponentPortal(MatProgressSpinner));
    this.loading = true;
    this.sinin(this.data.userName, this.data.passwd)
      .then((result) => {
        console.log(result);
        this.loading = false;
        this.overlayRef.detach();
      }).catch((err) => {
        console.log(err);
        this.loading = false;
        this.overlayRef.detach();
      });
  }

  async sinin(username: string, password: string): Promise<any> {
    try {
      const isLogin = await this.cognito.isAuthenticated();
      if (isLogin === null) {
        await this.cognito.login(username, password);
        this.closeModal();
      } else {
        this.cognito.logout();
      }
    } catch (e) {
      if (e === null) {
        this.cognito.logout();
      }
    }
  }





}
