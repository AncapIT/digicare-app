import { Component } from '@angular/core'; 
import {
    NavController, NavParams, Events, LoadingController, Platform, ModalController, ViewController,
    Loading
} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiService } from '../../app/api.service';
import { TranslateService } from '@ngx-translate/core';
 
import { HomePage } from '../home/home';
import { SelectPatientPage } from '../select_patient/select_patient';
import {StorageValues} from "../../models/storage-values";
import {BankIdService} from "../../services/bank-id.service";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ ApiService, TranslateService,BankIdService ]
})
export class LoginPage {

  public lang: any;
  public preloader:Loading;
  public bankid_mode: Boolean; 
  public personNumber: number;
  public testServer: Boolean;
  public login: string;  public password: String; public text_window: Boolean;   public app_version_message: Boolean;
            rememberMe: boolean = false; rememberMe_bankid: boolean = false;
  public launcherCount:number=0;

  
  constructor(
  	public navCtrl: NavController,
	public navParams: NavParams,
	public platform: Platform,
	public toastCtrl: ToastController ,
	public events: Events ,
	public loadingCtrl: LoadingController,
	private modalCtrl: ModalController,
	public translate: TranslateService,
	public viewCtrl: ViewController,
	private apiService: ApiService,
	private bankIdService: BankIdService,
	) {
  	  
  	  this.load_translates(); 
  	  this.bankid_mode = false;  
  	  this.text_window = false; 
  	  this.app_version_message = false; 
        
  	  this.check_app_version();
  	   
   }
  
  
   // -------------------------------------------------------------------------
   // ------------------ Loading Translates
   // -------------------------------------------------------------------------
  
  load_translates() { 
	    
	    this.platform.ready().then(() => {
	        
	        this.translate.stream('login').subscribe(( translated ) => {
		    	 this.lang = translated;   // console.dir(translated);
			});
	    });
  }
   
  
  // -------------------------------------------------------------------------
  // ------------------ Check input params and login
  // -------------------------------------------------------------------------

	bankIdLogin(){
      if(!this.personNumber){
          this.apiService.infoMessage( this.lang.req_bankid );
          return;
      }
        this.preloader=this.loadingCtrl.create({ content:'' });
        this.preloader.present();
        window['plugins'].launcher.canLaunch({uri:'bankid://'},
			(res)=>{
        		console.log("bkaId res",res);
                this.bankIdService.getRedirectUrl(this.personNumber).subscribe(
                    result=>{
                        //this.preloader.dismiss();
                        console.log(result,"res back");
                        let uri=result.redirectUrl;
                        let sessionId=result.sessionId;
                        window['plugins'].launcher.launch({uri:uri}, (launchRes)=>{
                        	console.log(launchRes,"launch res");
                        	if(launchRes){
                                if(launchRes.isLaunched) console.log("bankId app is launched on success");
                                else if(launchRes.isActivityDone){
                                    console.log("bankId finished, launch call");
                                    this.bankIdService.login(this.personNumber,sessionId).subscribe(
                                        loginRes=>{
                                            //alert(JSON.stringify(loginRes));
											console.log("login success1",loginRes);
                                            this.loginCallback(loginRes);
                                        },
                                        loginErr=>{
                                            console.log("Login via Bankid failed -server- 1"); console.dir(loginErr);
                                            this.apiService.infoMessage( this.lang.bankIdServerError );
                                        }
                                    );
                                }
							}
							else{
                        		this.launcherCount++;
                        		if(this.launcherCount>=1){
                                    this.bankIdService.login(this.personNumber,sessionId).subscribe(
                                        loginRes=>{
                                            //alert(JSON.stringify(loginRes));
                                            console.log("login success2",loginRes);
                                            this.loginCallback(loginRes);
                                        },
                                        loginErr=>{
                                            console.log("Login via Bankid failed -server- 2"); console.dir(loginErr);
                                            this.apiService.infoMessage( this.lang.bankIdServerError );
                                        }
                                    );
								}
							}

						}, (launchError)=>{
                            console.log(launchError,"launch err");
                            this.apiService.infoMessage( this.lang.bankIdLaunchError )
                        });
                    },
                    error=>{
                        this.preloader.dismiss();
                        this.apiService.infoMessage( this.lang.bankIdServerError );
                        console.log(error,"bankId getRedirecUrl error");
                    }
                )
			},
			(err)=>{
                this.preloader.dismiss();
                this.apiService.infoMessage( this.lang.bankIdAppNotFound );
        		console.log("Bankid error:App not found",err);
		});

	}

