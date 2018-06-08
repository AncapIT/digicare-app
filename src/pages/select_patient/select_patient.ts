import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login'; 

@Component({
  selector: 'page-select_patient',
  templateUrl: 'select_patient.html',
  providers: [ ApiService, TranslateService ] 
})
export class SelectPatientPage {
  
  public lang: any;
  //public preloader:Loading;
  public isDataFetched:boolean=false;
  public patients: any[]; public patients_full: any[];  public title: String; public staff_id: Number; 
  public image_path: String;  public list_mode: Boolean;  public no_patients: Boolean; 
  
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService ) {
  	
  	 this.load_translates();
     this.image_path = localStorage.getItem("image_path"); 
     this.list_mode = true;
  }
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('select_patient').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  }
  
  
  
  
  // -------------------------------------------------------------------------
  // ------------------  Loading Patients List
  // -------------------------------------------------------------------------
  
  load_patients_list() {   
		  
		    // ----------------- API query to server ----------------------
	     
	  		//this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
		    let user_id = localStorage.getItem("user_id" );  
		    
		    let responce = this.apiService.load_patients_list( user_id  ).subscribe( data => {  
				  	 
				    let res = data.json();  console.dir( res ); 
			        //this.preloader.dismiss(); // disable
					  
			        if (  res.status == 'ok' ) {  // Success load data   
					     
					   if ( res.patients_num > 0 ) { this.no_patients = false; } else { this.no_patients = true; }
					       
					   if ( res.patients_num <= 4) {  this.list_mode = false;   } // toggle patients list view 
					   
					    // load all patients list for this staff/relative
					   let patients_array = [];
					   for ( let p in res.patients ) {  //   console.log( res.patients[ p ] );
						  patients_array.push( res.patients[ p ] );   
					   }
					   this.patients = this.patients_full = patients_array;
					   this.isDataFetched=true;
					     
		     		}  else { 
			     		this.apiService.infoMessage( this.lang.req_pass ); // Message if incorrect Password
                        this.isDataFetched=true;
		     		}
			     
	        }, error => {
		        //this.preloader.dismiss();
		        console.log(error,"Error loading data");
	            this.isDataFetched=true;
		    });
	        // end server query 
	         
    }
  
  
  
  
  // -------------------------------------------------------------------------
  // ------------------ Searchbar functions
  // -------------------------------------------------------------------------
  
  onInput( $event ) { 
	   
	let search = $event.srcElement.value; //console.dir(search);
	
	this.patients = this.patients_full; 
	
	let filtered_array = [];
	for ( let p in this.patients ) {  //   
		
		let search_string = this.patients[ p ].first_name; 
		let result = search_string.search(new RegExp( search, "i"));
		
		//console.log( search_string  + " >> " + result  );
		if ( result != -1  ) { 
			 filtered_array.push( this.patients[ p ] );
		 } 
	}
	this.patients = filtered_array; // final filterd array
					   
		 
  } // end - onInput
  
  // if user clear input field - return full array
  onCancel( $event ) { 
	  this.patients = this.patients_full; 
  } 
  
  
   // -------------------------------------------------------------------------
   // ------------------ Redirect to Home page for this Patient
   // -------------------------------------------------------------------------
  
  open_Patient( patient_id ) { 
	   
	   localStorage.setItem("patient_id", patient_id );
	   this.navCtrl.push( HomePage );
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
    let patientsCount=this.navParams.get("patientsCount");
    if(!patientsCount){
        this.load_patients_list();
	}
	else{
		if ( patientsCount > 0 ) {this.no_patients = false;}
		if ( patientsCount <= 4) {this.list_mode = false;}
		let patients=this.navParams.get("patients");
        let patients_array = [];
        for ( let p in patients ) {  //   console.log( res.patients[ p ] );
            patients_array.push( patients[ p ] );
        }
        this.patients = this.patients_full = patients_array;
    }

  }

}
