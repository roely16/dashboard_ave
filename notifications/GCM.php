<?php

error_reporting(E_ALL); 
ini_set('display_errors', 1); 
    
class GCM {
    function __construct() {
    }
    /*--- Enviando notificaciones push ----*/
    public function send_notification($registatoin_ids, $message, $sonido = 'alerta',$mensaje_extra='',$numero_telefonico) {

        // variable post http://developer.android.com/google/gcm/http.html#auth
       // $url = 'https://gcm-http.googleapis.com/gcm/send';
	   if(is_array($registatoin_ids)){
		  // $registatoin_ids = json_encode($registatoin_ids);

	   }
	   //echo $registatoin_ids;
	    $url = 'https://fcm.googleapis.com/fcm/send';
		$noti = array(
		'title' => 'NOTIFICACION AVE',
		'body' =>$message,
		'sound' => "tornado.caf",
		'soundname' => "tornado.mp3",
		'color' => '#E91E63',
		'icon' => 'myicon',
		'vibrate' => 1,
		'flash'=> 1,
		'android_channel_id' => 'NotificationAVE'
		);
		$message = array(
		'mensaje_extra' =>$mensaje_extra,
		'numero_telefonico' =>trim($numero_telefonico)
		);
        $fields = array(
            'to' => $registatoin_ids,
            'data' => $message,
			'notification' => $noti,
			'content_available'=> false,
			'dry_run'=>false,
			'sound'=>'appbeep.wav',
			'priority' => 'high'
        );
        $headers = array(
            'Authorization: key=AAAAzGfDS3Y:APA91bFAWsonvEE8PWArI8owZBbdsM0x9hCdvwz0oyXxUutS5lcfysn_irH7ZTty_a1_9PwSqiB4xl7BVeCFVqv7BcmxAAs_ORlir18eYoVClR-XgNtpPSN1UrUK_x5qcJ80lmo9eBBl',
            'Content-Type: application/json'
        );

        // abriendo la conexion
        $ch = curl_init();

        // Set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Deshabilitamos soporte de certificado SSL temporalmente
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

        // ejecutamos el post

        $result = curl_exec($ch);

        if ($result === FALSE) {
            die('Curl failed: ' . curl_error($ch));
        }else{
        // echo $result;
		}
        // Cerramos la conexion
        curl_close($ch);

       //echo $result;
    }
}
?>
