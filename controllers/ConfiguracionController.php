<?php

	/**
	 *
	 */
	class ConfiguracionController{

		function __construct(){
			// code...
		}

		function obtener_configuracion(){

			$ini = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/app.ini');

			$configuracion = array();

			if ($ini['env'] == 'production') {

				$configuracion["BASE_DATOS"] = false;

			}else{

				$configuracion["BASE_DATOS"] = true;

			}

			return $configuracion;

		}
		function base_datos($request){

			$base_datos = $request["BASE_DATOS"];

			$myfile = fopen($_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/app.ini', "wr") or die("Unable to open file!");

			if ($base_datos == true) {

				$txt = "[database]\nenv     = pruebas";
				fwrite($myfile, $txt);

			}else{

				$txt = "[database]\nenv     = production";
				fwrite($myfile, $txt);

			}

			fclose($myfile);

			return $request;

		}
	}


?>
