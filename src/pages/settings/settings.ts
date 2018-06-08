import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
 
  
import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home'; 
 
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ ApiService, TranslateService, Camera, File, FileTransfer, FilePath   ] 
})
export class SettingsPage {
  
  public lang: any;
  //public preloader:Loading;
  public title; String;  public active_tab: string; public patient_id: any; public first_name: any; public last_name: any; public city: any;
  public address: any; public email: any; public phone: any;
  public old_password: string; public new_password: string; public confirm_password: string;
  public user_image_path: string; public patient_photo: string; 
  public isApp: Boolean;   public selected_lang: any;  
  
  constructor( public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService 
  , private camera: Camera, private transfer: FileTransfer, private file: File, private filePath: FilePath   ) {
  	
  	 this.load_translates();
  	 
  	 this.user_image_path = localStorage.getItem("image_path");
  	 this.isApp = true;  
  	 
  	 let  selected_lang = localStorage.getItem("selected_lang");
  	 if(  selected_lang != 'se' ) { this.selected_lang = 'en';  } else {  this.selected_lang = 'se';  }
	 
   }
  
   
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('settings').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  }
     
  
  
    
   // -------------------------------------------------------------------------
   // ------------------ Load Local saved information about selected User
   // -------------------------------------------------------------------------
  
  load_user_data() { 
	  
	let user_id = +localStorage.getItem("user_id" ); let patient_id = +localStorage.getItem("patient_id" ); let load_user_id : any;
	if( user_id > 0 ) {  load_user_id = user_id;   } else { load_user_id = patient_id; } 
	 
	// ----------------- API query to server ----------------------
	     
	let responce = this.apiService.load_user(  load_user_id  )
		 	.subscribe( data => {  
				  	 
				    let res = data.json();  // console.dir( res );   
					  
			        if (  res.status == 'ok' ) {  // Success load data   
					     
					 this.patient_id = res.user_info.patient_id; 
					 this.first_name = res.user_info.first_name;      
					 this.last_name = res.user_info.last_name;
					 this.address = res.user_info.address;
					 this.city = res.user_info.city;
					 this.email = res.user_info.email;
					 this.phone =  res.user_info.phone;   
					 this.patient_photo = res.user_info.photo; 
				 	} 
			     
	}, error => {  console.log("Error loading data"); }); 
	// end server query 
	 
  }
  
  
  
  
   // -------------------------------------------------------------------------
   // ------------------ Save and check Profile data
   // -------------------------------------------------------------------------
  
  save_profile( ) {  
	  
	   // fast validation fields
	  
	  let old_lang =localStorage.getItem("selected_lang"); 
	  if( this.selected_lang != 'se' ) { localStorage.setItem("selected_lang",  "en" ); } else {  localStorage.setItem("selected_lang",  "se" ); } 
	  if( old_lang != this.selected_lang ) { window.location.reload();  }
	  
	  ///console.log(  "selected_lang: " +  localStorage.getItem("selected_lang") );
	   
	  if(  this.old_password && ( this.new_password == this.confirm_password  ) ) {
	  
	  } else {  this.apiService.infoMessage( "Verify the password is correct and the password confirmation!" );  }
	  
	  if(  this.patient_id && this.first_name && this.last_name ) {  
		  
		  
		  
	   // ----------------- API query to server ----------------------
	     
		 let responce = this.apiService.update_profile(  
		 	this.patient_id,  this.first_name,  this.last_name, this.address, this.city,  this.email, this.phone, this.old_password, this.new_password  )
		 	.subscribe( data => {  
				  	 
				    let res = data.json();   // console.dir( res );   
					  
			        if (  res.status == 'ok' ) {  // Success load data   
					     
					      let message = 'Profile successfully saved';
					      this.apiService.infoMessage( message );
					      
						  this.navCtrl.push( HomePage, {}, {animate: true, direction: 'back'}); 
					     
					      
		     		}  else { 
			     		this.apiService.infoMessage( "Save Profile Error. Try again!" ); // Message if incorrect Password
		     		}
			     
	        }, error => {  console.log("Error loading data"); }); 
	        // end server query 
	  
	  } else {  this.apiService.infoMessage( "Required fields must be filled!" );  }
  } 
  
   
   
  	
  // -------------------------------------------------------------------------
  // --------------------- Open Phone Camera Gallery
  // -------------------------------------------------------------------------

  private openGallery (): void {
	   
	    this.camera.getPicture({
		        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			    destinationType: this.camera.DestinationType.FILE_URI,      
			    quality: 70,
			    targetWidth: 400,
			    targetHeight: 400,
			    mediaType: this.camera.MediaType.PICTURE,
			    encodingType: this.camera.EncodingType.JPEG,      
			    correctOrientation: true
			  		
		  }).then((imageData) => {
		        
		      this.send_image_to_server( imageData );
		      
		   }, (err) => {
		      console.log(err);
		  });
		  
	}
	
	
	

	
  // -------------------------------------------------------------------------
  // --------------------- Load Profile Avatar
  // -------------------------------------------------------------------------


   send_image_to_server( imageSrc ) {   
	   
	   //this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
		
	 	
	   this.platform.ready().then(() => {   
		     
		    let user_id = localStorage.getItem("user_id"); 
		    let patient_id = localStorage.getItem("patient_id"); 
			if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
		    
		    let  authToken = localStorage.getItem("authToken"); 
		      
		    var url =  "https://" + localStorage.getItem("api_domain") + "/api/upload_image/";  // API method 
			var targetPath = imageSrc; 
			var filename =  this.apiService.random_string() + '.jpg';
			var options = {
			  fileKey: "wpua-file",
			  fileName: filename,
			  chunkedMode: false,
			  mimeType: "multipart/form-data",
			  params : {
			    "image": targetPath,
			    "wpua-file": targetPath,
			    "user_id": user_id,
			    "authToken": authToken,
			    "action": 'update_user_photo'
			  }  
			};
		   
	  	     
		    const fileTransfer: any = this.transfer.create(); 
		  
			fileTransfer.upload( targetPath, url, options).then(data => {   console.dir( data );  
			  	
			 let serverdata = JSON.parse(data.response);   
			  
			 if ( serverdata.updated == true  ) {    
			   
			  this.apiService.infoMessage( "User Profile photo uploaded successfully" ); 
			  localStorage.setItem("photo",  filename ); 
			  
			  //this.preloader.dismiss();
			  this.navCtrl.pop();  
			   
			  }  else {
			 	//this.preloader.dismiss();
			 	this.apiService.infoMessage( "Error loading image!" );  }
	
			 }, err => {
			  console.log(err);
			  //this.preloader.dismiss(); // disable
			});
			
	 });
	  
   }  
   
   
   
   
   // -------------------------------------------------------------------------
  // ------------------ web Upload get path to file
  // -------------------------------------------------------------------------
 	
	fileChanged(e: Event) {
	    var target: any = e.target as HTMLInputElement;
	    for(var i=0;i < target.files.length; i++) {
	        this.upload(target.files[i]);
	    }
	}
	
	upload(img: any) {
		
			
		//this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
		
		//----------------- input params for uploading 
		
		let url =  "https://" + localStorage.getItem("api_domain") + "/api/upload_image/";  // API method 
		  
		let user_id = localStorage.getItem("user_id"); 
		if ( !user_id || user_id === undefined || user_id == 'undefined' ) {   user_id = localStorage.getItem("patient_id");  }
	    
	    let  authToken = localStorage.getItem("authToken");  
	    
		// --------------- create form for upload image data from browser ----------------
		
	    var formData: FormData = new FormData();
	    
	    var filename =  this.apiService.random_string() + '.jpg';
	    
	    formData.append("image", img,  filename );
	    formData.append("wpua-file", img, filename );
	    formData.append('authToken', authToken );  
		formData.append('user_id', user_id );   
		formData.append('action', 'update_user_photo' );  
	
	    var xhr = new XMLHttpRequest();
	    xhr.upload.addEventListener("progress", (ev: ProgressEvent) => {
	        
	         if(  ev.loaded >= ev.total  ) {  // if file upload complete
	        
	          this.apiService.infoMessage( "User Profile photo uploaded successfully" ); 
			  localStorage.setItem("photo", img.name  ); 
			  //this.preloader.dismiss();
			  this.navCtrl.pop(); 
			}	  
	    });
	    xhr.open("POST", url , true);
	    xhr.send(formData);
	} // end web Upload 
	

	

  // -------------------------------------------------------------------------
  // ------------------ Check App Or Web-version
  // -------------------------------------------------------------------------
  	
  check_platform() { 
	  
	 this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
	 
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
 
  ionViewDidEnter() {
	  
    this.BackButtonAction();   
    this.load_user_data();
    this.check_platform();
  }

}
