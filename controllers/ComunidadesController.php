<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/PersonasController.php';

	/**
	*
	*/
	class ComunidadesController {

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener(){

			/* TreeView */
			$query = "SELECT * FROM CAT_COMUNIDADES WHERE DEPENDE IS NULL ORDER BY ID_COMUNIDAD ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$segmentos = array();
			$tiene_hijos = true;

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$id_comunidad = $data["ID_COMUNIDAD"];

				$query = "SELECT * FROM CAT_COMUNIDADES WHERE DEPENDE = $id_comunidad ORDER BY ID_COMUNIDAD ASC" ;
				$stid_ = oci_parse($this->conn, $query);
				oci_execute($stid_);

				$comunidades = array();

				while ($data_ = oci_fetch_array($stid_,OCI_ASSOC)) {

					$id_comunidad_2 = $data_["ID_COMUNIDAD"];

					$query = "SELECT * FROM CAT_COMUNIDADES WHERE DEPENDE = $id_comunidad_2 ORDER BY ID_COMUNIDAD ASC";
					$stid2 = oci_parse($this->conn, $query);
					oci_execute($stid2);

					$comunidades2 = array();

					while ($data2 = oci_fetch_array($stid2,OCI_ASSOC)) {

						$id_comunidad_3 = $data2["ID_COMUNIDAD"];

						$query = "SELECT * FROM CAT_COMUNIDADES WHERE DEPENDE = $id_comunidad_3 ORDER BY ID_COMUNIDAD ASC";
						$stid3 = oci_parse($this->conn, $query);
						oci_execute($stid3);

						$comunidades3 = array();

						while ($data3 = oci_fetch_array($stid3, OCI_ASSOC)) {

							$id_comunidad_4 = $data3["ID_COMUNIDAD"];

							$query = "SELECT * FROM CAT_COMUNIDADES WHERE DEPENDE = $id_comunidad_4 ORDER BY ID_COMUNIDAD ASC";
							$stid4 = oci_parse($this->conn, $query);
							oci_execute($stid4);

							$comunidades4 = array();

							while ($data4 = oci_fetch_array($stid4, OCI_ASSOC)) {

								$comunidades4 [] = $data4;

							}

							$data3["COMUNIDADES"] = $comunidades4;
							$comunidades3 [] = $data3;

						}

						$data2["COMUNIDADES"] = $comunidades3;
						$comunidades2 [] = $data2;

					}

					$data_["COMUNIDADES"] = $comunidades2;

					$comunidades [] = $data_;

				}

				$data["COMUNIDADES"] = $comunidades;

				$segmentos [] = $data;

			}

			return $segmentos;
		}

		function obtener_comunidades($id){

			$query = "SELECT * FROM CAT_COMUNIDADES WHERE ID_COMUNIDAD = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$segmento = oci_fetch_array($stid);

			$query = "SELECT * FROM CAT_COMUNIDADES WHERE DEPENDE = $id ORDER BY ID_COMUNIDAD DESC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidades = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$comunidades [] = $data;

			}

			return array($segmento, $comunidades);
		}

		function obtener_todas_comunidades(){

			$query = "SELECT * FROM CAT_COMUNIDADES";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidades = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$comunidades [] = $data;

			}

			return $comunidades;
		}

		function registrar($request){

			// $nombre = $request["NOMBRE"];
			// $depende = 'null';
			//
			// if (array_key_exists('DESCRIPCION', $request)) {
			//
			// 	if ($request["DESCRIPCION"] != "") {
			//
			// 		$descripcion = $request["DESCRIPCION"];
			//
			// 	}else{
			//
			// 		$descripcion = 'null';
			//
			// 	}
			//
			// }else{
			//
			// 	$descripcion = 'null';
			//
			// }
			//
			// $query = "INSERT INTO CAT_COMUNIDADES (NOMBRE, DESCRIPCION, DEPENDE) VALUES ('$nombre', '$descripcion', $depende)";
			//
			// $stid = oci_parse($this->conn, $query);
			// oci_execute($stid);
			//
			// $comunidades = $this->obtener();

			return $request;
		}

		function registrarComunidad($request){

			$nombre = $request["NOMBRE"];
			$oculto = $request["OCULTO"];
			$zona = $request["ZONA"];

			if ($oculto) {
				$oculto = 1;
			}else{
				$oculto = 0;
			}

			if (array_key_exists('DEPENDE', $request)) {

				$depende = $request["DEPENDE"];

			}else{

				$depende = '';

			}

			if (array_key_exists('DESCRIPCION', $request)) {

				if ($request["DESCRIPCION"] != "") {

					$descripcion = $request["DESCRIPCION"];

				}else{

					$descripcion = '';

				}

			}else{

				$descripcion = '';

			}

			$query = "INSERT INTO CAT_COMUNIDADES (NOMBRE, DESCRIPCION, DEPENDE, CERRADA) VALUES (UPPER('$nombre'), UPPER('$descripcion'), '$depende', $oculto)";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			//$comunidades = $this->obtener_comunidades($depende);
			$segmentos = $this->obtener();

			return $segmentos;
		}

		function eliminar($id, $id_comunidad){

			$query = "DELETE FROM CAT_COMUNIDADES WHERE ID_COMUNIDAD = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidades = $this->obtener_comunidades($id_comunidad);

			return $comunidades;
		}

		function eliminar_segmento($id){

			$query = "DELETE FROM CAT_COMUNIDADES WHERE ID_COMUNIDAD = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$segmentos = $this->obtener();

			return $segmentos;
		}

		function detalles($id){

			$query = "SELECT * FROM CAT_COMUNIDADES WHERE ID_COMUNIDAD = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidad = oci_fetch_array($stid, OCI_ASSOC);

			return $comunidad;
		}

		function editar($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$id_comunidad = $request["ID_COMUNIDAD"];
			$depende = $request["DEPENDE"];
			$oculto = $request["OCULTO"];

			if ($oculto) {
				$oculto = 1;
			}else{
				$oculto = 0;
			}

			/*
			if ($request["DEPENDE"] == "") {

				$query = "UPDATE CAT_COMUNIDADES SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', DEPENDE = '', CERRADA = $oculto WHERE ID_COMUNIDAD = $id_comunidad";

			}else{

				$depende = $request["DEPENDE"];

				$query = "UPDATE CAT_COMUNIDADES SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', DEPENDE = $depende, CERRADA = $oculto WHERE ID_COMUNIDAD = $id_comunidad";

			}
			*/

			$query = "UPDATE CAT_COMUNIDADES SET NOMBRE = UPPER('$nombre'), DESCRIPCION = UPPER('$descripcion'), DEPENDE = '$depende', CERRADA = $oculto WHERE ID_COMUNIDAD = $id_comunidad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidades = $this->obtener();

			return $comunidades;
		}

		function verificar_eliminacion($id){

			/* Buscar si alguna comunidad depende de esta */

			$eliminar = 0;

			$query = "	SELECT COUNT(*) AS DEPENDE
						FROM CAT_COMUNIDADES
						WHERE DEPENDE = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidades_dependen = oci_fetch_array($stid);

			if ($comunidades_dependen["DEPENDE"] == 0) {

				/* Ninguna comunidad depende de esta */

				/* Buscar si alguna persona depende de la comunidad */

				$query = "	SELECT COUNT(*) AS DEPENDEN
							FROM CAT_PERSONAS
							WHERE ID_COMUNIDAD = $id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$personas_dependen = oci_fetch_array($stid);

				if ($personas_dependen["DEPENDEN"] == 0) {

					$eliminar = 1;

				}else{

					$eliminar = 0;

				}

				return $eliminar;

			}else{

				/* Alguna comunidad depende de esta */

				$eliminar = 0;

				return $eliminar;

			}

		}

		function roles_comunidad($id_comunidad, $id_nivel){

			$query = "	SELECT CAT_ROLES.ID_ROL, UPPER(CAT_ROLES.NOMBRE) AS NOMBRE
						FROM CAT_ROLES_COMUNIDAD
						INNER JOIN CAT_COMUNIDADES
						ON CAT_ROLES_COMUNIDAD.ID_COMUNIDAD = CAT_COMUNIDADES.ID_COMUNIDAD
						INNER JOIN CAT_ROLES
						ON CAT_ROLES_COMUNIDAD.ID_ROL = CAT_ROLES.ID_ROL
						WHERE CAT_ROLES_COMUNIDAD.ID_COMUNIDAD = $id_comunidad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$roles [] = $data;

			}

			return $roles;

		}

		function rol_permisos_comunidad($request){

			$id_comunidad_persona = $request["id_comunidad_persona"];
			$id_comunidad = $request["id_comunidad"];
			$id_nivel_persona = $request["id_nivel_persona"];

			/* Obtener los roles para esa comunidad */
			$roles_comunidad = $this->roles_comunidad($id_comunidad, $id_nivel_persona);

			/* Obtener registro de CAT_COMUNIDAD_PERSONAS */
			$query = "SELECT * FROM CAT_COMUNIDAD_PERSONAS WHERE ID_COMUNIDAD_P = $id_comunidad_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidad_persona = oci_fetch_array($stid, OCI_ASSOC);

			$comunidad_persona["ROLES"] = $roles_comunidad;

			return $comunidad_persona;

		}

		function actualizarRolPermisos($request){

			$id_comunidad_p = $request["ID_COMUNIDAD_P"];
			$id_rol = $request["ID_ROL"];
			$id_persona = $request["ID_PERSONA"];

			$query = "UPDATE CAT_COMUNIDAD_PERSONAS SET ID_ROL = $id_rol WHERE ID_COMUNIDAD_P = $id_comunidad_p";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas_ctrl = new PersonasController();

			$persona = $personas_ctrl->detalles($id_persona);

			return $persona;

		}

		function integrantes_comunidad($id){

			$query = "	SELECT CAT_COMUNIDAD_PERSONAS.ID_COMUNIDAD_P, CAT_COMUNIDAD_PERSONAS.ID_COMUNIDAD,
						CAT_COMUNIDAD_PERSONAS.ID_PERSONA, CAT_COMUNIDAD_PERSONAS.ID_ROL, 
						UPPER(CAT_PERSONAS.NOMBRE) AS NOMBRE, UPPER(CAT_PERSONAS.APELLIDO) AS APELLIDO, UPPER(CAT_ROLES.NOMBRE) AS ROL, CAT_PERSONAS.TELEFONO, CAT_PERSONAS.EMAIL
						FROM CAT_COMUNIDAD_PERSONAS
						INNER JOIN CAT_PERSONAS
						ON CAT_COMUNIDAD_PERSONAS.ID_PERSONA = CAT_PERSONAS.ID_PERSONA
						INNER JOIN CAT_ROLES
						ON CAT_COMUNIDAD_PERSONAS.ID_ROL = CAT_ROLES.ID_ROL
						WHERE CAT_COMUNIDAD_PERSONAS.ID_COMUNIDAD = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$integrantes = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$integrantes [] = $data;

			}

			return $integrantes;

		}

		function todos_roles_comunidad($id_comunidad){

			$query = "	SELECT CAT_ROLES_COMUNIDAD.ID_ROL_COM, CAT_ROLES_COMUNIDAD.ID_COMUNIDAD,
						UPPER(CAT_ROLES.NOMBRE) AS NOMBRE, CAT_NIVELES.DESCRIPCION AS NIVEL, CAT_ROLES_COMUNIDAD.OCULTO
						FROM CAT_ROLES_COMUNIDAD
						INNER JOIN CAT_COMUNIDADES
						ON CAT_ROLES_COMUNIDAD.ID_COMUNIDAD = CAT_COMUNIDADES.ID_COMUNIDAD
						INNER JOIN CAT_ROLES
						ON CAT_ROLES_COMUNIDAD.ID_ROL = CAT_ROLES.ID_ROL
						INNER JOIN CAT_NIVELES
						ON CAT_ROLES_COMUNIDAD.ID_NIVEL = CAT_NIVELES.ID_NIVEL
						WHERE CAT_ROLES_COMUNIDAD.ID_COMUNIDAD = $id_comunidad
						ORDER BY CAT_ROLES_COMUNIDAD.ID_NIVEL ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$roles [] = $data;

			}

			return $roles;

		}

		function agregar_roles($request){

			$roles = $request["LISTA"];
			$nivel = $request["NIVEL"];
			$id_comunidad = $request["COMUNIDAD"];
			$oculto = $request["OCULTO"];

			if ($oculto) {
				$oculto = 1;
			}else{
				$oculto = 0;
			}

			foreach ($roles as $rol) {

				$query = "INSERT INTO CAT_ROLES_COMUNIDAD (ID_COMUNIDAD, ID_ROL, ID_NIVEL, OCULTO) VALUES ($id_comunidad, $rol, $nivel, $oculto)";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			$roles_comunidad = $this->todos_roles_comunidad($id_comunidad);

			return $roles_comunidad;

		}

		function eliminar_rol($id_rol, $id_comunidad){

			$query = "DELETE FROM CAT_ROLES_COMUNIDAD WHERE ID_ROL_COM = $id_rol";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = $this->todos_roles_comunidad($id_comunidad);

			return $roles;

		}

		function detalles_rol($id_rol){

			$query = "SELECT * FROM CAT_ROLES_COMUNIDAD WHERE ID_ROL_COM = $id_rol";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$rol = oci_fetch_array($stid, OCI_ASSOC);

			return $rol;

		}

		function editar_rol($request){

			$id_nivel = $request["ID_NIVEL"];
			$oculto = $request["OCULTO"];
			$id_comunidad = $request["ID_COMUNIDAD"];
			$id_rol_com = $request["ID_ROL_COM"];

			if ($oculto) {
				$oculto = 1;
			}else{
				$oculto = 0;
			}

			$query = "UPDATE CAT_ROLES_COMUNIDAD SET ID_NIVEL = $id_nivel, OCULTO = $oculto WHERE ID_ROL_COM = $id_rol_com";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = $this->todos_roles_comunidad($id_comunidad);

			return $roles;

		}

		function zonas_comunidad($id_comunidad){

			$query = "SELECT * FROM CAT_COMUNIDAD_ZONA WHERE ID_COMUNIDAD = $id_comunidad";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$zonas = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {
				$zonas [] = $data;
			}

			return $zonas;

		}

		function zonas_disponibles($id_comunidad){

			$query = "	SELECT *
						FROM CAT_ZONAS
						WHERE ZONA NOT IN (

						    SELECT ZONA
						    FROM CAT_COMUNIDAD_ZONA
						    WHERE ID_COMUNIDAD = $id_comunidad

						)";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$zonas = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {
				$zonas [] = $data;
			}

			return $zonas;
		}

		function registrar_zona($request){

			$id_comunidad = $request["ID_COMUNIDAD"];
			$zona = $request["ZONA"];

			$query = "INSERT INTO CAT_COMUNIDAD_ZONA (ID_COMUNIDAD, ZONA) VALUES ('$id_comunidad', '$zona')";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$zonas = $this->zonas_comunidad($id_comunidad);

			return $zonas;

		}

		function eliminar_zona($id_comunidad_zona, $id_comunidad){

			$query = "DELETE FROM CAT_COMUNIDAD_ZONA WHERE ID_COMUNIDAD_ZONA = $id_comunidad_zona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$zonas = $this->zonas_comunidad($id_comunidad);

			return $zonas;

		}

	}

?>
