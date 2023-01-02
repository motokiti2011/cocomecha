import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenuComponent } from '../header-menu/header-menu.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(
    private router:Router,
  ) { }

  /** 子コンポーネントを読み込む */
  @ViewChild(HeaderMenuComponent) child!: HeaderMenuComponent;

  ngOnInit(): void {
    this.child.ngOnInit();
  }

  /**
   * サービスを依頼する
   */
  serviceReqest() {
    this.router.navigate(["service_create"],
    { queryParams:{ serviceType : '0'}});
  }

  /**
   * サービスを出品する
   */
    serviceExhibit() {
      this.router.navigate(["service_create"],
      { queryParams:{ serviceType : '1'}});
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
