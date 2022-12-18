import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  HttpClientModule,
  HttpClientJsonpModule,
} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutingGuard } from './page/auth/routing.guard';

import { ServiceListComponent } from './page/menu/service-contents/service-list/service-list.component';
import { MainMenuComponent } from './page/menu/main-menu/main-menu.component';
import { SideMenuComponent } from './page/menu/side-menu/side-menu.component';
import { HeaderMenuComponent } from './page/menu/header-menu/header-menu.component';
import { ServiceCreateComponent } from './page/menu/service-contents/service-create/service-create.component';
import { TransactionMenuComponent } from './page/menu/transaction-menu/transaction-menu.component';
import { TransactionListComponent } from './page/menu/transaction-menu/transaction/transaction-list/transaction-list.component';
import { MyListComponent } from './page/menu/transaction-menu/mylist-tab/mylist-detail/my-list/my-list.component';
import { BrowsingHistoryComponent } from './page/menu/transaction-menu/browsing-history-tab/browsing-history-detail/browsing-history/browsing-history.component';
import { TansactionCompleteComponent } from './page/menu/transaction-menu/transaction-complete-tab/transaction-complete-detail/tansaction-complete/tansaction-complete.component';
import { TransactionMenuService } from './page/menu/transaction-menu/transaction-menu.service';
import { ServiceSerchConditionsComponent } from './page/menu/service-contents/service-serch-conditions/service-serch-conditions.component';
import { LoginComponent } from './page/modal/login/login.component';
import { ReissuePasswdComponent } from './page//auth/reissue-passwd/reissue-passwd.component';
import { SignUpComponent } from './page/auth/sign-up/sign-up.component';
import { ServiceDetailComponent } from './page/menu/service-contents/service-detail/service-detail.component';
import { TrimPipe } from './pipe/trim-pipe/trim-pipe';
import { NextModalComponent } from './page/modal/next-modal/next-modal/next-modal.component';
import { ServiceListSideMenuComponent } from './page/menu/service-contents/service-list/service-list-side-menu/service-list-side-menu/service-list-side-menu.component';
import { MessageDialogComponent } from './page/modal/message-dialog/message-dialog.component';
import { ServiceTransactionComponent } from './page/menu/service-contents/service-transaction/service-transaction.component';
import { QuestionBoardComponent } from './page/modal/question-board/question-board/question-board.component';
import { TransactionMessageComponent } from './page/menu/service-contents/service-transaction/transaction-message/transaction-message/transaction-message.component';
import { OpenLevelComponent } from './page/modal/open-level/open-level/open-level.component';
import { MessagePrmReqComponent } from './page/modal/message-prm-req/message-prm-req/message-prm-req.component';
import { FavoriteComponent } from './page/menu/transaction-menu/favorite-tab/favorite/favorite.component';
import { UserRegisterComponent } from './page/auth/user-register/user-register.component';

import { POST_PROVIDER } from './page/service/interceptors/http-interceptors';
import { MyMenuComponent } from './page/menu/my-menu/my-menu.component';

const ROUTE_TABLE: Routes = [
  { path: '', redirectTo: '/main_menu', pathMatch: 'full' },
  { path: 'main_menu', component: MainMenuComponent },
  { path: 'service_list', component: ServiceListComponent },
  { path: 'service_create', component: ServiceCreateComponent, canActivate: [RoutingGuard] },
  { path: 'transaction_menu', component: TransactionMenuComponent, canActivate: [RoutingGuard] },
  { path: 'service_serchConditions_component', component: ServiceSerchConditionsComponent },
  { path: 'reissue_passwd_component', component: ReissuePasswdComponent, canActivate: [RoutingGuard] },
  { path: 'sign-up-component', component: SignUpComponent },
  { path: 'service-detail-component', component: ServiceDetailComponent },
  { path: 'service-transaction-component', component: ServiceTransactionComponent, canActivate: [RoutingGuard] },
  { path: 'user-resister-component', component: UserRegisterComponent },
  { path: 'my-menu-component', component: MyMenuComponent },


]

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ServiceListComponent,
    SideMenuComponent,
    HeaderMenuComponent,
    ServiceCreateComponent,
    TransactionMenuComponent,
    TransactionListComponent,
    MyListComponent,
    BrowsingHistoryComponent,
    TansactionCompleteComponent,
    ServiceSerchConditionsComponent,
    LoginComponent,
    ReissuePasswdComponent,
    SignUpComponent,
    ServiceDetailComponent,
    TrimPipe,
    NextModalComponent,
    ServiceListSideMenuComponent,
    MessageDialogComponent,
    ServiceTransactionComponent,
    QuestionBoardComponent,
    TransactionMessageComponent,
    OpenLevelComponent,
    MessagePrmReqComponent,
    FavoriteComponent,
    UserRegisterComponent,
    MyMenuComponent,
  ],
  entryComponents: [
    TransactionListComponent,
    MyListComponent,
    BrowsingHistoryComponent,
    TansactionCompleteComponent,
    LoginComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(ROUTE_TABLE),
  ],
  providers: [
    TransactionMenuService,
    // サービス依頼画面日付のMatarial部品日本語化
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    POST_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
