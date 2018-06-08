import { Component } from '@angular/core'; 
import { NavController, NavParams, Events , LoadingController, Platform, ModalController, ViewController  } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';
import { DocumentPage } from '../document/document';  

@Component({
  selector: 'page-documents-list',
  templateUrl: 'documents-list.html',
  providers: [ ApiService, TranslateService ] 
})
export class DocumentsListPage {
  
  public lang: any;  public title: String;   public page_desc: any;  public header: any; public doc_date: any;   public docs_items: any; 
  public pdf_link: any;  public alias: string; public image_path: String; public news_image_path: String;    
  public orders: any[]; public show_orders: Boolean;  public view_order_mode: Boolean;  
  public view_order_title: string;  public view_order_status: string;  public view_visit_date: string;  public view_comment: string;  
  public view_from_date: string;  public view_to_date: string;  public view_price: any;  public patient_photo: any; 
 
	   
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService ) {
  	
  	 this.load_translates();
  	 this.alias =  this.navParams.get('alias') 
  	 this.load_page_params( this.alias );  // load all params this page
  	 
  	 if ( this.alias == 'orders_history' ) {  this.load_orders_history();  this.title = 'Orders History';  }
  	 
  	 this.docs_items = []; 
  	 this.image_path = localStorage.getItem("image_path"); 
  	 this.news_image_path = localStorage.getItem("news_image_path"); 
  	 this.show_orders = false;
  	 this.view_order_mode = false; 
  }
  
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Page Params
   // -------------------------------------------------------------------------
  
  load_page_params( alias ) { 
	       
	      console.log("alias: " + alias);
	        
	       // ----------------- API query to server ----------------------
	       
		    let responce = this.apiService.get_documents(  'view-list', alias, '' ).subscribe( data => {  
				  	 
				    let res = data.json();       console.dir( res ); 
			             
			        if (  res.status == 'ok' ) {  // Success load data   
					   
					   this.header = res.doc_header;
					    
					   if ( this.alias != 'orders_history' ) {   this.title = res.doc_title;  } else {  this.title = 'Orders History';  }
					   
					   this.page_desc = res.doc_content;
					    
					   // load all documents items for this type
					   let items_array = [];
					   for ( let p in res.items ) {  //   console.log( res.patients[ p ] );
						  items_array.push( res.items[ p ] );   
					   }   
					   this.docs_items = items_array;
					 
				}  
					
	        }, error => {    console.log("Error loading data"); }); 
	        // end server query 
  }
   
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('documents-list').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  }
   
   
   
   // -------------------------------------------------------------------------
   // ------------------ Load orders history List
   //-------------------------------------------------------------------------
   
   load_orders_history() { 
	       
	   // ----------------- API query to server ----------------------
	         
		    let responce = this.apiService.get_orders_history().subscribe( data => {  
				  	 
				    let res = data.json();   //  console.dir( res ); 
			             
			        if (  res.status == 'ok' ) {  // Success load data   
					   
					    // load all documents items for this type
					   let orders_array = [];
					   for ( let p in res.orders ) {  //   console.log( res.patients[ p ] );
						  orders_array.push( res.orders[ p ] );
						  //console.dir( res.orders[ p ].selected_items );   
					   }   
					   this.orders = orders_array;
					   this.show_orders = true;
					   
					   this.patient_photo = localStorage.getItem("photo"); 
					   
					   
				   }  
					
	        }, error => {   console.log("Error loading data"); }); 
	        // end server query 
	   
   }
   
   
   
   
   // -------------------------------------------------------------------------
   // ------------------ View saved Order
   //-------------------------------------------------------------------------
     
  
   open_order_view( order_title,  order_status, create_date,  price  ) { 
	   
	   this.view_order_title = order_title;
	   this.view_order_status = order_status;
	   this.view_visit_date = create_date; 
	   this.view_price = price; 
   
	 this.view_order_mode = true; 
		      
   }
   
   
   
   
   
   
   
   // -------------------------------------------------------------------------
   // ------------------ Open full description  
   // -------------------------------------------------------------------------
   
  open_page_details( item_id  ){  
	   this.navCtrl.push( DocumentPage, {  'item_id': item_id,  'doc_type': this.alias  }); 
  }
 
   // -------------------------------------------------------------------------
   // ------------------ Back button action redirect
   // -------------------------------------------------------------------------
  
  backRoute() {  
     
      this.navCtrl.pop();
     //this.navCtrl.push( HomePage, {}, {animate: true, direction: 'back'});

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
   }

}
