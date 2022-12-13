	<?php

		require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

		/**
		*
		*/
		class RolesController{

			function __construct(){

				$dbc = new Oracle();
				$this->conn = $dbc->connect();

			}

			function obtener(){

				$query = "SELECT ID_ROL, NOMBRE FROM CAT_ROLES ORDER BY ID_ROL ASC";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$roles = array();

				while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

					$roles [] = $data;

				}

				return $roles;
			}

			function registrar($request){

				$nombre = $request["NOMBRE"];
				$descripcion = $request["DESCRIPCION"];
				$texto_mensaje = $request["TEXTO_MENSAJE"];

				$query = "INSERT INTO CAT_ROLES (NOMBRE, DESCRIPCION, TEXTO_MENSAJE) VALUES (UPPER('$nombre'), UPPER('$descripcion'), UPPER('$texto_mensaje'))";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$roles = $this->obtener();

				return $roles;
			}

			function eliminar($id){

				$query = "DELETE FROM CAT_ROLES WHERE ID_ROL = $id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$roles = $this->obtener();

				return $roles;
			}

			function detalles($id){

				$query = "SELECT * FROM CAT_ROLES WHERE ID_ROL = $id";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$rol = oci_fetch_array($stid);

				return $rol;
			}

			function editar($request){

				$id_rol = $request["ID_ROL"];
				$nombre = $request["NOMBRE"];
				$descripcion = $request["DESCRIPCION"];
				$texto_mensaje = $request["TEXTO_MENSAJE"];

				$query = "UPDATE CAT_ROLES SET NOMBRE = UPPER('$nombre'), DESCRIPCION = UPPER('$descripcion'), TEXTO_MENSAJE = UPPER('$texto_mensaje') WHERE ID_ROL = $id_rol";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$resultado = oci_num_rows($stid);

				$roles = $this->obtener();

				return $roles;
			}

			function verificar_eliminacion($id){

				/* Buscar si alguna comunidad depende de esta */

				$eliminar = 0;

				$query = "	SELECT COUNT(*) AS DEPENDE
							FROM CAT_PERSONAS
							WHERE ID_ROL = $id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$personas_dependen = oci_fetch_array($stid);

				if ($personas_dependen["DEPENDE"] == 0) {

					$eliminar = 1;

					/* Verificar si existen actividades con este rol */

					$query = "	SELECT COUNT(*) AS DEPENDE
							FROM CAT_ACTIVIDADES
							WHERE ID_ROL = $id";

					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

					$actividades_dependen = oci_fetch_array($stid);

					if ($actividades_dependen["DEPENDE"] == 0) {

						$eliminar = 1;

						/* Validar si existen alertas con este rol */

						$query = "	SELECT COUNT(*) AS DEPENDE
							FROM IN_ALERTAS
							WHERE ID_ROL = $id";

						$stid = oci_parse($this->conn, $query);
						oci_execute($stid);

						$alertas_dependen = oci_fetch_array($stid);

						if ($alertas_dependen["DEPENDE"] == 0) {

							$eliminar = 1;

						}else{

							$eliminar = 0;
						}

					}else{

						$eliminar = 0;

					}

				}else{

					$eliminar = 0;

				}

				return $eliminar;

			}

			function roles_disponibles($id){

				/*
					Buscar todos los roles que no esten
					aun agregados a la comunidad
				*/

				$query = "	SELECT ID_ROL, NOMBRE
							FROM CAT_ROLES
							WHERE ID_ROL NOT IN (
							    SELECT ID_ROL
							    FROM CAT_ROLES_COMUNIDAD
							    WHERE ID_COMUNIDAD = $id
							)
							ORDER BY ID_ROL ASC";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$roles_disponibles = array();

				while ($data = oci_fetch_array($stid, OCI_ASSOC)) {
					$roles_disponibles [] = $data;
				}

				return $roles_disponibles;

			}

		}

	?>
