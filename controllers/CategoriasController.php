<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class CategoriasController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function obtener(){

			$query = "SELECT * FROM CAT_CATEGORIAS ORDER BY ID_CATEGORIA ASC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$categorias = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$categorias[] = $data;

			}

			return $categorias;
		}

		function eliminar($id){

			/* Eliminar documento */
			$categoria = $this->detalles($id);
			unlink( $_SERVER['DOCUMENT_ROOT'] . "/apps/dashboard_ave/public/img/".$categoria['ICONO']);

			$query = "DELETE FROM CAT_CATEGORIAS WHERE ID_CATEGORIA = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$categorias = $this->obtener();

			return $categorias;
		}

		function registrar($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$icono = $request["ICONO"];
			$nombre_icono = $request["NOMBRE_ICONO"];

			$query = "INSERT INTO CAT_CATEGORIAS (NOMBRE, DESCRIPCION, ICONO, NOMBRE_ICONO) VALUES (UPPER('$nombre'), UPPER('$descripcion'), '$icono', '$nombre_icono')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$categorias = $this->obtener();

			return $categorias;
		}

		function detalles($id){

			$query = "SELECT * FROM CAT_CATEGORIAS WHERE ID_CATEGORIA = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$categoria = oci_fetch_array($stid);

			return $categoria;
		}

		function editar($request){

			$id_categoria = $request["ID_CATEGORIA"];
			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];

			if ($request["NUEVO_DIRECTORIO"] == '') {

				/* Solamente edito la informacion del documento */

				$query = "UPDATE CAT_CATEGORIAS SET NOMBRE = UPPER('$nombre'), DESCRIPCION = UPPER('$descripcion')
				WHERE ID_CATEGORIA = $id_categoria";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);


			}else{

				/* Trae un nuevo archivo, eliminar el anterior */

				$categoria = $this->detalles($id_categoria);
				unlink( $_SERVER['DOCUMENT_ROOT'] . "/apps/dashboard_ave/public/img/".$categoria['ICONO']);

				$icono = $request["NUEVO_DIRECTORIO"];
				$nombre_icono = $request["NUEVO_NOMBRE_ICONO"];

				$query = "UPDATE CAT_CATEGORIAS SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', ICONO = '$icono', NOMBRE_ICONO = '$nombre_icono' WHERE ID_CATEGORIA = $id_categoria";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			/* Devolver documentos para actualizar tabla */
			$categorias = $this->obtener();

			return $categorias;

			/*
			$id_categoria = $request["ID_CATEGORIA"];
			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$icono = $request["ICONO"];

			$query = "UPDATE CAT_CATEGORIAS SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', ICONO = '$icono' WHERE ID_CATEGORIA = $id_categoria";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$categorias = $this->obtener();


			return $request;
			*/
		}

		function subir_documento($request){

			$tempPath = $_FILES['file']['tmp_name'];

			$id_archivo = uniqid();

			$uploadPath = $_SERVER['DOCUMENT_ROOT'] . "/apps/dashboard_ave/public/img/icons/".$id_archivo;

			$archivo = "icons/".$id_archivo;
			$nombre_archivo = $_FILES['file']['name'];
			$tipo_archivo = $_FILES['file']['type'];

			if (move_uploaded_file($tempPath, $uploadPath)) {

				return array($archivo, $nombre_archivo, $tipo_archivo);

			}else{

				return array($tempPath);
			}

		}

		function verificar_eliminacion($id){

			/* Buscar si alguna comunidad depende de esta */

			$eliminar = 0;

			$query = "	SELECT COUNT(*) AS DEPENDE
						FROM CAT_PROTOCOLOS
						WHERE ID_CATEGORIA = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$protocolos_dependen = oci_fetch_array($stid);

			if ($protocolos_dependen["DEPENDE"] == 0) {

				$eliminar = 1;

			}else{

				$eliminar = 0;

			}

			return $eliminar;

		}

	}
?>
