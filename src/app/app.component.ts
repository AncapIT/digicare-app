import { Component, ViewChild, enableProdMode } from '@angular/core';
import {Nav, Platform, Events, App, Loading} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Network } from '@ionic-native/network';

import { ApiService } from './api.service';
import { TranslateService } from '@ngx-translate/core'; 

import { HomePage } from '../pages/home/home'; 
import { OrdersListPage } from '../pages/orders-list/orders-list';
import { LoginPage } from '../pages/login/login';
import { OrderPage } from '../pages/order/order'; 
import { SettingsPage } from '../pages/settings/settings';  
import { DocumentsListPage } from '../pages/documents-list/documents-list'; 
import { MessagesPage } from '../pages/messages/messages';
import { DocumentPage } from '../pages/document/document'; 
import { SelectPatientPage } from '../pages/select_patient/select_patient'; 
import {InternetDownPage} from "../pages/internet-down/internet-down";
import {OneSignal} from "@ionic-native/onesignal";


enableProdMode(); // ionic run ios --prod

@Component({
  templateUrl: 'app.html',
   providers: [ ApiService, Network ] 
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any =  LoginPage;  // PaymentPage; // SelectPatientPage; // LoginPage; // HomePage;

  pages: Array<{title_en: string, title_se: string, component: any, icon: string, load: string  }>;
  public menu_logo: String; 
  public offline_alert:  boolean;  public user_level: any; public user_lang: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
  public translate: TranslateService, private apiService: ApiService, public network: Network, public events: Events,
              private _notification: OneSignal,
              private app:App,
              ) {
	  
	  let user_lang = localStorage.getItem("selected_lang");
	  if( user_lang != 'en' ) {   this.user_lang  = 'se';  } else { this.user_lang  = 'en';  }
	  //console.log( "userLang: " + user_lang );
	  
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title_en: 'Home', title_se: 'Startsidan', component: HomePage, icon: 'ios-apps', load: '' },  // 
      { title_en: 'Switch Patient',  title_se: 'Byt brukare',  component: SelectPatientPage, icon: 'md-checkmark-circle-outline', load: '' }, // 
	  { title_en: 'Settings', title_se: 'Inställningar', component: SettingsPage, icon: 'ios-cog', load: '' }, // 
      { title_en: 'Help', title_se: 'Hjälp',  component: DocumentPage, icon: 'md-bookmarks', load: 'help_page' }, // 
      { title_en: 'Orders History', title_se: 'Beställningar', component: DocumentsListPage, icon: 'ios-list-box', load: 'orders_history' }, // 
      { title_en: 'About', title_se: 'Om', component: DocumentPage, icon: 'md-information-circle', load: 'about_page' }, // 
      { title_en: 'Logout', title_se: 'Logga ut',  component: LoginPage, icon: 'md-log-out', load: 'logout' }  // 
    ];
    
  }

  initializeApp() {
    this.platform.ready().then(() => { 
	    
      this.statusBar.styleDefault();
      this.splashScreen.hide();
         
	   //------------------------------------ Subcribe events    
	  this.events.subscribe('functionCall:user_level', eventData => {    
			  
			  let user_level = eventData ;
			  if( user_level == 'patient' ) { 
				  this.pages = [
				  
				  { title_en: 'Home', title_se: 'Startsidan', component: HomePage, icon: 'ios-apps', load: '' },  // 
			      { title_en: 'Settings', title_se: 'Inställningar', component: SettingsPage, icon: 'ios-cog', load: '' }, // 
			      { title_en: 'Help', title_se: 'Hjälp',  component: DocumentPage, icon: 'md-bookmarks', load: 'help_page' }, // 
			      { title_en: 'Orders History', title_se: 'Beställningar', component: DocumentsListPage, icon: 'ios-list-box', load: 'orders_history' }, // 
			      { title_en: 'About', title_se: 'Om', component: DocumentPage, icon: 'md-information-circle', load: 'about_page' }, // 
			      { title_en: 'Logout', title_se: 'Logga ut',  component: LoginPage, icon: 'md-log-out', load: 'logout' }  // 
			      
			       ];
		       }
	    }); // end - events subcribe
	  
	  
	   //------------------------------------ Subcribe events    
	  this.events.subscribe('functionCall:menu_logo', eventData => {    
		  this.menu_logo = eventData ; 
	   }); // end - events subcribe

        this.app.viewWillEnter.subscribe(
            (params) => {
                if(!params.instance.isExcluded && !(params instanceof Loading)){
                    if(this.network.type=="none"){
                        let preloader=params.instance.preloader;
                        if(preloader) preloader.dismiss();
                        this.nav.push(InternetDownPage);
                    }
                }
            }
        );

    });
  }

 
 
 
  
 // -------------------------------------------------------------------------

 
    openPage(page) {
       
       this.nav.setRoot( HomePage ); 
       
       if( page.load == 'logout') {   
	       console.log("reload");
	       localStorage.setItem("patient_id", "");  localStorage.setItem("user_id", "");  window.location.reload();
	    } 
        
       if( page.load == '' ) { 
	       this.nav.push( page.component );  
       } else { 
	      
	      this.nav.push( page.component, {  'alias': page.load, 'doc_type': page.load  }); 
	   }	
    }
  
 
   
 // -------------------------------------------------------------------------

   
 check_Network() {  
	 
  this.network.onConnect().subscribe(data => {
       this.apiService.infoMessage_confirm( 'You are online!' ); 
  }, error => console.error(error));
 
  this.network.onDisconnect().subscribe(data => {
     this.apiService.infoMessage_confirm( 'You currently have no internet access or there was another problem reaching our servers. Please check your internet connection and try again.' ); 
  }, error => console.error(error));
  
}

 
 
    // -------------------------------------------------------------------------
   // ------------------ Load Actions After View Init
   // -------------------------------------------------------------------------
    
  ngAfterViewInit() {
	  
	  let selected_lang = localStorage.getItem("selected_lang");
	  let userLang = '';
	    
	  if( selected_lang != 'en' &&  selected_lang != 'se'  ) { 
		  /*
		  userLang = navigator.language.split('-')[0];
		  userLang = /(se)/gi.test(userLang) ? userLang : 'se';
		  localStorage.setItem("selected_lang", userLang );
		  // console.log( "userLang: " + userLang );
		  */
		  localStorage.setItem("selected_lang", 'se' );
		  selected_lang = 'se';
		  userLang = 'se';
		  
	  }  else { 
		  userLang = selected_lang;
	  }
  	  this.translate.setDefaultLang( userLang );
  	  this.translate.use( userLang ); 
  	  
  	  //this.check_Network();
   	  
	}

  
  

}
