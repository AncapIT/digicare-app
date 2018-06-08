import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { OrdersListPage } from '../orders-list/orders-list'; 
import { SettingsPage } from '../settings/settings';  
import { MessagesPage } from '../messages/messages'; 
import { DocumentsListPage } from '../documents-list/documents-list';  
import { DocumentPage } from '../document/document'; 
import { OrderPage } from '../order/order'; 
import { SelectPatientPage } from '../select_patient/select_patient';
import {OneSignal} from "@ionic-native/onesignal";




@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ ApiService, TranslateService ] 
})
export class HomePage {

  public lang: any; public patient_info: any; public patient_id: Number; public image_path: String;  public pushes: any[];
    //public preloader:Loading;
  public provider_id: Number;  public provider_menu_logo: String;  public provider_logo: String; public provider_image_path: String; 
  public homepage_menu: any[]; public patient_photo: String; 
  public first_name: String;  public last_name: String;  public address: String; 
  
  constructor( public navCtrl: NavController, public _notification: OneSignal, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService,   ) {
  	  
  	  this.load_translates(); 
  	  this.image_path = localStorage.getItem("image_path"); 
  	  this.provider_image_path = localStorage.getItem("provider_image_path");
  	  
  	  this.pushes = []; 
  	  this.first_name = '';  this.last_name = '';  this.address = ''; 	 
  }
  
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('home').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
			});
	    });
  }
  
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Load initital info about user and provider
   // -------------------------------------------------------------------------
  
  load_initial_data() { 
	  
	   this.platform.ready().then(() => {
	        
	      let patient_info = localStorage.getItem("patient_load");   
	  	  if( patient_info != "load" ) {    this.save_patient_data();   } else {   this.load_local_data();  }

           /*
          Initialize the Push Notification data
          */
           this._notification.startInit('KEY', 'APP-ID');
           this._notification.inFocusDisplaying(this._notification.OSInFocusDisplayOption.InAppAlert);
           this._notification.setSubscription(true);
           this._notification.sendTag("user_id", String(this.patient_id));
           this._notification.handleNotificationReceived().subscribe(() => {
               // do something when notification is received
           });

           this._notification.handleNotificationOpened().subscribe((jsonData) => {
               // do something when a notification is opened
               let payLoad = jsonData;
               this.redirectToPage(payLoad);
               //alert('This is data');
               //alert(jsonData);
           });
           this._notification.endInit();
           //End notification
		      
	    });
  }
  
   
   // -------------------------------------------------------------------------
   // ------------------ Load & Save local General info about selected Patient
   // -------------------------------------------------------------------------
  
  save_patient_data() { 
	  
	    let patient_id = +localStorage.getItem("patient_id");   // console.log( "patient_id: " + patient_id ); 
	    this.patient_id = patient_id;
	    
	    
	    if( patient_id > 0 ) { 
	    // ----------------- API query to server ----------------------
	     
		//this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
		      
		let responce = this.apiService.load_patient( patient_id  ).subscribe( data => {  
				  	 
				    let res = data.json();   // console.dir( res ); 
			        //this.preloader.dismiss(); // disable
					  
			        if (  res.status == 'ok' ) {  // Success load data   
					      
					 let provider_id  = res.patient_info.provider_id  ; 
					  
					 this.get_provider_info( provider_id ); 
					 this.load_homepage_items( provider_id );
					 this.load_notifications_list();
					  
					 this.patient_info = res.patient_info;  
					 this.patient_photo = res.patient_info.photo;
					 this.first_name = res.patient_info.first_name;  
					 this.last_name = res.patient_info.last_name;  
					 this.address = res.patient_info.address; 
					  
					 localStorage.setItem("patient_load", "y" ); 
					  
					 localStorage.setItem("provider_id", res.provider_id   );  
					 localStorage.setItem("address", res.patient_info.address );  
					 localStorage.setItem("city", res.patient_info.city );  
					 localStorage.setItem("email", res.patient_info.email );  
					 localStorage.setItem("first_name", res.patient_info.first_name );  
					 localStorage.setItem("last_name", res.patient_info.last_name );   
					 localStorage.setItem("phone", res.patient_info.phone );  
					 localStorage.setItem("photo", res.patient_info.photo ); 
					 
					 this.check_user_level();
					 
					}   
			     
	        }, error => {
			//this.preloader.dismiss();
			console.log("Error loading data");
		});
	        // end server query 
	       }  
	       else {  // if not selected patient
		        this.navCtrl.push( SelectPatientPage  );
	       }
	  
  }

  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Load Local saved information about selected Patient
   // -------------------------------------------------------------------------
  
  load_local_data() { 
	 
	 let provider_id = localStorage.getItem("provider_id");
	 this.patient_photo = localStorage.getItem("photo");  
	 this.patient_id =  +localStorage.getItem("patient_id"); 
	    
	 this.get_provider_info( provider_id);   
	 this.load_homepage_items( provider_id );
	 
	 let patient_info = [{ 
		 first_name: localStorage.getItem("first_name"),
		 last_name: localStorage.getItem("last_name"), 
		 address: localStorage.getItem("address"), 
		 city: localStorage.getItem("city"),  
		 email: localStorage.getItem("email"), 
		 phone:  localStorage.getItem("phone")
		 }];
	  
	 this.patient_info = patient_info;
  }


    redirectToPage(data) {
        let page_route;
        let type;
        let value;
        let article;
        try {
            type = data.notification.payload.additionalData.type;
            value = data.notification.payload.additionalData.value;
        } catch (e) {
            console.warn(e);
        }
        switch (type) {
            case 'messages':
            {

                this.navCtrl.push( MessagesPage );
                //this.nav.push('Article', {item:value});
                break;

            }
            case 'newsletter':
            {
                page_route = DocumentsListPage;
                //this.nav.setRoot('Category', {item: value});
                this.navCtrl.push( page_route, {  'alias': 'newsletter', 'page_link':  'newsletter', 'doc_type':  'newsletter'  });
                break;
            }
            case 'billboard':
            {
                page_route = DocumentPage;
                //this.nav.setRoot('Category', {item: value});
                this.navCtrl.push( page_route, {  'alias': 'billboard', 'page_link':  'billboard', 'doc_type':  'billboard'  });
                break;
            }
        }
    }




    // -------------------------------------------------------------------------
  // ------------------ Loading Provider Info
  // -------------------------------------------------------------------------
  
  get_provider_info( provider_id ) {  
	  
	     // ----------------- API query to server ----------------------
	     
		 let responce = this.apiService.get_provider_info( provider_id  ).subscribe( data => {  
				  	 
				    let res = data.json();   // console.dir( res );   
					  
			        if (  res.status == 'ok' ) {  // Success load data   
					      
					    this.provider_menu_logo = res.provider_menu_logo;
					    this.provider_logo = res.provider_logo;
					    localStorage.setItem("provider_menu_logo", res.provider_menu_logo );
					    localStorage.setItem("provider_logo", res.provider_logo ); 
					    localStorage.setItem("currency", res.currency ); 
					    localStorage.setItem("stripe_currency", res.stripe_currency ); 
					    localStorage.setItem("currency_place", res.currency_place ); 
					     
					    // send event for left menu
					    let provider_image_path = localStorage.getItem("provider_image_path");
					    let  menu_logo = provider_image_path +"/"+ this.provider_menu_logo;   
					    this.events.publish('functionCall:menu_logo',  menu_logo );
					      
		     		}  else { 
			     		this.apiService.infoMessage( this.lang.error_load_notif ); // Message if incorrect Password
		     		}
			     
	        }, error => {  console.log("Error loading data"); }); 
	        // end server query 
	    
  }
  
  
   
  // -------------------------------------------------------------------------
  // ------------------ Loading List Notifications
  // -------------------------------------------------------------------------
  
  load_notifications_list() { 
	  
	     // ----------------- API query to server ----------------------
	     
		    //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
		   
		    let responce = this.apiService.load_notifications_list( this.patient_id  ).subscribe( data => {  
				  	 
				    let res = data.json();    //console.dir( res ); 
			        //this.preloader.dismiss(); // disable
					  
			        if (  res.status == 'ok' ) {  // Success load data   
					    
					   // load all notifications for patient
					   let pushes_array = [];
					   for ( let p in res.mess_list ) {  //   console.log( res.patients[ p ] );
						  pushes_array.push( res.mess_list[ p ] );   
					   }   
					  this.pushes = pushes_array;
					   
					     
		     		}  else { 
			     		this.apiService.infoMessage( this.lang.error_load_notif ); // Message if incorrect Password
		     		}
			     
	        }, error => {
		    	//this.preloader.dismiss();
		    	console.log("Error loading data");
		    });
	        // end server query 
	    
  }
  
  
  // -------------------------------------------------------------------------
  // ------------------ Loading Home page Menu Items
  // -------------------------------------------------------------------------
  
  load_homepage_items( provider_id ) { 
	  
	     // ----------------- API query to server ----------------------
	      
		    let responce = this.apiService.load_homepage_items( provider_id ).subscribe( data => {  
				  	 
				    let res = data.json();   //console.dir( res ); 
			           
			        if (  res.status == 'ok' ) {  // Success load data   
					   
					   // save homepage items
					   let homepage_array = [];
					   for ( let p in res.menu_items ) {   
						   homepage_array.push( res.menu_items[ p ] );  
						  } 
					   
					    
					    // check access level menu item
					    let user_id = localStorage.getItem("user_id");  
					    if ( !user_id || user_id == '' || user_id === undefined || user_id == 'undefined'  ) { 
					   		  
					   	   let filtered_array = [];
							   for ( let p in homepage_array ) { 
								   
								   if( homepage_array[ p ].level != 'staff' ) {    
								   		filtered_array.push( homepage_array[ p ] );  
								   } 
							 
								} 
							homepage_array = filtered_array; 	
						}    
						this.homepage_menu = homepage_array; 
				 }
			 
			  }, error => {   console.log("Error loading data"); }); 
	        // end server query 
	    
  }
   
  
 
   // -------------------------------------------------------------------------
   // ------------------ Remove one notification from list
   // -------------------------------------------------------------------------
  
 
 remove_notifiation( pid ) { 
	 
	  let pushes_array = [];
	  for ( let p in this.pushes ) {   
		  	if ( this.pushes[ p ].pid  != pid  ) {
			  	pushes_array.push( this.pushes[ p ] ); 
			}    
	  }   
	  this.pushes = pushes_array;
  } 
	 
	 
	//---------------------------------------------------------------   
	//---------------- Toggle User Level
	//---------------------------------------------------------------   
	
	check_user_level() { 
	  
	  let level = ''; 	  // hide menu ite, selected patients
	  let user_id: any =  localStorage.getItem("user_id");  
	  if( user_id*1 > 0  ) {  level = 'staff';  } else { level = 'patient';   }
	   
	  this.events.publish('functionCall:user_level',  level );
	  
	  }
	 
	 
	   	 
	 
	 
   // -------------------------------------------------------------------------
   // ------------------ Open link by click in notification
   // -------------------------------------------------------------------------
   
	open_notifications( push_type ) { 
		
		if ( push_type == 'alert' ) {   this.open_page( 'newsletter', 'doc-list'  );  }
		if ( push_type == 'news' )  {   this.open_page( 'newsletter', 'doc-list'  );  }
		if ( push_type == 'message' )  {   this.navCtrl.push( MessagesPage );  }
	}	 
	  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Redirect to Pages from big buttons
   // -------------------------------------------------------------------------
  
  open_page( page_name, page_type ) {
	   
	   let page_route; 
	   
	   if ( page_type == 'orders-list' ) {  page_route = OrdersListPage;  }
	   if ( page_type == 'order' || page_type == 'product' ) {  page_route = OrderPage;  }
	   if ( page_type == 'doc-list' ) {  page_route = DocumentsListPage;  }
	   if ( page_type == 'document' ) {  page_route = DocumentPage;  }
	   
	   //------- toggle Inner Pages
	   
	   if ( page_name == 'select_patient' ) {   this.navCtrl.push( SelectPatientPage ); }  	 
	   if ( page_name == 'settings' ) {   this.navCtrl.push( SettingsPage ); }  
	   if ( page_name == 'messaging' ) { this.navCtrl.push( MessagesPage ); }   
	   if ( page_name == 'none' ) { this.navCtrl.push( HomePage );  }
	   
	   // -------- toggle outer Pages
	    
	   // load pages  
	   if ( page_type != '' ) {  
		    
		    //console.log( "menu_link:" + page_name + ", page_type:" + page_type );
		    this.navCtrl.push( page_route, {  'alias': page_name, 'page_link':  page_name, 'doc_type':  page_name  }); 
		}
  }
  
  
  // -------------------------------------------------------------------------
  // ------------------ open messages chat
  // -------------------------------------------------------------------------
    
  open_messages() { 
	  this.navCtrl.push( MessagesPage  );
  }
   // -------------------------------------------------------------------------
   // ------------------ User Warning about disabled functions
   // -------------------------------------------------------------------------
  
  
  option_disabled() { 
	  
	   let message = 'This feature is currently disabled';
       this.apiService.infoMessage( message );
  }  
  
    
   // -------------------------------------------------------------------------
   // ------------------ Back button action redirect
   // -------------------------------------------------------------------------
  
  backRoute() { 
	  
     // this.navCtrl.push( LoginPage, {}, {animate: true, direction: 'back'});

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
      console.log("homepage did load");
	 this.BackButtonAction(); 
	 this.load_initial_data();   
 }
  
   
}
