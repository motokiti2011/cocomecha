import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'haco-mecha';

  footerDiv = false;

  constructor(
    private router:Router,
    private activatedRoute: ActivatedRoute
  ){};

  ngOnInit() {
    this.router.navigate(["/main_menu"])
  }

  /**
   * 遷移先
   */
  onActivate() {
    const route = this.activatedRoute;
    const routeAny:any = route.snapshot;
    console.log(routeAny._routerState.url);
    if(routeAny._routerState.url == '/main_menu') {
      this.footerDiv = true;
    } else {
      this.footerDiv = false;
    }
  }

}
