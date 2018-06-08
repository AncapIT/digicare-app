import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs/Observable';

import { Http, HttpModule, Headers, URLSearchParams } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
 
console.log("api.service.ts");

/*
// Set Prod or Test server - NOTE: Also change in src/models/api-values.ts

*/

@Injectable()
export class ApiService {

	 public data: any;
	 public result: any; // params to json data from server
	 public api_host: any;

 	  constructor(  private http: Http,  public toastCtrl: ToastController,  public appVersion: AppVersion  ) {

	     this.http = http;
		 this.data = {};
		 
		 // Set default Prod/Test server
		 if ( this.get_use_production_server() === null ) {
			 this.set_use_production_server(true);
		 }
		 this.api_host = localStorage.getItem("api_url");  //this.api_host = "http://" + localStorage.getItem("api_domain") + "/api/";
		 
 	     this.appVersion.getVersionNumber().then((function (version) {
			  localStorage.setItem( "app_version",   version.toString() );
			}));
	  }


  // -------------------------------------------------------------------------
  // --------------------- sendRegData
  // -------------------------------------------------------------------------


  check_user_login( login, password ) {
 
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();
	postdata.append('login', login);
	postdata.append('password', password);   
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'login/' ; 
    return this.http.post(link, query, { headers:headers } );
 

  } // end  sendRegData




  // -------------------------------------------------------------------------
  // --------------------- Get Patints list for this Staff
  // -------------------------------------------------------------------------


 load_patients_list( user_id ) {

    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken");

	var link =  this.api_host + 'get_patients_list/?authToken='+ authToken +"&user_id="+ user_id ;
	console.log("load_patients_list - link="); console.dir(link);
	return this.http.get(link);

  } // end  - load_patients_list




  // -------------------------------------------------------------------------
  // --------------------- Get Notifications List for User
  // -------------------------------------------------------------------------
 
 load_notifications_list( patient_id ) {
	 
	 
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }

    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();
	postdata.append('user_id', user_id);
	postdata.append('authToken', authToken);   
	postdata.append('patient_id', patient_id);   
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_personal_push_list/' ; 
    return this.http.post(link, query, { headers:headers } );

  } // end -  Get Notifications




  // -------------------------------------------------------------------------
  // --------------------- Get Generall Provider information
  // -------------------------------------------------------------------------
 
 get_provider_info( provider_id ) {
	  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id); 
	postdata.append('authToken', authToken);   
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_provider_info/' ; 
    return this.http.post(link, query, { headers:headers } );

  } // end - get_provider_info





  // -------------------------------------------------------------------------
  // --------------------- Get Home Page Menu Items
  // -------------------------------------------------------------------------
 
 load_homepage_items( provider_id ) {
	  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id); 
	postdata.append('authToken', authToken);   
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_homepage_items/' ; 
    return this.http.post(link, query, { headers:headers } );

  } // end - get_provider_info





  // -------------------------------------------------------------------------
  // --------------------- Get Products Page List Items
  // -------------------------------------------------------------------------
 
 load_products_list( parent_page ) {
	 
	let patient_id = localStorage.getItem("patient_id");      
    let authToken = localStorage.getItem("authToken"); 
    
    let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();    
	postdata.append('parent_page', parent_page); 
	postdata.append('authToken', authToken);   
	postdata.append('user_id', user_id);  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_products_list/' ; 
    return this.http.post(link, query, { headers:headers } );

  } // end - load_products_list






  // -------------------------------------------------------------------------
  // --------------------- Get Product Page Details
  // -------------------------------------------------------------------------
 
 load_product( page_link ) {
	 
	let patient_id = localStorage.getItem("patient_id");   
	let provider_id = localStorage.getItem("provider_id");   
    let authToken = localStorage.getItem("authToken"); 
    
    let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id); 
	postdata.append('page_link', page_link); 
	postdata.append('authToken', authToken);   
	postdata.append('user_id', user_id);  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_product/' ; 
    return this.http.post(link, query, { headers:headers } );

  } // end - load_product



 



  // -------------------------------------------------------------------------
  // --------------------- Get Documents Page Data for List and Single view
  // -------------------------------------------------------------------------
 
 get_documents(  task, doc_type, item_id  ) {
	
	let provider_id = localStorage.getItem("provider_id"); 
	let patient_id = localStorage.getItem("patient_id");  
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id); 
	postdata.append('authToken', authToken);  
	postdata.append('user_id', user_id);  
	postdata.append('task', task);  
	postdata.append('doc_type', doc_type);   
	postdata.append('item_id', item_id); 
	postdata.append('patient_id', patient_id); 
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_documents/' ; 
    return this.http.post(link, query, { headers:headers } );
   

  } // end - get_documents








  // -------------------------------------------------------------------------
  // ---------------------  Save Order from Patient
  // -------------------------------------------------------------------------
 
