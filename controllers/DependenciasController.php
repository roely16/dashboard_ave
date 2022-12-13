	<?php

		require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

		/**
		*
		*/
		class DependenciasController
		{

			function __construct(){

				$dbc = new Oracle();
				$this->conn = $dbc->connect();

			}

			function obtener(){

				$query = "SELECT * FROM CAT_DEPENDENCIAS ORDER BY ID_DEPENDENCIA ASC";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$dependencias = array();

				while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

					$dependencias [] = $data;

				}

				return $dependencias;
			}

			function registrar($request){

				$nombre = $request["NOMBRE"];
				$telefono = $request["TELEFONO"];
				$email = $request["EMAIL"];

				$query = "INSERT INTO CAT_DEPENDENCIAS (NOMBRE, TELEFONO, EMAIL) VALUES (UPPER('$nombre'), UPPER('$telefono'), UPPER('$email'))";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$dependencias = $this->obtener();

				return $dependencias;
			}

			function eliminar($id){

				$query = "DELETE FROM CAT_DEPENDENCIAS WHERE ID_DEPENDENCIA = $id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$dependencias = $this->obtener();

				return $dependencias;
			}

			function detalles($id){

				$query = "SELECT * FROM CAT_DEPENDENCIAS WHERE ID_DEPENDENCIA = $id";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$dependencia = oci_fetch_array($stid);

				return $dependencia;
			}

			function editar($request){

				$nombre = $request["NOMBRE"];
				$telefono = $request["TELEFONO"];
				$email = $request["EMAIL"];
				$id_dependencia = $request["ID_DEPENDENCIA"];

				$query = "UPDATE CAT_DEPENDENCIAS SET NOMBRE = UPPER('$nombre'), TELEFONO = UPPER('$telefono'), EMAIL = UPPER('$email') WHERE ID_DEPENDENCIA = $id_dependencia";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$dependencias = $this->obtener();

				return $dependencias;
			}

			function verificar_eliminacion($id){

				/* Buscar si alguna comunidad depende de esta */

				$eliminar = 0;

				$query = "	SELECT COUNT(*) AS DEPENDE
							FROM CAT_PERSONAS
							WHERE ID_DEPENDENCIA = $id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$personas_dependen = oci_fetch_array($stid);

				if ($personas_dependen["DEPENDE"] == 0) {

					$eliminar = 1;

				}else{

					$eliminar = 0;

				}

				return $eliminar;

			}

		}

	?>
