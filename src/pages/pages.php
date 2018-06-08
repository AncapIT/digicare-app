<?php   error_reporting(0);

	    $page = $_POST["page_name"];   
		 
		$result["status"] = 'ok';  
 
		$result["rooms"][ $num ]["id"] = $row['id'] ;
        $result["rooms"][ $num ]["roomTypeId"] = $row['roomTypeId'] ;
                       
			 
		 //  ------------------------------ OUTPUT DATA ------------------------	 

if (!empty($error)) {
    if ( $error ) {  $result["error"] = $error;   }

}
if (!empty($result)) {
    echo json_encode( $result, JSON_UNESCAPED_UNICODE );
}


        
?>