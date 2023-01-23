import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';
import { loginUser } from 'src/app/entity/loginUser';
import { AuthUserService } from '../../auth/authUser.service';
import { CognitoService } from '../../auth/cognito.service';
import { ApiSerchService } from '../../service/api-serch.service';


@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private cognito: CognitoService,
    private authUserService: AuthUserService,
    private apiService: ApiSerchService,
  ) { }

  /** 子コンポーネントを読み込む */
  @ViewChild(HeaderMenuComponent) child!: HeaderMenuComponent;

  temporaryUserDiv = false;

  loginUser: loginUser = { userId: '', userName: 'ログイン', mechanicId: null, officeId: null };

  // 認証有無フラグ
  authUserDiv = false;

  ngOnInit(): void {
    this.authenticated();
    this.child.ngOnInit();
  }


  /**
   * サービスを依頼する
   */
  serviceReqest() {
    this.router.navigate(["service_create"],
      { queryParams: { serviceType: '0' } });
  }

  /**
   * サービスを出品する
   */
  serviceExhibit() {
    this.router.navigate(["service_create"],
      { queryParams: { serviceType: '1' } });
  }

  /**
   * サービス一覧
   */
  serviceSerch() {
    this.router.navigate(["service_list"])
  }

  /**
   * サービス検索条件
   */
  serviceSerchConditions() {
    this.router.navigate(["service_serchConditions_component"])
  }


  /**
   * 取引メニュー
   */
  serviceDealings() {
    this.router.navigate(["transaction_menu"])
  }


  /**
   * ユーザー登録ボタン押下時
   */
  onUserResister() {
    this.router.navigate(["user-resister-component"]);
  }

  /**
   * マイページ押下時イベント
   */
  onMypage() {
    console.log("マイページ")
    this.router.navigate(["my-menu-component"]);
  }

  /**
   * 新規登録ボタン押下時
   */
  onSinup() {
    this.router.navigate(["sign-up-component"]);
  }

  /*************** 内部処理  ************************/

  /**
   * ログイン状態確認
   */
  private authenticated() {
    const authUser = this.cognito.initAuthenticated();

    if (authUser !== null) {
      // ログイン状態の場合
      this.authUserDiv = true;
      const log = this.cognito.getCurrentUserIdToken();
      console.log(log);
      // 認証済の場合表示するユーザー情報を取得
      this.setAuthUser(authUser);
    } else {
      this.authUserDiv = false;
    }
  }


  /**
   * 認証情報からユーザー情報を取得
   * @param authUser
   */
  private setAuthUser(userid: string) {

    // 認証済の場合表示するユーザー情報を取得
    this.apiService.getUser(userid).subscribe(data => {
      console.log(data[0]);
      if (data[0]) {

        this.loginUser.userId = data[0].userId;
        this.loginUser.userName = data[0].userName;

        this.authUserService.login(this.loginUser);
        if (data[0].userName == undefined
          || data[0].userName == '') {
          // 仮登録ユーザーのためユーザー登録メッセージを表示
          this.temporaryUserDiv = true;
        } else {
          this.loginUser.userName = data.userName;
          this.temporaryUserDiv = false;
        }
      } else {
        this.loginUser.userName = 'ユーザー情報未設定'
      }
    });
  }



}
