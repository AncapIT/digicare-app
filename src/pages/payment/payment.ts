import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import {NavController, NavParams, Events, LoadingController, Platform, Loading} from 'ionic-angular';
import { ToastController } from 'ionic-angular';   
import { AlertController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from "../home/home"; 
import { OrderPage } from '../order/order'; 
import { ConfirmPage } from '../confirm/confirm';


@Component({  
  selector: 'page-payment',
  templateUrl: 'payment.html', 
  providers: [  ApiService, TranslateService  ]
})
export class PaymentPage  {   //  -----------------
	
   public lang: any;
    //public preloader:Loading;
   public title: any;	 public page_content: any;	  public customer_id : any;  public user_email: any; 
   public payment_success: Boolean;  public payment_process: Boolean;  public payment_error: Boolean; 
    
   public cardNumber: string;
   public expiryMonth: string;
   public expiryYear: string;
   public cvc: string;
   public message: string;
   public confirm_saved_data: boolean; public saved_card_codename: any;  public saved_card_system: any; 
   
   constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiService, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public platform: Platform ,  public events: Events, private _zone: NgZone, public cdRef:  ChangeDetectorRef, public translate: TranslateService, private alertCtrl: AlertController  ) { 
	   	 
	   this.load_translates();
	   
	   this.payment_process = true;  this.payment_success = false; this.payment_error = false;
	   
	   // test card params 
	   // this.cardNumber = "4242424242424242"; this.expiryMonth = '11';  this.expiryYear = '22'; this.cvc = '123';
	  
    }   
    
    
    
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('payment').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  }
    
    
    
    
  
	  
 //---------------------------------------------------------------   
 //---------------- get Token Stripe 
 //---------------------------------------------------------------   
  
  getToken( inp ) { 
	  
	   let  cardNumber = ""; let  expiryMonth = ""; let  expiryYear = "";  let cvc = "";
	    
	 	cardNumber = "" + this.cardNumber;
	    expiryMonth = ""+  this.expiryMonth;
	    expiryYear = "" + this.expiryYear;
	    cvc = "" + this.cvc; 
	
	//console.log( "cardNumber: " + cardNumber + " - " + expiryMonth+ " - " + expiryYear+ " - " + cvc );
	
	if ( cardNumber == "" || expiryMonth == "" || expiryYear ==  "" || cvc ==  "" ) { 
		
		//this.apiService.infoMessage( this.lang.error_payment );
		console.log(this.lang.error_payment );
		
	} else { 	
	  
	  	 
     //this.preloader = this.loadingCtrl.create({  content: "", duration: 30000  });  this.preloader.present();

    (<any>window).Stripe.card.createToken({
      'number': cardNumber,
      'exp_month': expiryMonth,
      'exp_year':  expiryYear,
      'cvc':  cvc  
       
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(() => {   
	     
	       
        if (status === 200) {  // --------- BIND CARD TO USER ------------- 
	         
	             let token = response.id;
				 
				 console.log( "Success! Card token: " + token );  
				 
				 let amount = this.navParams.get('amount');
				 let currency = this.navParams.get('stripe_currency'); if ( !currency ) {  currency = 'sek'; }
				 let description = this.navParams.get('description');
				 let action = 'create_charge';
				 let order_id = this.navParams.get('order_id');
				 
				 
				 // ----------------- API query to server ----------------------
	     
				 let responce = this.apiService.create_payment(  token, amount, currency, description,  action,  order_id  )
					 	.subscribe( data => {  
							  	 
							    let res = data.json();  // console.dir( res );   
								  
						        if (  res.status == 'ok'  && res.payment_result  == 'ok' ) {  // Success load data   
								      
								    //this.apiService.infoMessage( this.lang.payment_success );
                                    console.log(this.lang.payment_success );
								  
									this.payment_process = false; 
									this.payment_success = true; 
									//this.preloader.dismiss();
									
							 	} else { 
								 	//this.apiService.infoMessage( this.lang.error_payment );
                                    console.log(this.lang.error_payment );
								 	//this.preloader.dismiss();
								 	this.show_error_block();
							 	}
						     
				}, error => {  
					//this.preloader.dismiss();
					this.show_error_block();
					console.log("Error loading data"); }); 
				// end server query 
				
				
           
        } else {
          
           //this.apiService.infoMessage( response.error.message  );
            console.log(response.error.message );
           this.show_error_block();
           //this.preloader.dismiss(); // disable
         }
      });
    });
    }
  }
  
  
  
  
  show_error_block() { 
	 
	  this.payment_process = false;  this.payment_success = false; this.payment_error = true;
  
  }
	
	
  
  
  //---------------------------------------------------------------   
  //---------------- validate_form
  //---------------------------------------------------------------   
	   
  validate_form( value, input_type ) { 
	 
	 this.cdRef.detectChanges();  //manually launch change detection
   
     //this.cardNumber = value.length > 8 ? value.substring(0,8) : value;
     var numberPattern = /\d+/g;  let clean_val = value.match( numberPattern );
    
     if ( input_type == 'cardNumber' ) {  this.cardNumber = clean_val;  } //  console.log("-->" +  this.cardNumber );
     if ( input_type == 'expiryMonth' ) {  this.expiryMonth = clean_val;  } 
     if ( input_type == 'expiryYear' ) {  this.expiryYear = clean_val;  } 
     if ( input_type == 'cvc' ) {  this.cvc = clean_val;  } 
   }
   
  
  
  
  
   //---------------------------------------------------------------   
  //---------------- cancel_order
  //---------------------------------------------------------------   
	
   
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
  
  
  
  //---------------------------------------------------------------   
  //---------------- close page 
  //---------------------------------------------------------------   
	
  close_page() {
	   
	  this.navCtrl.push( HomePage, {}, { animate: true, direction: 'back'});
  }
  
  
   
  // -------------------------------------------------------------------------
  // ------------------ Back button action redirect
  // -------------------------------------------------------------------------
  
  backRoute() {  
	  
	 this.navCtrl.pop();  
    // this.navCtrl.push( HomePage, {}, {animate: true, direction: 'back'});

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
 
  ionViewDidLoad() {
	  this.BackButtonAction(); 
  } 
     
    
   
  
}

 
