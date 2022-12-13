<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class EquipoTrabajoController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener($id){

			$query = "SELECT * FROM CAT_EQUIPO_TRABAJO WHERE ID_ENCARGADO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$equipo_trabajo = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$equipo_trabajo [] = $data;

			}

			return $equipo_trabajo;

		}
	}

?>