save_order(  order_title, page_link, order_data,  price, currency  ) {

	console.log("api.service.ts save_order");
	console.log("order_data="); console.dir(order_data);
	
	let provider_id = localStorage.getItem("provider_id"); 
	let patient_id = localStorage.getItem("patient_id");  
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id ); 
	postdata.append('authToken', authToken );  
	postdata.append('user_id', user_id );  
	postdata.append('patient_id', patient_id );  
	postdata.append('price', price );   
	postdata.append('currency', currency );  
	postdata.append('page_link', page_link ); 
	postdata.append('order_title', order_title );
	
	let item_id: any; 
	
	 for( let ord in order_data ) {
		     
		 item_id = order_data[ ord ].item_id;
		 postdata.append('order_data['+ item_id +']["item_id"]', item_id ); 
		 postdata.append('order_data['+ item_id +']["item_type"]', order_data[ ord ].item_type );
		 postdata.append('order_data['+ item_id +']["title"]', order_data[ ord ].title );
		 postdata.append('order_data['+ item_id +']["price"]', order_data[ ord ].price );
		 postdata.append('order_data['+ item_id +']["user_value"]', order_data[ ord ].selected );
		 postdata.append('order_data['+ item_id +']["product_item_choices_id"]', order_data[ ord ].product_item_choices_id );
	 }
	 
	let query = postdata.toString();
	console.log("save_order query="); console.dir(query);

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'save_order/' ; 
    return this.http.post(link, query, { headers:headers } );
   

  } // end - save_order
	

