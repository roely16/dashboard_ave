<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	/**
	 *
	 */
	class NivelesController
	{

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();
			
		}

		function obtener_niveles(){

			$query = "SELECT * FROM CAT_NIVELES";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$niveles = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {
				$niveles [] = $data;
			}

			return $niveles;

		}

	}


?>
