<?php
	/* Conexión a base de datos */
    require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    class NoticiasController{

        function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

        }

        function obtener(){

            $query = "SELECT * FROM CAT_NOTICIAS";
            $stid = oci_parse($this->conn, $query);
            oci_execute($stid);

            $noticias = array();

            while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

                $noticias [] = $data;

            }

            return $noticias;

        }

        function subirArchivo(){

            $tempPath = $_FILES['file']['tmp_name'];
            $nombre_archivo = $_FILES['file']['name'];
            $type = $_FILES["file"]["type"];
            //$tipo = $_FILES["TIPO"];
            
			$id_archivo = uniqid();

            if ($type == "application/pdf") {

                $uploadPath = $_SERVER['DOCUMENT_ROOT'] . "/rest-api-ave2/public/archivos/".$nombre_archivo;

            }else{

                $uploadPath = $_SERVER['DOCUMENT_ROOT'] . "/rest-api-ave2/public/imagenes/".$nombre_archivo;

            }

			$archivo = "noticias/".$id_archivo;

			$tipo_archivo = $_FILES['file']['type'];

            if (!file_exists($uploadPath)) {

                if (move_uploaded_file($tempPath, $uploadPath)) {

                    return array($archivo, $nombre_archivo, $tipo_archivo);

                }else{

                    return array($tempPath);
                }

            }else{

                return 0;

            }

			//return $_FILES;

        }

        function registrar($request){

            $titulo = $request["TITULO"];
            $texto = $request["TEXTO"];
            $tema = $request["TEMA"];
            $descripcion_corta = $request["DESCRIPCION_CORTA"];
            $tipo = $request["TIPO"];
            $imagen = $request["IMAGEN"];
            $id_video = $request["ID_VIDEO"];


            //Buscar el tema
            $query = "SELECT TEMA, CODE_TEMA FROM CAT_NOTICIAS WHERE TEMA = '$tema'";

            $stid = oci_parse($this->conn, $query);
            oci_execute($stid);

            $tema = oci_fetch_array($stid, OCI_ASSOC);

            if ($tema) {
                
                $code_tema = $tema["CODE_TEMA"];

            }

            if ($tipo == 1) {

                $query = " INSERT INTO CAT_NOTICIAS (TITULO, DESCRIPCION_CORTA, TEXTO, CREATED_AT, IMAGEN_PORTADA, URL_RECURSO, TIPO) VALUES ('$titulo', '$descripcion_corta', '$texto', SYSDATE, '$imagen', '$id_video', $tipo)";

            }else if($tipo ==  2){

                $query = " INSERT INTO CAT_NOTICIAS (TITULO, DESCRIPCION_CORTA, TEXTO, CREATED_AT, IMAGEN_PORTADA, URL_RECURSO, TIPO) VALUES ('$titulo', '$descripcion_corta', '$texto', SYSDATE, '$imagen', '$imagen', $tipo)";

            }else if($tipo == 3){

                $pdf = $request["PDF"];

                $query = " INSERT INTO CAT_NOTICIAS (TITULO, DESCRIPCION_CORTA, TEXTO, CREATED_AT, IMAGEN_PORTADA,  URL_RECURSO, TIPO, CODE_TEMA) VALUES ('$titulo', '$descripcion_corta', '$texto', SYSDATE, '$imagen', '$pdf', $tipo, '$code_tema')";

            }

            $stid = oci_parse($this->conn, $query);
            oci_execute($stid);

            $noticias = $this->obtener();

            return $noticias;

        }

        function eliminar($id){

            /** Eliminar archivo */
            $noticia = $this->detalles($id);
            $recurso = $noticia["IMAGEN_PORTADA"];

            if ($noticia["TIPO"] == '3') {
                # code...

                unlink( $_SERVER['DOCUMENT_ROOT'] . "/rest-api-ave2/public/archivos/".$recurso);

            }else{

                unlink( $_SERVER['DOCUMENT_ROOT'] . "/rest-api-ave2/public/imagenes/".$recurso);

            }
            

            /** Eliminar de la base de datos */

            $query = "DELETE FROM CAT_NOTICIAS WHERE ID_NOTICIA = $id";
            $stid = oci_parse($this->conn, $query);
            oci_execute($stid);

            $noticias = $this->obtener();

            return $noticias;


        }

        function detalles($id){

            $query = "SELECT * FROM CAT_NOTICIAS WHERE ID_NOTICIA = $id";
            $stid = oci_parse($this->conn, $query);
            oci_execute($stid);

            $noticia = oci_fetch_array($stid, OCI_ASSOC);

            if ($noticia["TIPO"] == '3') {

                $url_imagen = "https://udicat.muniguate.com/rest-api-ave2/public/archivos/".$noticia["URL_RECURSO"];

            }elseif($noticia["TIPO"] == '1'){

                $url_imagen = "https://www.youtube.com/embed/".$noticia["URL_RECURSO"];

            }else{

                $url_imagen = "https://udicat.muniguate.com/rest-api-ave2/public/imagenes/".$noticia["URL_RECURSO"];

            }

            //$url_imagen = "https://udicat.muniguate.com/rest-api-ave2/public/imagenes/".$noticia["IMAGEN_PORTADA"];
            
            $url_portada = "https://udicat.muniguate.com/rest-api-ave2/public/imagenes/".$noticia["IMAGEN_PORTADA"];

            $noticia["URL_PORTADA"] = $url_portada;
			$noticia["URL_IMAGEN"] = $url_imagen;

            return $noticia;

        }

        function editar($request){

			$id_noticia = $request["ID_NOTICIA"];
			$titulo = $request["TITULO"];
			$descripcion_corta = $request["DESCRIPCION_CORTA"];
			$texto = $request["TEXTO"];
			$url_recurso = $request["URL_RECURSO"];
			$imagen_portada = $request["IMAGEN_PORTADA"];
			$imagen_seleccionada = $request["IMAGEN_SELECCIONADA"];

			if ($imagen_seleccionada) {

				$query = "SELECT IMAGEN_PORTADA, TIPO FROM CAT_NOTICIAS WHERE ID_NOTICIA = $id_noticia";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$noticia = oci_fetch_array($stid, OCI_ASSOC);

                if ($noticia["TIPO"] == '3') {

                    unlink( $_SERVER['DOCUMENT_ROOT'] . "/rest-api-ave2/public/archivos/".$noticia["IMAGEN_PORTADA"]);

                }else{

                    unlink( $_SERVER['DOCUMENT_ROOT'] . "/rest-api-ave2/public/imagenes/".$noticia["IMAGEN_PORTADA"]);

                }
				

			}


			$query = "UPDATE CAT_NOTICIAS SET TITULO = '$titulo', DESCRIPCION_CORTA = '$descripcion_corta', TEXTO = '$texto', UPDATED_AT = SYSDATE, IMAGEN_PORTADA = '$imagen_portada', URL_RECURSO = '$url_recurso' WHERE ID_NOTICIA = $id_noticia";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$noticias = $this->obtener();

			return $noticias;

        }
    }

?>