/*  row = { 'item_id': ud, 'item_type': this.product_data.items[ ud ].item_type,  'title': this.product_data.items[ ud ].title, 'price': this.product_data.items[ ud ].price, 'selected':  sel_value  }; */


  // -------------------------------------------------------------------------
  // ------------------ Toast Info window notification
  // ------------------------------------------------------------------------- 
  	 
  get_orders_history() { 
		
		
    let provider_id = localStorage.getItem("provider_id"); 
	let patient_id = localStorage.getItem("patient_id");  
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id ); 
	postdata.append('authToken', authToken );  
	postdata.append('user_id', user_id );  
	postdata.append('patient_id', patient_id ); 
	  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_orders_history/' ; 
    return this.http.post(link, query, { headers:headers } );
   
    	
  } //  get_orders_history
	





  // -------------------------------------------------------------------------
  // ------------------ Get Food Menu
  // ------------------------------------------------------------------------- 
  	 
  get_food_menu() { 
		
		
    let provider_id = localStorage.getItem("provider_id"); 
	let patient_id = localStorage.getItem("patient_id");  
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('provider_id', provider_id ); 
	postdata.append('authToken', authToken );  
	postdata.append('user_id', user_id );  
	postdata.append('patient_id', patient_id ); 
	  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_food_menu/' ; 
    return this.http.post(link, query, { headers:headers } );
   
    	
  } //  get_food_menu






  // -------------------------------------------------------------------------
  // ------------------ Get Info about single patient
  // ------------------------------------------------------------------------- 
  	
 load_patient( patient_id  ) { 
	  	    
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('authToken', authToken );  
	postdata.append('user_id', user_id );  
	postdata.append('patient_id', patient_id ); 
	  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'load_patient/' ; 
    return this.http.post(link, query, { headers:headers } );
	 
	 
	 
 } // END -  load_patient





  // -------------------------------------------------------------------------
  // ------------------ Get Chat messages from server
  // ------------------------------------------------------------------------- 
  	
 get_chat( user_from, user_to, user_type, last_message_id ) { 
	  	    
	 
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
  
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('authToken', authToken );  
	postdata.append('user_from', user_from );  
	postdata.append('user_to', user_to ); 
	postdata.append('user_type', user_type ); 
	postdata.append('last_message_id', last_message_id );  
	  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_chat/' ; 
    return this.http.post(link, query, { headers:headers } );
	  
 } // END -  get_chat






  // -------------------------------------------------------------------------
  // ------------------ Send Chat message to server
  // ------------------------------------------------------------------------- 
  	
 send_chat( message, user_to ) { 
	  	    
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) {   user_id = localStorage.getItem("patient_id");  }
  
    // convert data to json format and send to server
    let  authToken = localStorage.getItem("authToken"); 
    
    let created = this.get_today_date( 'show_time' ) + ':00'; // console.log( created );
   
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();   
	postdata.append('authToken', authToken );  
	postdata.append('user_id', user_id );
	postdata.append('message', message );
	postdata.append('user_to', user_to );  
	postdata.append('created', created ); 
	  
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'send_chat/' ; 
    return this.http.post(link, query, { headers:headers } );
	  
 } // END -  send_chat


 

 
   // -------------------------------------------------------------------------
   // ------------------ Toast Info window notification
   // ------------------------------------------------------------------------- 
  	 
 
 infoMessage( message ) {
		
		let toast = this.toastCtrl.create({
		message: message ,
		duration: 4000,
		position: 'top'
		});
	  toast.present(); 
    } 
    
    
    // -------------------------------------------------------------------------
   // ------------------ Toast Info window notification with confirm
   // ------------------------------------------------------------------------- 
  	 
 
 infoMessage_confirm( message ) {
		
		let toast = this.toastCtrl.create({
	      message: message,
	      duration: 40000,
	      position: 'top',
	      showCloseButton: true,
	      closeButtonText: 'OK',
	      dismissOnPageChange: false
	    });
	    toast.present();
    } 
      
    
    
    
  // -------------------------------------------------------------------------
  // ------------------ Load Page Params 
  // -------------------------------------------------------------------------
 
 load_page( page_name ) { 
	
	let  authToken = localStorage.getItem("authToken"); 
	   
	var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();
	postdata.append('page_name', page_name);
	postdata.append('authToken', authToken );
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'get_pages/' ; 
	return this.http.post(link, query, {headers:headers} );
	 
  }   
    
  
  
  
  
  // -------------------------------------------------------------------------
  // ------------------ check_app_version
  // -------------------------------------------------------------------------
   
    check_app_version() { 
	    
	    let  authToken = localStorage.getItem("authToken");
	    
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let postdata = new URLSearchParams(); 
		postdata.append('authToken', authToken );
		let query = postdata.toString();
	
	 	// ---------- send data to server  ----------
	    var link =  this.api_host  + 'check_app_version/' ; 
		return this.http.post(link, query, {headers:headers} ); 
	    
    } // end check_app_version
    
    
 
  // -------------------------------------------------------------------------
  // ------------------ load_user
  // -------------------------------------------------------------------------
   
    load_user( user_id ) { 
	    
	    let  authToken = localStorage.getItem("authToken");
	    
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let postdata = new URLSearchParams(); 
		postdata.append('authToken', authToken );
		postdata.append('user_id', user_id );
		let query = postdata.toString();
	
	 	// ---------- send data to server  ----------
	    var link =  this.api_host  + 'load_user/' ; 
		return this.http.post(link, query, {headers:headers} ); 
	    
    } // end load_user
    
    
    
    
     
  // -------------------------------------------------------------------------
  // ------------------ Update User Profile 
  // -------------------------------------------------------------------------
  
  update_profile( patient_id, first_name,  last_name, address, city,  email, phone, old_password, new_password ){ 
	  
	let  authToken = localStorage.getItem("authToken"); 
	
	let user_id = localStorage.getItem("user_id"); 
	if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = patient_id ; }
	   
	var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
	let postdata = new URLSearchParams();
	postdata.append('patient_id', patient_id);
	postdata.append('authToken', authToken );
	postdata.append('user_id', user_id);
	postdata.append('first_name', first_name);
	postdata.append('last_name', last_name);
	postdata.append('address', address);
	postdata.append('city', city);
	postdata.append('email', email);
	postdata.append('phone', phone); 
	postdata.append('old_password', old_password ); 
	postdata.append('new_password', new_password ); 
	let query = postdata.toString();

 	// ---------- send data to server  ----------
    var link =  this.api_host  + 'update_profile/' ; 
	return this.http.post(link, query, {headers:headers} );
	  
  }   // end - update_profile
    
    
    
    
   
   
  // -------------------------------------------------------------------------
  // ------------------ create_payment
  // -------------------------------------------------------------------------
   
  create_payment(  token, amount, currency, description,  action,  order_id  ) { 
	    
	    let  authToken = localStorage.getItem("authToken"); 
		
		let user_id = localStorage.getItem("user_id"); 
		if ( !user_id || user_id === undefined || user_id == 'undefined' ) { user_id = localStorage.getItem("patient_id");  ; }
		 
		let provider_id = localStorage.getItem("provider_id");    
	    
	    var headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
		let postdata = new URLSearchParams(); 
		postdata.append('authToken', authToken );
		postdata.append('user_id', user_id );
		postdata.append('provider_id', provider_id );
		postdata.append('token', token );
		postdata.append('amount', amount );
		postdata.append('currency', currency );
		postdata.append('description', description );
		postdata.append('action', action );
		postdata.append('order_id', order_id ); 
		let query = postdata.toString();
	
	 	// ---------- send data to server  ----------
	    var link =  this.api_host  + 'stripe_payment/' ; 
		return this.http.post(link, query, {headers:headers} ); 
	    
    } // end create_payment
    
    
     
    
    
    
  // -------------------------------------------------------------------------
  // ------------------ Get date tomorrow 
  // -------------------------------------------------------------------------
  
   
  get_tomorrow_date() { 
	  
	    let today = new Date();  let dd:any = today.getDate() + 1; 
	    
		let mm:any = today.getMonth()+1; //January is 0!
		let yyyy:any = today.getFullYear();
		 
		if ( dd > 31 ) { dd = 1; mm = mm +1;  }  if ( mm > 12 ) { mm = 1; yyyy = yyyy + 1;  }
		
		if( dd < 10 ) { dd='0'+dd; } 
		if( mm < 10 ) {  mm='0'+mm;  } 
		
		let tomorrow = yyyy +'-'+ mm +'-'+ dd;  
		
		return tomorrow;
  } 
    
    
  // -------------------------------------------------------------------------
  // ------------------ Get date Today with time if need 
  // -------------------------------------------------------------------------
  
   
  get_today_date( time_flag ) { 
	  
	    let today = new Date();  let dd:any = today.getDate() ; 
	    
		let mm:any = today.getMonth()+1; //January is 0!
		let yyyy:any = today.getFullYear();
		let hours:any = today.getHours();
		let minutes:any = today.getMinutes();
		 
		if ( dd > 31 ) { dd = 1; mm = mm +1;  }  if ( mm > 12 ) { mm = 1; yyyy = yyyy + 1;  }
		
		if( dd < 10 ) { dd ='0' + dd; } 
		if( mm < 10 ) {  mm ='0' + mm;  } 
		if( hours < 10 ) {  hours ='0' + hours;  } 
		if( minutes < minutes ) {  minutes ='0' + minutes;  } 
		
		let datetime = yyyy +'-'+ mm +'-'+ dd;  
		if ( time_flag == 'show_time' ) { datetime = datetime + ' ' + hours +":"+ minutes ; }
		
		return datetime;
  } 
   
 


  // -------------------------------------------------------------------------
  // ------------------ Get Random string for names
  // -------------------------------------------------------------------------
 
     
  random_string() {
	 
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	  for (var i = 0; i < 35; i++)
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	  return text;
	}

 
	// -------------------------------------------------------------------------
	// ------------------ Set/Get If on Production server (API host)
	// -------------------------------------------------------------------------
 		
	set_use_production_server (prod:boolean) {
		prod = false;
		let domain;
		if (prod) {
			domain = "TEST_API_URL";
		} else {

				domain = "PRODUCTION_API_URL";
		}
		console.log("set_use_production_server - domain=" + domain);

		// API
		this.api_host = "https://" + domain + "/api/";
		localStorage.setItem("api_url", this.api_host); 
		localStorage.setItem("api_domain", domain);  
	
		// Image paths
		localStorage.setItem("image_path",  "https://" + domain + "/web/uploads/users" ); 
		localStorage.setItem("news_image_path",  "https://" + domain + "/web/uploads/news" );  
		localStorage.setItem("provider_image_path",  "https://" + domain + "/web/uploads/providers" );   
		localStorage.setItem("chat_img_path",  "https://" + domain + "/web/uploads/chat" );   
		console.dir(localStorage);

		return true;
	}

	get_use_production_server() {

		// Returns if on production server
		console.log('get_use_production_server - localStorage.getItem("api_domain")="' + localStorage.getItem("api_domain") + '"');

		let rval;
		if (localStorage.getItem("api_domain") === null || localStorage.getItem("api_domain") == "") {
			rval = null;
		} else if (localStorage.getItem("api_domain").substr(0,4) == "prod") {
			rval = true;	
		} else {
			rval = false;
		}

		console.log("rval=" + rval);
		return rval;
	}




  
}