  send_login() {  
	  
    let validation = true; 
    let error_mess = ''; 
	  
	// check bankid 
	if (  this.bankid_mode  === true ) { 	 
		error_mess = this.lang.bankid_disabled;  validation = false; 
        /* 
        if ( this.bankid_number == 0 || !this.bankid_number  ) { 
			error_mess = this.lang.req_bankid;  validation = false; 
        } 
        */ 

    // check login and password fields 
    } else if ( !this.login ||  !this.password  ) { 
        
        error_mess = this.lang.req_pass;  
        validation = false;  

    // Check switch to Prod/Test server
	} else if (this.login == "server") {
        if(this.password == "prod") {
            this.apiService.set_use_production_server(true);
            this.apiService.infoMessage("Now on Production Server");
        } else if(this.password == "test") {
            this.apiService.set_use_production_server(false);
            this.apiService.infoMessage("Now on Test Server");
        } 
        this.show_if_test_server();    // Show Test server text
        validation = false;
    }
	  
	  if ( validation == true ) {    
		  
		   // ----------------- API query to server ----------------------
	     
		    this.preloader = this.loadingCtrl.create({  content: "", duration: 10000  });  this.preloader.present();
		    
		    let responce = this.apiService.check_user_login( this.login, this.password  ).subscribe( data => {  
				  	
				  	
				    let res = data.json();  // console.dir( res ); 
			        this.preloader.dismiss(); // disable
    
                    if(this.rememberMe) {
                        this.rememberMe_bankid = false;
                        this.save_remember_me();
                    }
                	  
			        if (  res.status == 'ok' && res.result == 'valid' ) {  // Success load data 
				        
				        localStorage.setItem("authToken", res.authToken );  
					      
					     // check user level access and redirect to Page
					     if ( res.user_type == 'patient' ) { 
						    localStorage.setItem("patient_id", res.user_id );  localStorage.setItem("user_id", "" );
						    localStorage.setItem("user_type", 'patient' );
					        this.navCtrl.push( HomePage );
					     } 
						 if ( res.user_type == 'staff' || res.user_type == 'relative'  ) {     
						    localStorage.setItem("user_id", res.user_id );    localStorage.setItem("patient_id", "" );
						    localStorage.setItem("user_type", 'staff' );
						    this.getPatients(res.user_id);
					     } 
					     
		     		}  else { 
			     		this.apiService.infoMessage( this.lang.req_pass ); // Message if incorrect Password
		     		}
			     
	        }, error => {  this.preloader.dismiss(); console.log("Error loading data"); });
	        // end server query 
	        
	        
		    
		  } // end - Success validation 
	  else { this.apiService.infoMessage( error_mess );  } // Alert notification
	  
  }

  public loginCallback(data){
      // let res = data.json();   
      let res = data; console.dir( res ); console.log("login callback");
      if(this.preloader) this.preloader.dismiss(); // disable
     
      console.log("loginCallback");
      console.log("this.rememberMe_bankid=" + this.rememberMe_bankid);
      if(this.rememberMe_bankid) {
        this.rememberMe = false;
        this.save_remember_me();
      }

      if (res.result == 'valid' ) {  // Success load data

          localStorage.setItem("authToken", res.authToken );

          // check user level access and redirect to Page
          if ( res.user_type == 'patient' ) {
              localStorage.setItem("patient_id", res.user_id );  localStorage.setItem("user_id", "" );
              localStorage.setItem("user_type", 'patient' );
              this.navCtrl.push( HomePage );
          }
          if ( res.user_type == 'staff' || res.user_type == 'relative'  ) {
              localStorage.setItem("user_id", res.user_id );    localStorage.setItem("patient_id", "" );
              localStorage.setItem("user_type", 'staff' );
              this.getPatients(res.user_id);
          }

      }  else {
          this.apiService.infoMessage( this.lang.bankIdLoginError ); // Message if incorrect Password
      }
  }

  private getPatients(userId:string){
      this.apiService.load_patients_list( userId  ).subscribe( data => {

          let res = data.json();  console.dir( "patients",res,data );

          if (  res.status == 'ok' ) {  // Success load data

              if ( res.patients_num == 1 ) {
			  	localStorage.setItem("patient_id", res.patients[0].patient_id);
			  	this.navCtrl.push( HomePage );
			  }
			  else{
                  this.navCtrl.push( SelectPatientPage,{patients:res.patients,patientsCount:res.patients_num} );
			  }

          }  else {
              // this.apiService.infoMessage( this.lang.req_pass ); // Message if incorrect Password
			  console.log("status is not ok",res);
              this.navCtrl.push( SelectPatientPage ); // redirect to NextPage
          }

      }, error => {  console.log(error,"Error loading data"); })
  }
  
  // -------------------------------------------------------------------------
  // ------------------ Toggle mode login - bankID or Default login
  // -------------------------------------------------------------------------
   
