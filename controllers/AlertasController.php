<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	/* Envio de notificaciones */
	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/notifications/GCM.php';

	class AlertasController{

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener(){

			$query = "SELECT ID_ALERTA, NOMBRE, DESCRIPCION FROM CAT_ALERTAS ORDER BY ID_ALERTA ASC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$alertas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$alertas[] = $data;

			}

			return $alertas;

		}

		function registrar($request){

			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$roles = $request["ID_ROL"];

			/* Se registra la alerta */
			$query = "INSERT INTO CAT_ALERTAS (NOMBRE, DESCRIPCION) VALUES (UPPER('$nombre'), UPPER('$descripcion'))";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Filas insertadas */
			$filas_insertadas = oci_num_rows($stid);

			if ($filas_insertadas > 0) {

				$query = "SELECT MAX(ID_ALERTA) AS ID_ALERTA FROM CAT_ALERTAS";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$alerta = oci_fetch_array($stid);
				$id_alerta = $alerta["ID_ALERTA"];

				foreach ($roles as $rol) {

					$query = "INSERT INTO CAT_ALERTA_ROL (ID_ALERTA, ID_ROL) VALUES ($id_alerta, $rol)";
					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

				}

			}

			$alertas = $this->obtener();

			return $alertas;

		}

		function detalles($id){

			$query = "SELECT * FROM CAT_ALERTAS WHERE ID_ALERTA = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$alerta = oci_fetch_array($stid);
			$id_alerta = $alerta["ID_ALERTA"];

			/* Buscar roles */
			$query = "SELECT ID_ROL FROM CAT_ALERTA_ROL WHERE ID_ALERTA = $id_alerta";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles[] = $data["ID_ROL"];

			}

			$alerta["ID_ROL"] = $roles;

			return $alerta;

		}

		function editar($request){

			$id_alerta = $request["ID_ALERTA"];
			$nombre = $request["NOMBRE"];
			$descripcion = $request["DESCRIPCION"];
			$roles = $request["ID_ROL"];

			$query = "UPDATE CAT_ALERTAS SET NOMBRE = UPPER('$nombre'), DESCRIPCION = UPPER('$descripcion') WHERE ID_ALERTA = $id_alerta";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$query = "DELETE FROM CAT_ALERTA_ROL WHERE ID_ALERTA = $id_alerta";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			foreach ($roles as $rol) {

				$query = "INSERT INTO CAT_ALERTA_ROL (ID_ALERTA, ID_ROL) VALUES ($id_alerta, $rol)";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}

			$alertas = $this->obtener();

			return $alertas;

		}

		function eliminar($id){

			$query = "DELETE FROM CAT_ALERTAS WHERE ID_ALERTA = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$alertas = $this->obtener();

			return $alertas;

		}

		function probar_alerta($id){

			/* Buscar nombre de alerta */
			$query = "	SELECT *
						FROM CAT_ALERTAS WHERE ID_ALERTA = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$alerta = oci_fetch_array($stid);

			$query = "	SELECT ID_ROL
						FROM CAT_ALERTA_ROL
						WHERE ID_ALERTA = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles [] = $data["ID_ROL"];

			}

			$roles_separados = implode(", ", $roles);

			$query = "SELECT CAT_PERSONAS.ID_PERSONA, UPPER(CAT_PERSONAS.NOMBRE) AS NOMBRE, CAT_PERSONAS.TELEFONO, CAT_PERSONAS.ID_DISPOSITIVO, CAT_ROLES.NOMBRE AS ROL, CAT_MENSAJES_ROL.TEXTO_MENSAJE
            FROM CAT_PERSONAS
            INNER JOIN CAT_PERSONA_ROL
            ON CAT_PERSONAS.ID_PERSONA = CAT_PERSONA_ROL.ID_PERSONA
            INNER JOIN CAT_ROLES
            ON CAT_PERSONA_ROL.ID_ROL = CAT_ROLES.ID_ROL
            LEFT JOIN CAT_MENSAJES_ROL
            ON CAT_ROLES.ID_ROL = CAT_MENSAJES_ROL.ID_ROL
            AND CAT_MENSAJES_ROL.ID_ALERTA = $id
            WHERE CAT_PERSONA_ROL.ID_ROL IN (

                SELECT CAT_ALERTA_ROL.ID_ROL
                FROM CAT_ALERTAS
                INNER JOIN CAT_ALERTA_ROL
                ON CAT_ALERTAS.ID_ALERTA = CAT_ALERTA_ROL.ID_ALERTA
                WHERE CAT_ALERTAS.ID_ALERTA = $id

            )
            ORDER BY CAT_PERSONAS.ID_PERSONA ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$personas [] = $data;

			}

			$query = "	SELECT COUNT(CAT_PERSONAS.ID_PERSONA) AS PERSONAS, CAT_ROLES.NOMBRE
						FROM CAT_PERSONA_ROL
						INNER JOIN CAT_PERSONAS
						ON CAT_PERSONA_ROL.ID_PERSONA = CAT_PERSONAS.ID_PERSONA
						INNER JOIN CAT_ROLES
						ON CAT_PERSONA_ROL.ID_ROL = CAT_ROLES.ID_ROL
						WHERE CAT_PERSONA_ROL.ID_ROL IN ($roles_separados)
						GROUP BY CAT_ROLES.NOMBRE";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles_generales = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles_generales [] = $data;

			}

			return array($personas, $roles_generales, $alerta);

		}

		function verificar_envio($request){

			$telefono = $request["TELEFONO"];
			$id_persona = $request["ID_PERSONA"];

			/* Verificar que el numero de telefono pertenezca a la persona que inicio sesión */
			$query = "	SELECT *
						FROM CAT_PERSONAS WHERE ID_PERSONA = $id_persona
						AND TELEFONO = '+502$telefono'";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$persona = oci_fetch_array($stid);

			if ($persona == false) {

				$enviar_alertas = 0;

			}else{

				$enviar_alertas = 1;

			}

			return array($enviar_alertas, $persona);

		}

		function enviar_alertas($request){

			$id_alerta = $request["ID_ALERTA"];
			$id_persona = $request["ID_PERSONA"];

			$datos_envio = $this->probar_alerta($id_alerta);

			$personas = $datos_envio[0];
			$alerta = $datos_envio[2];

			$myfile = fopen("../../public/log.txt", "a") or die("Unable to open file!");

			$txt = "********************** ACTIVACIÓN ALERTA ".$alerta["NOMBRE"]." ***********************\n";
			fwrite($myfile, $txt);

			$query = "	SELECT *
						FROM CAT_PERSONAS
						WHERE ID_PERSONA = $id_persona";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$persona_activacion = oci_fetch_array($stid);

			$txt = "*********************** ACTIVADO POR: ".$persona_activacion["NOMBRE"]." **********************\n";
			fwrite($myfile, $txt);

			$fecha= date('d/m/Y G:i:s');
			$txt = "********************** ".$fecha." *****************************\n";
			fwrite($myfile, $txt);

			$notificacion = new GCM();

			foreach ($personas as $persona) {

				if ($persona["ID_DISPOSITIVO"]) {

					$id_dispositivo = "SI";

				}else{

					$id_dispositivo = "NO";

				}

				$fecha= date('d/m/Y G:i:s');

				/* Envio de notificación */

				$result = $notificacion->send_notification($persona["ID_DISPOSITIVO"], 'EMERGENCIA ACTIVADA REVISE SU APP', 'alerta', $persona["TEXTO_MENSAJE"], $persona["TELEFONO"]);

				$txt = "ID_PERSONA: ".$persona["ID_PERSONA"].", NOMBRE: ".$persona["NOMBRE"].", ID_DISPOSITIVO: ".$id_dispositivo.", FECHA: ".$fecha."\n";

				fwrite($myfile, $txt);
				// return $persona;
			}
			fwrite($myfile, "************************** FIN REGISTRO *******************\n\n");

			fclose($myfile);

			return $personas;

		}
	}


?>
