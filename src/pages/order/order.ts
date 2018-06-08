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
import { ConfirmPage } from '../confirm/confirm';

 
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers: [ ApiService, TranslateService ] 
})
export class OrderPage {
  
  public lang: any;
	//public preloader:Loading;
  public title; String;  public page_param: any;  public page_info: any; public product_id: any; public fields: any;  public tomorrow: any; public items: any;
  public choices: any; public currency: String; public currency_place: String;   public user_data: any; public  product_data: any; 
   
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService, private alertCtrl: AlertController  ) {
  	
  	 this.load_translates(); 
  	 
  	this.currency =  localStorage.getItem("currency");
  	this.currency_place =  localStorage.getItem("currency_place");
  	
  	this.user_data = []; 
  	//console.log("order page");
  	  
  }
  
  
   
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('order').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
			});
	    });
  }
  
   
   // -------------------------------------------------------------------------
   // ------------------ Load Input Page Params
   // -------------------------------------------------------------------------
  
  load_page_params() { 
	  		
		this.product_id = this.navParams.get('page_link');  // TODO: page_link should be renamed product_id
  	console.log("order - load_page_params - page_link (product_id): " + this.product_id);
	  		
	  // ----------------- API query to server ----------------------
	   //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
	    
	  let responce = this.apiService.load_product( this.product_id ).subscribe( data => {  
				  	 
			let res = data.json();   //console.dir( res ); 
			//this.preloader.dismiss();
			           
			if (  res.status == 'ok' ) {  // Success load data  
			
				console.log(res);
				this.product_data = res; 
				this.title = res.product_title;
				this.page_info = res.product_desc;
				this.product_id = res.product_id;		// Save product_id because if food_menu, product_id will not contain id value before this line
				
				// get inner pages list
				let items_array = []; 
				let choices = []; 
				let choices_array = [];
				
				// Get product_items
				for ( let p in res.items ) {   
					if( res.items[ p ]["title"] != '' ) {  
						items_array.push( res.items[ p ] );
						
						// Get product_item_choices
						choices_array = [];
						for ( let c in res.items[ p ]["choices"] ) { 
							choices_array.push( res.items[ p ]["choices"][c] );  
						} 
					}   

					// Sort on sort_id
					this.items = items_array.sort(function(a, b) {
						return parseInt(a.sort_id) - parseInt(b.sort_id);
					});
					choices[p] = choices_array.sort(function(a, b) {
						return parseInt(a.sort_id) - parseInt(b.sort_id);
					});
					
				} 
				this.choices = choices;

			}  
		}, error => {
	    	//this.preloader.dismiss();
	    	console.log("Error loading data"); });
	    // end server query 
    }
  
  
  // -------------------------------------------------------------------------
  // ------------------ Send params for confirm and Payment
  // -------------------------------------------------------------------------
  
  next_step() { 
	  
	    //let page_link = this.navParams.get('page_link');
		console.log( "this.user_data = " );  console.dir( this.user_data );  
		console.log( "this.product_data = " );  console.dir( this.product_data );  
	
		let order_array = []; 
		let row: any;  
		let choices = [];
		let prod_item_choices_id: any;
	    for( let ud in this.user_data ) { 
		
				console.log( "ud = " );  console.dir( ud );  
				console.log( "this.user_data = " );  console.dir( this.user_data );  
				console.log( "this.product_data.items[ ud ].title=" ); console.dir( this.product_data.items[ ud ].title );

				row = { 'item_id': ud, 'item_type': this.product_data.items[ ud ].item_type,  'title': this.product_data.items[ ud ].title };
				
				if( this.product_data.items[ ud ].item_type == 'datetime' ) {   
					row.selected = this.user_data[ud].replace("T", " ");  
					row.selected = row.selected.replace("Z", ""); 
				} else if (this.product_data.items[ ud ].item_type == 'single_choice' || this.product_data.items[ ud ].item_type == 'multi_choice') {
					if ('choices' in this.product_data.items[ud]) {					
						// TODO: Needs to be fixed for multi_choice
						prod_item_choices_id = this.user_data[ud];
						row.price 		= this.product_data.items[ud]["choices"][prod_item_choices_id].price;
						row.selected 	= this.product_data.items[ud]["choices"][prod_item_choices_id].title;
						row.prod_item_choices_id = prod_item_choices_id;
					} else {
						row.price 		= this.product_data.items[ud].price;
						row.selected 	= this.product_data.items[ud].title;
					}
				} else {
					row.selected = this.user_data[ud];
				}

				console.log( "row = " );  console.dir( row );  
				order_array.push( row );
	    }
		console.log( "order_array = " );  console.dir( order_array );  
	   
		let validation = true;  
		let error_mess =  '';   
	    
	  if ( validation == true  ) { 
	    this.navCtrl.push( ConfirmPage, {  
		      'order_data':  order_array,
		      'page_link': this.product_id,
		      'order_title': this.title,
		      'currency': this.currency, 
		      'currency_place': this.currency_place 
		      });
	    }
	  else { this.apiService.infoMessage( error_mess );  } // Alert notification
	       
		       
  } // end - next_step
    
    
    
    
  cancel_order() { 
	  
	   let alert = this.alertCtrl.create({
		    title: 'Confirm this action',
		    message: 'Are you sure you want to cancel?',
		    buttons: [
		      {
		        text: 'Cancel',
		        role: 'cancel',
		        handler: () => {
		          console.log('Cancel clicked');
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
	  
  }  // end - cancel_order 
    
   

  // -------------------------------------------------------------------------
  // ------------------ Get date tomorrow for date pick
  // -------------------------------------------------------------------------
   
  get_tomorrow() { 
	  
	    this.tomorrow = this.apiService.get_tomorrow_date(); 
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
    this.load_page_params();
    this.get_tomorrow();
  }

}