  toggle_login( mode ) { 
	  
	  if ( mode == 'password') {  this.bankid_mode = false;  } else { this.bankid_mode = true;   } 
	  
  }
  
  
   // -------------------------------------------------------------------------
   // ------------------ Show Text / Hide mesage
   // -------------------------------------------------------------------------
  
  show_text_message( task ) {
	    
	   if( task == 'show' ) {  this.text_window = true;  }
	   else { this.text_window = false; }
	    
  } 
   
   
   // -------------------------------------------------------------------------
   // ------------------ Check app version from server 
   // -------------------------------------------------------------------------
  
  check_app_version() {
	   
	    let app_version = localStorage.getItem("app_version");
	 
	   
	     // ----------------- API query to server ----------------------
	    let responce = this.apiService.check_app_version().subscribe( data => {  
				  	
				  	let res = data.json();  //console.dir( res ); 
				  	if (  res.status == 'ok' ) { 
					 	let server_version = res.app_version;
					 	
					 	// console.log("app_version: " + app_version  +", server_version: "+ server_version ); 
	   
						   if (  parseFloat(app_version) <  parseFloat(server_version) ) { 
							    this.bankid_mode = false; 
							    this.text_window = true;
						   		this.app_version_message = true; 
						   }
						   
				  	}
				  	
		}, error => {  console.log("Error loading data"); }); 
	    // end server query 
			         
	   
	  
  }  
   
    // -------------------------------------------------------------------------
    // ------------------ Show if using test server 
    // -------------------------------------------------------------------------
    
    show_if_test_server() {
        
        this.testServer = false;
        if (! this.apiService.get_use_production_server()) {       //if (localStorage.getItem("api_domain").substr(0,4) != "prod") {
            this.testServer = true;
        }

    }  
  
    // -------------------------------------------------------------------------
    // ------------------ Read and Save remember me info 
    // -------------------------------------------------------------------------
    
    read_remember_me() {

        console.log("read_remember_me");
        if (localStorage.getItem(StorageValues.LOGIN_REMEMBER_ME) == "true") {
            this.login = localStorage.getItem(StorageValues.LOGIN_USERNAME);
            this.rememberMe=true;
        } else if (localStorage.getItem(StorageValues.LOGIN_BANKID_REMEMBER_ME) == "true") {
            this.personNumber = parseInt(localStorage.getItem(StorageValues.LOGIN_BANKID_USERNAME));
            this.rememberMe_bankid=true;
        }

    }  
  
    save_remember_me() {

        console.log("save_remember_me");
        if (this.rememberMe) {
            localStorage.setItem(StorageValues.LOGIN_REMEMBER_ME, "true");
            localStorage.setItem(StorageValues.LOGIN_USERNAME,this.login);
            localStorage.setItem(StorageValues.LOGIN_BANKID_REMEMBER_ME, "false");
            localStorage.setItem(StorageValues.LOGIN_BANKID_USERNAME,"");
        } else if (this.rememberMe_bankid) {
            localStorage.setItem(StorageValues.LOGIN_BANKID_REMEMBER_ME, "true");
            localStorage.setItem(StorageValues.LOGIN_BANKID_USERNAME, this.personNumber.toString());        
            localStorage.setItem(StorageValues.LOGIN_REMEMBER_ME, "false");
            localStorage.setItem(StorageValues.LOGIN_USERNAME,"");
        }

        /*
        console.log("this.rememberMe=" + this.rememberMe);
        console.log("this.rememberMe_bankid=" + this.rememberMe_bankid);
        console.log("1:" + localStorage.getItem(StorageValues.LOGIN_REMEMBER_ME));
        console.log("2:" + localStorage.getItem(StorageValues.LOGIN_USERNAME));
        console.log("3:" + localStorage.getItem(StorageValues.LOGIN_BANKID_REMEMBER_ME));
        console.log("4:" + localStorage.getItem(StorageValues.LOGIN_BANKID_USERNAME));           
        */

    }  


   // -------------------------------------------------------------------------
   // ------------------ User Warning about disabled functions
   // -------------------------------------------------------------------------
  
  option_disabled() { 
	  
	   let message = 'This feature is currently disabled';
       this.apiService.infoMessage( message );
  }  
  
  
  // -------------------------------------------------------------------------
  // hardware back button for Android devices
  // -------------------------------------------------------------------------
  BackButtonAction() {
  	
  }  // end BackButtonAction
     
  
   // -------------------------------------------------------------------------
   // ------------------ Start App Functions
   // -------------------------------------------------------------------------
  
  ionViewDidEnter() {
      
    this.launcherCount=0;
    this.BackButtonAction();
    this.show_if_test_server();
    this.read_remember_me();
    if (this.rememberMe_bankid) {this.toggle_login( 'bankid' );}

  }


  
   
}
