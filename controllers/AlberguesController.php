<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	class AlberguesController{

		protected $conn;

		function __construct()
		{
			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function obtener(){

			$query = "SELECT * FROM CAT_ALBERGUES ORDER BY ID_ALBERGUE ASC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$albergues = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$albergues[] = $data;

			}

			return $albergues;
		}

		function eliminar($id){

			$query = "DELETE FROM CAT_ALBERGUES WHERE ID_ALBERGUE = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$albergues = $this->obtener();

			return $albergues;
		}

		function registrar($request){

			$nombre_albergue = $request["NOMBRE"];
			$direccion = $request["DIRECCION"];
			$nom_contacto = $request["NOMBRE_CONTACTO"];
			$tel_contacto = $request["TELEFONO_CONTACTO"];
			$email_contacto = $request["EMAIL_CONTACTO"];
			$capacidad = $request["CAPACIDAD"];
			$zona = $request["ZONA"];

			$query = "INSERT INTO CAT_ALBERGUES (NOMBRE_ALBERGUE, DIRECCION, CAPACIDAD, ZONA) VALUES (UPPER('$nombre_albergue'), UPPER('$direccion'), '$capacidad', '$zona')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$albergues = $this->obtener();

			return $albergues;
		}

		function detalles($id){

			$query = "SELECT * FROM CAT_ALBERGUES WHERE ID_ALBERGUE = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$albergue = oci_fetch_array($stid);

			return $albergue;
		}

		function editar($request){

			$id_albergue = $request["ID_ALBERGUE"];
			$nombre_albergue = $request["NOMBRE_ALBERGUE"];
			$direccion = $request["DIRECCION"];
			$nom_contacto = $request["NOM_CONTACTO"];
			$tel_contacto = $request["TEL_CONTACTO"];
			$email_contacto = $request["EMAIL_CONTACTO"];
			$capacidad = $request["CAPACIDAD"];
			$zona = $request["ZONA"];

			$query = "UPDATE CAT_ALBERGUES SET NOMBRE_ALBERGUE = UPPER('$nombre_albergue'), DIRECCION = UPPER('$direccion'), NOM_CONTACTO = UPPER('$nom_contacto'), TEL_CONTACTO = '$tel_contacto', EMAIL_CONTACTO = UPPER('$email_contacto'), CAPACIDAD = '$capacidad', ZONA = '$zona' WHERE ID_ALBERGUE = $id_albergue";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$albergues = $this->obtener();

			return $albergues;

		}

		function verificar_eliminacion($id){

			$eliminar = 0;

			$query = "	SELECT COUNT(*) AS DEPENDE
						FROM IN_ALBERGUES
						WHERE ID_ALBERGUE = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$albergues_dependen = oci_fetch_array($stid);

			if ($albergues_dependen["DEPENDE"] == 0) {

				$eliminar = 1;

			}else{

				$eliminar = 0;

			}

			return $eliminar;

		}
	}

?>
