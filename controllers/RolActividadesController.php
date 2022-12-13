<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class RolActividadesController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener($id){

			$query = "SELECT * FROM CAT_ACTIVIDADES_ROL WHERE ID_TARJETA_ROL = $id ORDER BY ORDEN ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$actividades [] = $data;

			}

			return $actividades;

		}

		function registrar($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$estado = $request["ESTADO"];
			$orden = $request["ORDEN"];
			$id_tarjeta_rol = $request["ID_TARJETA_ROL"];

			$query = "	INSERT INTO CAT_ACTIVIDADES_ROL
						(NOMBRE, DESCRIPCION, ESTADO, ORDEN, ID_TARJETA_ROL)
						VALUES ('$nombre', '$descripcion', '$estado', '$orden', '$id_tarjeta_rol')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = $this->obtener($id_tarjeta_rol);

			return $actividades;

		}

		function detalles($id_actividad){

			$query = "	SELECT * FROM CAT_ACTIVIDADES_ROL
						WHERE ID_ACTIVIDAD = $id_actividad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividad = oci_fetch_array($stid, OCI_ASSOC);

			return $actividad;


		}

		function editar($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRICION"];
			$orden = $request["ORDEN"];
			$estado = $request["ESTADO"];
			$id_actividad = $request["ID_ACTIVIDAD"];
			$id_tarjeta_rol = $request["ID_TARJETA_ROL"];

			$query = "UPDATE CAT_ACTIVIDADES_ROL SET NOMBRE = '$nombre', DESCRIPCION = '$descripcion', ORDEN = '$orden', ESTADO = '$estado' WHERE ID_ACTIVIDAD = $id_actividad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = $this->obtener($id_tarjeta_rol);

			return $actividades;

		}

		function eliminar($id_actividad, $id_mensaje){

			$query = "DELETE FROM CAT_ACTIVIDADES_ROL WHERE ID_ACTIVIDAD = $id_actividad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = $this->obtener($id_mensaje);

			return $actividades;

		}

	}


?>
