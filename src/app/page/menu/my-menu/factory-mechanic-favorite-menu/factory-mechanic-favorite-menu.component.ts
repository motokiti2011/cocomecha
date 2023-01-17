import { Component, OnInit } from '@angular/core'
import { factoryMechanicFavorite } from 'src/app/entity/factoryMechanicFavorite'
import { CognitoService } from 'src/app/page/auth/cognito.service';
import { Router } from '@angular/router';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiGsiSerchService } from 'src/app/page/service/api-gsi-serch.service';
import { user } from 'src/app/entity/user';

@Component({
  selector: 'app-factory-mechanic-favorite-menu',
  templateUrl: './factory-mechanic-favorite-menu.component.html',
  styleUrls: ['./factory-mechanic-favorite-menu.component.scss']
})
export class FactoryMechanicFavoriteMenuComponent implements OnInit {

  /** お気に入りリスト */
  favoriteList?: factoryMechanicFavorite[];
  /** ユーザー情報 */
  user?: user;

  constructor(
    private cognito: CognitoService,
    private router: Router,
    private apiSerchService: ApiSerchService,
    private apiGsiSerchService: ApiGsiSerchService
  ) { }

  ngOnInit(): void {
    // ログイン検証
    const authUser = this.cognito.initAuthenticated();
    if(authUser == null) {
      alert('ログインが必要です');
      this.router.navigate(["/main_menu"]);
      return;
    }
    this.apiSerchService.getUser(authUser).subscribe(res => {
      if(res != null) {
        // ユーザー情報を設定
        this.user = res[0];
        this.getFavoriteList(authUser);
      }
    });
  }

  /**
   * 工場・メカニックお気入り情報を取得する
   * @param authUser
   */
  private getFavoriteList(authUser: string) {
    this.apiGsiSerchService.serchFcMcFavorite(authUser).subscribe(res => {
      this.favoriteList = res;
    })
  }


  /**
   * 選択した工場・メカニックの商品一覧を表示する
   * @param e
   */
  itemList(e: factoryMechanicFavorite) {
    console.log(e);
  }


}
