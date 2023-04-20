import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderMenuComponent } from './page/menu/header-menu/header-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'haco-mecha';

  heightDiv = false;

  /** 子コンポーネントを読み込む */
  @ViewChild(HeaderMenuComponent) child!: HeaderMenuComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  ngOnInit() {
    this.router.navigate(["/main_menu"])
  }

  /**
   * 遷移先
   */
  onActivate() {
    this.child.ngOnInit();
    const route = this.activatedRoute;
    const routeAny: any = route.snapshot;
    console.log(routeAny._routerState.url);
    const hoge: string = routeAny._routerState.url;
    const hoge2: string[] = hoge.split('?')
    if (hoge2[0] != '/transaction_menu'
      && hoge2[0] != '/factory-mechanic-menu'
      && hoge2[0] != '/service-transaction') {
      this.heightDiv = true;
    } else {
      this.heightDiv = false;
    }
  }

}
