<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class ActividadesController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function obtener($id){

			$query = "	SELECT CAT_ACTIVIDADES.ID_ACTIVIDAD, CAT_ACTIVIDADES.ORDEN, CAT_ACTIVIDADES.NOMBRE,
				 		CAT_ACTIVIDADES.ESTADO
						FROM CAT_ACTIVIDADES
						WHERE ID_PROTOCOLO = $id ORDER BY ID_ACTIVIDAD ASC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$actividades[] = $data;

			}

			return $actividades;
		}

		function eliminar($id, $id_protocolo){

			$query = "DELETE FROM CAT_ACTIVIDADES WHERE ID_ACTIVIDAD = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = $this->obtener($id_protocolo);

			return $actividades;
		}

		function registrar($request){

			$descripcion = $request["DESCRIPCION"];
			$estado = $request["ESTADO"];
			$orden = $request["ORDEN"];
			$id_roles = $request["ID_ROL"];
			$id_protocolo = $request["ID_PROTOCOLO"];
			$nombre = $request["NOMBRE"];

			$query = "INSERT INTO CAT_ACTIVIDADES (DESCRIPCION, ESTADO, ORDEN, ID_PROTOCOLO, NOMBRE) VALUES (UPPER('$descripcion'), '$estado', '$orden', '$id_protocolo', UPPER('$nombre'))";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = $this->obtener($id_protocolo);

			$query = "SELECT CAT_ACTIVIDADES_SEQ.CURRVAL FROM DUAL";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$id_actividad = oci_fetch_array($stid);
			$actividad = $id_actividad[0];

			foreach ($id_roles as $rol) {

				$query = "INSERT INTO CAT_ACTIVIDAD_ROL (ID_ACTIVIDAD, ID_ROL) VALUES ('$actividad', '$rol')";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			$actividades = $this->obtener($id_protocolo);

			return $actividades;
		}

		function detalles($id){

			$query = "SELECT * FROM CAT_ACTIVIDADES WHERE ID_ACTIVIDAD = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividad = oci_fetch_array($stid);

			$id_actividad = $actividad['ID_ACTIVIDAD'];

			$query = "	SELECT ID_ROL
						FROM CAT_ACTIVIDAD_ROL
						WHERE ID_ACTIVIDAD = $id_actividad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles [] = $data["ID_ROL"];

			}

			$actividad["ROLES"] = $roles;

			return $actividad;
		}

		function editar($request){

			$id_actividad = $request["ID_ACTIVIDAD"];
			$descripcion = $request["DESCRIPCION"];
			$estado = $request["ESTADO"];
			$orden = $request["ORDEN"];
			$roles = $request["ROLES"];
			$id_protocolo = $request["ID_PROTOCOLO"];
			$nombre = $request["NOMBRE"];

			$query = "UPDATE CAT_ACTIVIDADES SET DESCRIPCION = UPPER('$descripcion'), ESTADO = '$estado', ORDEN = '$orden', ID_PROTOCOLO = $id_protocolo, NOMBRE = UPPER('$nombre') WHERE ID_ACTIVIDAD = $id_actividad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Eliminar todos los roles */
			$query = "DELETE FROM CAT_ACTIVIDAD_ROL WHERE ID_ACTIVIDAD = $id_actividad";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Volver a insertar los roles */
			foreach ($roles as $rol) {

				$query = "INSERT INTO CAT_ACTIVIDAD_ROL (ID_ACTIVIDAD, ID_ROL)
						VALUES ($id_actividad, $rol)";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}


			$actividades = $this->obtener($id_protocolo);

			return $actividades;

		}

		function verificar_eliminacion($id){

			$eliminar = 0;

			$query = "	SELECT COUNT(*) AS DEPENDE
						FROM IN_ACTIVIDADES
						WHERE ID_ACTIVIDAD = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades_dependen = oci_fetch_array($stid);

			if ($actividades_dependen["DEPENDE"] == 0) {

				$eliminar = 1;

			}else{

				$eliminar = 0;

			}

			return $eliminar;

		}
	}

?>
