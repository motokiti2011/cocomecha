import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {
  }

  /**
   * サービスを依頼する
   */
  serviceReqest() {
    this.router.navigate(["service_create"])
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

}
