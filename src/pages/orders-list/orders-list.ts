import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home'; 
import { OrderPage } from '../order/order'; 


@Component({
  selector: 'page-orders-list',
  templateUrl: 'orders-list.html',
  providers: [ ApiService, TranslateService ] 
})
export class OrdersListPage {
  
  public lang: any;  public title: String;  public pages: any[];  public page_info: any;
    //public preloader:Loading;
    public provider_logo: String; public provider_image_path: String; 
  
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService ) {
  	
  	 this.load_translates();
  	 this.provider_logo = localStorage.getItem("provider_logo" ); 
  	 this.provider_image_path = localStorage.getItem("provider_image_path");
 }
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('orders-list').subscribe(( translated ) => {
		    	 this.lang = translated;
		    	 this.title = this.lang.title;
			});
	    });
  }
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Load Input Page Params
   // -------------------------------------------------------------------------
  
  load_page_params() { 
	      
	    let parent_page = this.navParams.get('alias');  
	       
	         // ----------------- API query to server ----------------------
	    //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
	    let responce = this.apiService.load_products_list( parent_page ).subscribe( data => {  
				  	 
				    let res = data.json();  //console.dir( res ); 
			        // this.preloader.dismiss();
			           
			        if (  res.status == 'ok' ) {  // Success load data   
					  
					   this.title = res.title;
					   this.page_info = res.page_desc; 
					   
					   // get inner pages list
					   let  page_array = [];
					   for ( let p in res.menu_items ) {   
						  page_array.push( res.menu_items[ p ] );   
					   } 
					   this.pages = page_array;
					   
					}  
		}, error => {
	        //this.preloader.dismiss();
		console.log("Error loading data",error); });
	    // end server query 
	   
  }
  
  
  
 
  
   // -------------------------------------------------------------------------
   // ------------------ Redirect to Pages from big buttons
   // -------------------------------------------------------------------------
  
  open_page( page_link, page_type ) {  
	     	  
	     	if ( page_type == 'product' ) {  this.navCtrl.push( OrderPage, {  'page_link': page_link  });   } 
  }
  
  
  
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Back button action redirect
   // -------------------------------------------------------------------------
  
  backRoute() {  
	   this.navCtrl.pop();
  }	
  
  // -------------------------------------------------------------------------
  // hardware back button for Android devices
  BackButtonAction() {

    this.platform.registerBackButtonAction(() => {
          this.backRoute();
    });

  }  // end BackButtonAction
       
   
  // -------------------------------------------------------------------------
  // ------------------ Start App Functions
  // -------------------------------------------------------------------------

  ionViewDidEnter() {
  	console.log("order-list did load");
    this.BackButtonAction(); 
    this.load_page_params();
  }

}
