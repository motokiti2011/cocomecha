import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../../modal/login/login.component';
import { HeaderMenuService } from './header-menu.service';
import { loginUser } from 'src/app/entity/loginUser';
import { AuthUserService } from '../../auth/authUser.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

  loginUser: string = 'ログイン';

  login = {
    mailaddress: '',
    passwd: '',
    selected: false,
    reissuePasswd: false,
    newResister: false
  }

  credentials = {mailaddress: '', password: ''};

  // 認証有無フラグ
  authUser= false;

  constructor(
    private router: Router,
    private service: HeaderMenuService,
    public loginModal: MatDialog,
    private authUserService: AuthUserService,
  ) { }

  ngOnInit(): void {
  }

  cocomecha() {
    console.log('cocomecha')
    this.router.navigate(["/main_menu"])
  }


  /**
   * ユーザー認証(ログイン)を行う
   */
  onLogin() {
    console.log('user-login');

    const dialogRef = this.loginModal.open(LoginComponent, {
      width: '400px',
      height: '450px',
      data: this.login
    });

    dialogRef.afterClosed().subscribe(
      result => {
        console.log('dialog was closed:', result);
        if (result !== undefined) {
          this.login = result;
          // 画面遷移の結果でモーダルを閉じた場合、各画面に遷移する。
          if (this.login.reissuePasswd) {
            // パスワード画面に遷移
            this.router.navigate(["reissue_passwd_component"])
          }
          if (this.login.newResister) {
            // 新規登録画面に遷移
            console.log("newResister");
            this.router.navigate(["sign-up-component"])
          }
          // ログイン処理を実施する
          this.credentials.mailaddress = this.login.mailaddress;
          this.credentials.password = this.login.passwd;
          this.service.authenticate(this.credentials).subscribe(responce => {
            console.log(responce)
            console.log('url:'+this.router.url)
            this.router.navigateByUrl(this.router.url);
            // 返却された情報からユーザー情報を取得
            if(responce) {
              const user:loginUser = responce;
              this.loginUser = user.userName;
              this.authUser= true;
              // ログイン状態を保持する。
              this.authUserService.login(responce);
            }
          }); 

         
          // return false;
        }
      }
    );
  }


  /**
   * ヘルプを展開する
   */
  onClickHelp() {
    console.log('help');
    this.authUserService.user$.subscribe(hoge => {
      console.log(hoge);
    });
  }

  /**
   * ログアウト押下時
   */
  onLogout() {
    this.authUser= false;
    this.authUserService.logout;
    this.loginUser = 'ログイン';
  }

  /**
   * 新規登録ボタン押下時
   */
  onSinup() {
    this.router.navigate(["sign-up-component"]);
  }




}
