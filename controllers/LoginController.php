<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class LoginController
	{
		private $conn;

		function __construct()
		{
			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function login($request){

			$usuario = $request["user"];
			$password = $request["password"];

			$query = "	SELECT USUARIO, ID_PERSONA
						FROM CAT_USUARIOS
			   			WHERE UPPER(RTRIM(USUARIO)) = '". strtoupper(trim($usuario,'UTF-8')) ."'
				 		AND RTRIM(DESENCRIPTAR(PASS)) = '". trim($password) ."'";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$usuario = oci_fetch_array($stid);

			return $usuario;

		}
	}

?>
