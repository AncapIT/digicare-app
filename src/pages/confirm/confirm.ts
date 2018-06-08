import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';
import { OrdersListPage } from '../orders-list/orders-list';
import { OrderPage } from '../order/order';
import { PaymentPage } from '../payment/payment'; 

 
@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
  providers: [ ApiService, TranslateService ] 
})
export class ConfirmPage {
  
  public lang: any;
	//public preloader:Loading;
  public title; String;  public order_price: any; public currency_place: any;  public currency: any; 
  public order_data: any;   public tomorrow: any;  public page_desc: any;    
  
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService, private alertCtrl: AlertController  ) {
  	
  	 this.load_translates();
  	 this.order_price = 0;  
  }
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Load input params 
   // -------------------------------------------------------------------------
  
  load_confirm_params() { 
	    
	    this.platform.ready().then(() => {
	        
					this.order_data = this.navParams.get('order_data');  
					console.log("load_confirm_params - this.order_data="); console.dir( this.order_data );  
	        
	        let order_price = 0; 
	        // get total order price
	          for( let item in this.order_data ) {  
		          if (this.order_data[ item ].price) {
								order_price = +order_price + +this.order_data[ item ].price;
							}
	          }
	         if ( order_price > 0 ) {  this.order_price = order_price;   } 
	         
	        this.currency_place = this.navParams.get('currency_place'); 
	        this.currency = this.navParams.get('currency');  
	    });
  }
   
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('confirm').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  }
     
  
  // -------------------------------------------------------------------------
  // ------------------ Check Params and redirect payment
  // -------------------------------------------------------------------------
     
  next_step() { 
	  
	  let page_link = this.navParams.get('page_link'); 
	  let price = this.order_price;
	  let currency = this.currency; 
	  let order_data = this.order_data;
	  let order_title = this.navParams.get('order_title');  
	  
	  	// ----------------- API query to server ----------------------
	   
	        //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
	        
		    let responce = this.apiService.save_order( order_title, page_link, order_data,  price, currency  ).subscribe( data => {  
				  	 
				let res = data.json();       // console.dir( res ); 
			    //this.preloader.dismiss(); // disable
			            
			    if (  res.status == 'ok' ) {  // Success load data   
					
					if ( price > 0 ) {     
					    
					  if ( currency == 'SEK' || !currency || currency == '' ) {  currency = 'sek'; }
					  if ( currency == 'EUR' ) {  currency = 'eur'; }
					  if ( currency == 'USD' ) {  currency = 'usd'; } 
					  
					  let provider_id = localStorage.getItem("provider_id");  
					  
					  let description = 'Order id:' + provider_id +"-"+ res.order_id +'. '+ order_title + ": " + price +" "+ currency +"."; 
					  
					  this.navCtrl.push( PaymentPage, {  'amount': price,  'currency': currency,  'description': description,  'order_id': res.order_id  }); 
					    
					} else { 
						
						let message = this.lang.order_saved;
						this.apiService.infoMessage( message );
						this.navCtrl.push( HomePage, {}, {animate: true, direction: 'back'});
				 	}
			 	}  
					
	        }, error => {
		    	//this.preloader.dismiss();
		    	console.log("Error loading data");
		    });
	        // end server query 
	     
  } 
  
   cancel_order() { 
	   
	   let alert = this.alertCtrl.create({
		    title: 'Confirm this action',
		    message: 'Are you sure you want to cancel?',
		    buttons: [
		      {
		        text: 'Cancel',
		        role: 'cancel',
		        handler: () => {
		          // console.log('Cancel clicked');
		        }
		      },
		      {
		        text: 'Yes',
		        handler: () => {
		           this.navCtrl.push( HomePage, {}, {animate: true, direction: 'back'});
		        }
		      }
		    ]
		  });
		  alert.present();
		
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
	  
    this.BackButtonAction();  
    this.load_confirm_params();
  }

}
