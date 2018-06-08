import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home'; 

@Component({
  selector: 'page-document',
  templateUrl: 'document.html',
  providers: [ ApiService, TranslateService ] 
})
export class DocumentPage {
  
  public lang: any;  public title: String;
    //public preloader:Loading;
  public list_mode: Boolean;   
  public page_desc: any; public big_image: String;  public news_date: String; public header: String; 
  public about_mode: Boolean;  public pdf_link: any; public image_path: String; public news_image_path: String;  public img_folder: String; 
  public show_user_block: Boolean;  public patient_address: String;  public patient_email: String; public patient_name: String;   
  public patient_phone: String;    public patient_photo: String;
  public docType:string;
  
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService ) {
  	
  	 this.image_path = localStorage.getItem("image_path"); 
  	 this.news_image_path = localStorage.getItem("news_image_path"); 
  	 this.show_user_block = false; 
  	  

  }
  
  
   // -------------------------------------------------------------------------
   // ------------------ Load Input Page Params
   // -------------------------------------------------------------------------

  load_page_params() { 
	  
   
	        let item_id = this.navParams.get('item_id');  
	        let doc_type = this.navParams.get('doc_type');
	        this.docType=doc_type;
			  this.translate.stream(`${doc_type}`).subscribe(
				  res=>{
					  console.log("res for "+res+" is ",res);
                      this.header = res.header;
                      this.title = res.title;
                      this.page_desc = res.page_desc;
				  },
				  err=>{
					  console.log(err,"err fetching ");
				  }
			  );
	       // console.log( "load document: " + item_id + " - " + doc_type  );
	     
	        // ----------------- API query to server ----------------------
	        
	        //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
	        
		    let responce = this.apiService.get_documents(  'view-details', doc_type, item_id ).subscribe( data => {  
				  	 
            let res = data.json();    
            console.log("get_documents res=");  console.dir( res ); 
			         //this.preloader.dismiss(); // disable
			            
			        if (  res.status == 'ok' ) {  // Success load data   

						if(doc_type!="help_page" && doc_type!="about_page"){
                            this.header = res.page_info.item_header;
                            this.title = res.page_info.item_title;
                            this.page_desc = res.page_info.item_content;
						}

					   this.big_image = res.page_info.image;
					   this.news_date = res.page_info.item_date;
					   this.pdf_link = res.page_info.pdf_link; 
             
             if ( doc_type == "about_page" ) {
              this.page_desc = ("DigiCare Version " + localStorage.getItem("app_version") + this.page_desc + ""); 
             }

					   if ( doc_type == 'about_patient'  || doc_type == 'implementation'   ) { 
						    
						    this.show_user_block = true; 
						    
							this.patient_address =   localStorage.getItem("address" );     
							this.patient_email =   localStorage.getItem("email");  
							this.patient_name =  localStorage.getItem("first_name") + " " + localStorage.getItem("last_name" );  
						  this.patient_phone =   localStorage.getItem("phone");  
							this.patient_photo =   localStorage.getItem("photo" );
							this.pdf_link =   localStorage.getItem("pdf_link" ); 
					   }
					    
					  // if( doc_type == 'newsletter'  || doc_type == 'about_page'   ) {  
            if( doc_type != 'about_patient' ) {  
              this.img_folder = this.news_image_path ;  
            } else { 
              this.img_folder = this.image_path ;  
            }
					  console.log("img_folder=" + this.img_folder);      	
					}  
					
	        }, error => {
		    	//this.preloader.dismiss();
		    	console.log("Error loading data");
		    });
	        // end server query 
	       
	}
   
   
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('document').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 //this.title = this.lang.title;
			});
	    });
  }
   
   
   // -------------------------------------------------------------------------
   // ------------------ Open full description News
   // -------------------------------------------------------------------------
   
  open_page_details(){ 
	  
	  this.list_mode = false;
	  
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
 
  ionViewDidLoad() { 
    this.BackButtonAction(); 
   }

   ionViewDidEnter(){
       this.load_translates();
       this.load_page_params();
   }

}
