import { Component , ViewChild } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Content, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
 
import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
 
import { HomePage } from '../home/home'; 
 
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html', 
  providers: [   ApiService, TranslateService,  Camera, File, FileTransfer, FilePath ]
})
export class MessagesPage { 
 
   @ViewChild(Content) content: Content;  
	 
  	
  public lang: any;  public title; String;
    //public preloader:Loading;
  public scrollPosition: number = 0;
  public messages:any;  
  public limit:number = 10;
  public groupInfo:any;
  public groupMembersInfo:any;
  public groupMembersStr:String = '';
  public membersInfo:any;
  public currentUser:any;
  public groupId:String;
  public messageText:String = '';
  public profilepic: any;
  public current_user_id: any; 
  public refreshData: any;
  public today: any; 
  public first_message_timestamp; public frame_path; 
  public user_image_path: String; public chat_img_path: String; 
  public user_to: any; public first_name: String; public last_name: String;  
  public chat_update_flag: any;  public last_message_id: any; 
  public isApp: Boolean;
  public isFirstLoading:boolean=true;
   
   constructor(       public navCtrl: NavController, public navParams: NavParams, public platform: Platform,  public toastCtrl: ToastController ,  public events: Events , public loadingCtrl: LoadingController, private modalCtrl: ModalController, public translate: TranslateService, public viewCtrl: ViewController, private apiService: ApiService, public sanitizer:DomSanitizer,  private camera: Camera, private transfer: FileTransfer, private file: File, private filePath: FilePath     ) {  
 		     
	this.groupId = '1';
    this.groupInfo = 1;
    this.groupMembersInfo = 1;
    this.membersInfo = 1;
    this.groupMembersStr = '';
    this.currentUser = 1;
    this.current_user_id = 111;
      
	this.messages =  [];  
	this.profilepic = ''; 
	
	this.user_image_path = localStorage.getItem("image_path");
	this.chat_img_path = localStorage.getItem("chat_img_path");
	
	this.user_to = 0;
	
	this.first_name = localStorage.getItem("first_name");
	this.last_name = localStorage.getItem("last_name");
	
	this.last_message_id = 0;
	this.isApp = true; 
 
    } 
     
	 
	 
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('messages').subscribe(( translated ) => {
		    	 this.lang = translated; // console.dir(translated);
		    	 this.title = this.lang.title;
			});
	    });
  } 
	  
	
	
	//---------------------------------------------------------------   
	//---------------- load_messages_list    
	//---------------------------------------------------------------   

	load_messages_list() { 
		
		let user_type = localStorage.getItem("user_type"); // patient | staff
		let user_to; let user_from; 
		
		if( user_type == 'staff' ) { 
		   user_from = localStorage.getItem("user_id"); 	
		   this.user_to = localStorage.getItem("patient_id"); 
		}
		if( user_type == 'patient' ) { 
		   user_from = localStorage.getItem("patient_id"); 	
		   this.user_to = 0; 
		}
	    
	   // ----------------- API query to server ----------------------
	      let responce = this.apiService.get_chat( user_from, this.user_to, user_type, this.last_message_id   ).subscribe( data => {  
				  	 
				    let res = data.json();      //console.dir( res  ); 
			        if (  res.status == 'ok' ) {  // Success load data   
					   
					    if( res.updated == 'y' ) { 
						   
						   this.last_message_id = res.last_message_id;
						   
						   // load all messages from chat
						   let messages_array = [];
						   for ( let p in res.messages ) {     
							  messages_array.push( res.messages[ p ] );   
						   }    
						  this.messages = messages_array;
                            setTimeout(()=>{
                            	if(this.isFirstLoading){
                            		this.isFirstLoading=false;
                                    this.content.scrollToBottom(1000);
								}

                            },500)
					    } 
					}  
			 }, error => {  console.log("Error loading data"); }); 
	    // end server query 
			

		if ( this.messages.length > 0  ) {  
			
			 } else {  // paste first chat message
			 
			/* let first_message = [{  
							         user_type: 'agent',
									 time: this.get_today(),
									 messageText: 'Hello, how can I help you today?',
									 attachment_url: '',
									 collocutor_photo: 'staff-1.jpg',
									 user_photo: ''
					             }]; 
		    this.messages = first_message;  
			*/				 
		    }
		    
	} 
 
 
 
 
  // -------------------------------------------------------------------------		        	 
   
	sendMessage( messageText ) {
	    
	    let patient_photo = localStorage.getItem("photo");  
	    
	    let messageObj = { 
	        user_type: 'user',
			messageText: messageText,
			time:  this.get_today(),
			attachment_url: '',
			collocutor_photo: '',
			user_photo: patient_photo,
	    };
	    if (  this.messages.length == 0 ) { this.messages = []; }
	    
	    if ( messageText != '' ) {  // if text message exist send it to server 
		     
		   // this.messages.push(messageObj); 
		   this.messageText = '';
		     
			// ----------------- API query to server ----------------------
		       let responce = this.apiService.send_chat( messageText, this.user_to ).subscribe( data => {  
					  	 
					    let res = data.json();     // console.dir( res );   
				            
				        if (  res.status == 'ok' ) {  // Success load data   
						    
						    this.load_messages_list();
						   // console.log( "Message sended to user: " + this.user_to  );
						   
					    }  
				 }, error => {    console.log("Error loading data"); }); 
		    // end server query 
		 
		 }
	     
	    this.scrollToBottom();
	        
   }
   
   
  // -------------------------------------------------------------------------
  // ------------------ Get date Today
  // -------------------------------------------------------------------------
   
  get_today() { 
	    
	    let today = this.apiService. get_today_date( 'show_time' ); 
	    return today;
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
		    
		    // ------ send new message in chat ---------------
		     
		    let user_id = localStorage.getItem("user_id"); 
		    let patient_id = localStorage.getItem("patient_id"); 
			if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
		    
		    let  authToken = localStorage.getItem("authToken");  
		       
		    var url =  "https://" + localStorage.getItem("api_domain") + "/api/send_chat/";  // API method 
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
			    "action": 'send_attachment',
			    "user_to" : this.user_to, 
			    "created": this.apiService.get_today_date( 'show_time' ) + ':00', 
			  }  
			};
		    
		  	
		    const fileTransfer: any = this.transfer.create(); 
		  
			fileTransfer.upload( targetPath, url, options).then(data => {   console.dir( data );  
			  	
			 let serverdata = JSON.parse(data.response);   
			  
			 if ( serverdata.updated == true  ) {    
			   
			  this.apiService.infoMessage( "Chat attachment uploaded successfully" ); 
			  
			  // --------- if success image loaded then add new row in chat array  
			    let patient_photo = localStorage.getItem("photo");
			    
			    let messageObj = { 
			        user_type: 'user',
					messageText: 'Attachment:',
					time:  this.get_today(),
					attachment_url: filename,
					collocutor_photo: ' ',
					user_photo: patient_photo,
			    };
			    if (  this.messages.length == 0 ) { this.messages = []; }
			    this.messages.push(messageObj); 
			     this.scrollToBottom(); 
		     // -------------------------------
		  	  
			  //this.preloader.dismiss();
			   
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
		
		let url =  "https://" + localStorage.getItem("api_domain") + "/api/send_chat/";  // API method 
		  
		let user_id = localStorage.getItem("user_id"); 
		let patient_id = localStorage.getItem("patient_id"); 
		if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
		    
	    let  authToken = localStorage.getItem("authToken");  
	    
		// --------------- create form for upload image data from browser ----------------
		
	    var formData: FormData = new FormData();
	    
	    var filename =  this.apiService.random_string() + '.jpg';
	    
	    formData.append("image", img,  filename );
	    formData.append("wpua-file", img, filename );
	    formData.append('authToken', authToken );  
		formData.append('user_id', user_id );   
		formData.append('action', 'send_attachment' );  
		formData.append('user_to',  this.user_to );  
		formData.append('created', this.apiService.get_today_date( 'show_time' ) + ':00' );  
		 
			    
	
	    var xhr = new XMLHttpRequest();
	    xhr.upload.addEventListener("progress", (ev: ProgressEvent) => {
	        
	         if(  ev.loaded >= ev.total  ) {  // if file upload complete
	        
	          this.apiService.infoMessage( "Chat attachment uploaded successfully" ); 
			  
			  // --------- if success image loaded then add new row in chat array  
			    let patient_photo = localStorage.getItem("photo");
			    
			    let messageObj = { 
			        user_type: 'user',
					messageText: 'Attachment:',
					time:  this.get_today(),
					attachment_url: filename,
					collocutor_photo: ' ',
					user_photo: patient_photo,
			    };
			    if (  this.messages.length == 0 ) { this.messages = []; }
			    this.messages.push(messageObj); 
			    this.scrollToBottom(); 
			    //this.preloader.dismiss();
			}	  
	    });
	    xhr.open("POST", url , true);
	    xhr.send(formData);
	} // end web Upload 
	






	  
    
    
 
  
   // -------------------------------------------------------------------------
   // ------------------ Back button action redirect
   // -------------------------------------------------------------------------
  
  backRoute() {  
	  
	  clearInterval( this.chat_update_flag );
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
  // ------------------ Update Message list
  // -------------------------------------------------------------------------
  
 update_message_list() { 
	 
	this.chat_update_flag = setInterval(()=>{  this.load_messages_list(); }, 30*1000 );
 }  
  
      
  // -------------------------------------------------------------------------
  // ------------------ Check App Or Web-version
  // -------------------------------------------------------------------------
  	
  check_platform() { 
	  
	 this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
	 
  }	
  
 // -------------------------------------------------------------------------		        	 
  
  scrollToBottom() {
          this.content.scrollToBottom(0);
    }
 
  // method called for any open tab view  
  ionViewWillEnter() {  
	  
  }

  // loading init data 
  ngOnInit() {  
	   this.BackButtonAction(); 
	   this.load_translates();
	   this.load_messages_list();
	   this.update_message_list();
	   this.check_platform();
	}	
 
  
}

 
