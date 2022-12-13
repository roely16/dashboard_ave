<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class EncargadoController{

		protected $conn;

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener(){

			$query = "	SELECT * FROM
						CAT_ENCARGADOS
						INNER JOIN CAT_PERSONAS
						ON CAT_ENCARGADOS.ID_PERSONA = CAT_PERSONAS.ID_PERSONA
						ORDER BY CAT_ENCARGADOS.ID_PERSONA DESC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$encargados = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$encargados [] = $data;

			}

			return $encargados;

		}

		function registrar($request){

			$nombre = $request["NOMBRE"];
			$telefono = $request["TELEFONO"];
			$correo = $request["CORREO"];
			$establecimiento = $request["ESTABLECIMIENTO"];
			$zona = $request["ZONA"];

			$query = "INSERT INTO CAT_ENCARGADOS(NOMBRE, TELEFONO, CORREO, ESTABLECIMIENTO, ZONA) VALUES('$nombre', '$telefono', '$correo', '$establecimiento', '$zona')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$encargados = $this->obtener();

			return $encargados;

		}

		function eliminar($id){

			$query = "DELETE FROM CAT_ENCARGADOS WHERE ID_ENCARGADO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$encargados = $this->obtener();

			return $encargados;

		}

		function detalles($id){

			$query = "SELECT * FROM CAT_ENCARGADOS WHERE ID_ENCARGADO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$encargado = oci_fetch_array($stid);

			return $encargado;

		}

		function editar($request){

			$nombre = $request["NOMBRE"];
			$telefono = $request["TELEFONO"];
			$correo = $request["CORREO"];
			$establecimiento = $request["ESTABLECIMIENTO"];
			$zona = $request["ZONA"];
			$id = $request["ID_ENCARGADO"];

			$query = "UPDATE CAT_ENCARGADOS SET NOMBRE = '$nombre', TELEFONO = '$telefono', CORREO = '$correo', ESTABLECIMIENTO = '$establecimiento', ZONA = '$zona' WHERE ID_ENCARGADO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$encargados = $this->obtener();

			return $encargados;

		}

	}


?>
