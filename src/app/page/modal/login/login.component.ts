import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from 'src/app/entity/user';


export interface DialogData {
  mailaddress:string;
  passwd:string;
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
  login = {
    mailaddress:'',
    passwd:'',
    selected:false,
    reissuePasswd:false,
    newResister:false
  }

  constructor(
    public _dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:DialogData
    ) { }

  ngOnInit(): void {
  }

  // logoutボタンクリックイベントで呼び出される関数
  actionFunction() {
    console.log(this.login.mailaddress);
    console.log(this.login.passwd);
    this.data = this.login;

    this.closeModal();
  }

  /**
   * パスワードを忘れた方の処理
   */
  reissuePasswd() {
    this.login.reissuePasswd = true;
    this.data = this.login;
    this._dialogRef.close(this.data);
  }

  /**
   * 新規登録画面遷移
   */
  newResister() {
    this.login.newResister = true;
    this.data = this.login;
    this._dialogRef.close(this.data);
  }

  // ダイアログを閉じる
  closeModal() {
    this._dialogRef.close();
  }
  onNoClick(): void {
    console.log('ログイン押した')
    // this._dialogRef.close();
  }
}
