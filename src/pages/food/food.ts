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
  selector: 'page-food',
  templateUrl: 'food.html',
  providers: [ ApiService, TranslateService ] 
})
export class FoodPage {
  
  public lang: any;  public title: String;  public food_menu: any[];  public header: string;
    //public preloader:Loading;
  
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService ) {
  	
  	 this.load_translates();
  	 this.load_food_menu();
  }
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('food').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  }
  
  
   // -------------------------------------------------------------------------
   // ------------------ Load Items Food Menu
   // -------------------------------------------------------------------------
  
  load_food_menu() { 
	   
	   // ----------------- API query to server ----------------------
	        //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
	        
		    let responce = this.apiService.get_food_menu( ).subscribe( data => {  
				  	 
				    let res = data.json();      // console.dir( res ); 
			         //this.preloader.dismiss(); // disable
			            
			        if (  res.status == 'ok' ) {  // Success load data   
					   
					   this.header = res.doc_header;
					   let food_menu = res.food_menu ;  
					   
					   let food  = JSON.parse( food_menu ); 
					    
					    // load all documents items for this type
					   let food_array = [];
					   for ( let p in food ) {  //   console.log( res.patients[ p ] );
						  food_array.push( food[ p ] );   
					   }   
					   this.food_menu = food_array; 
				}  
					
	        }, error => {
		        //this.preloader.dismiss();
		        console.log("Error loading data");
		    });
	        // end server query 
	         
  } 
  
  
   // -------------------------------------------------------------------------
   // ------------------ Save Food Menu
   // -------------------------------------------------------------------------
  
  save_menu() { 
	   
	  let message = 'Food menu successfully saved';
      this.apiService.infoMessage( message );
      
	  this.navCtrl.push( HomePage, {}, {animate: true, direction: 'back'});
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
