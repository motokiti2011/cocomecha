import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'haco-mecha';

  heightDiv = false;

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
