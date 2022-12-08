import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../../modal/login/login.component';
import { HeaderMenuService } from './header-menu.service';
import { loginUser } from 'src/app/entity/loginUser';
import { AuthUserService } from '../../auth/authUser.service';
import { CognitoService } from '../../auth/cognito.service';


@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

  loginUser: string = 'ログイン';

  login = {
    userName: '',
    passwd: '',
    selected: false,
    reissuePasswd: false,
    newResister: false
  }

  // 認証有無フラグ
  authUser = false;

  constructor(
    private router: Router,
    private service: HeaderMenuService,
    public loginModal: MatDialog,
    private cognito: CognitoService,
    private authUserService: AuthUserService,
  ) { }

  ngOnInit(): void {
    this.authenticated();;
  }

  cocomecha() {
    console.log('cocomecha')
    this.router.navigate(["/main_menu"])
  }



  /**
   * ログイン状態確認
   */
  private authenticated() {
    const authUser = this.cognito.initAuthenticated();

    if (authUser !== null) {
      // ログイン状態の場合
      this.authUser = true;
      const log = this.cognito.getCurrentUserIdToken();
      console.log(log);
      // 認証済の場合表示するユーザー情報を取得
      this.setAuthUser(authUser);
    } else {
      this.authUser = false;
    }
  }

  /**
   * 認証情報からユーザー情報を取得
   * @param authUser
   */
  private setAuthUser(authUser: string) {
    // 認証済の場合表示するユーザー情報を取得
    // this.apiService.getUser(authUser).subscribe(data => {
    //   console.log(data);
    //   if (data.Items[0]) {
    //     this.loginUser = data.Items[0].userName;
    //     this.unRegistered = false;
    //     // Subjectにログイン状態を保持する。
    //     this.auth.login(data.Items[0]);
    //   } else {
    //     this.loginUser = 'ユーザー情報未設定'
    //     this.unRegistered = true;
    //   }
    // });
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
        console.log(result);
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
          if(this.login.userName) {
            // ユーザー情報を取得

            // ログイン状態を保持する。
            // this.authUserService.login();
            this.authUser = true;
          }

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
    this.authUser = false;
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
