import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';

import {HttpClient, HttpClientModule} from "@angular/common/http"; 

import { HttpModule, Http } from '@angular/http'; 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home'; 
import { OrdersListPage } from '../pages/orders-list/orders-list'; 
import { LoginPage } from '../pages/login/login'; 
import { SelectPatientPage } from '../pages/select_patient/select_patient'; 
import { OrderPage } from '../pages/order/order'; 
import { ConfirmPage } from '../pages/confirm/confirm';
import { SettingsPage } from '../pages/settings/settings';  
import { MessagesPage } from '../pages/messages/messages'; 
import { FoodPage } from '../pages/food/food'; 
import { DocumentPage } from '../pages/document/document'; 
import { DocumentsListPage } from '../pages/documents-list/documents-list'; 
import { PaymentPage } from '../pages/payment/payment'; 
import {InternetDownPage} from "../pages/internet-down/internet-down";
import {OneSignal} from "@ionic-native/onesignal";

export function HttpLoaderFactory( httpClient: HttpClient) {  
  return new TranslateHttpLoader( httpClient, './assets/lang/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    HomePage, 
    OrdersListPage, 
    LoginPage,
    SelectPatientPage,
    OrderPage,
    ConfirmPage,
    SettingsPage, 
    MessagesPage,
    FoodPage,
    DocumentsListPage,
    DocumentPage,
    PaymentPage,
    InternetDownPage,
  ],
  imports: [
    BrowserModule, HttpModule, HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }) 
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    OrdersListPage, 
    LoginPage,
    SelectPatientPage,
    OrderPage,
    ConfirmPage,
    SettingsPage, 
    MessagesPage,
    FoodPage,
    DocumentsListPage,
    DocumentPage,
    PaymentPage,
    InternetDownPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    AppVersion,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
