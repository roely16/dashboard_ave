<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	/* Envio de notificaciones */
	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/notifications/GCM.php';

	class ProtocolosController{

		protected $conn;

		function __construct()
		{
			$dbc = new Oracle();
			$this->conn = $dbc->connect();
		}

		function obtener($id){

			$query = "SELECT * FROM CAT_PROTOCOLOS WHERE ID_CATEGORIA = $id ORDER BY ID_PROTOCOLO ASC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$protocolos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$protocolos[] = $data;

			}

			return $protocolos;
		}

		function obtener_todos(){

			$query = "	SELECT CAT_PROTOCOLOS.ID_PROTOCOLO, CAT_PROTOCOLOS.NOMBRE, CAT_PROTOCOLOS.ESTADO,
						CAT_PROTOCOLOS.ORDEN, CAT_PROTOCOLOS.ID_CATEGORIA
						FROM CAT_PROTOCOLOS
						ORDER BY CAT_PROTOCOLOS.ORDEN ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$protocolos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				if (array_key_exists("ID_CATEGORIA", $data)) {

					$id_categoria = $data["ID_CATEGORIA"];

					$query = "SELECT NOMBRE FROM CAT_CATEGORIAS WHERE ID_CATEGORIA = $id_categoria";

					$stid_ = oci_parse($this->conn, $query);
					oci_execute($stid_);

					$categoria = oci_fetch_array($stid_);

					$data["CATEGORIA"] = $categoria["NOMBRE"];

				}else{

					$data["CATEGORIA"] = "";

				}

				$protocolos[] = $data;

			}

			return $protocolos;
		}

		function eliminar($id, $id_categoria){

			$query = "DELETE FROM CAT_PROTOCOLOS WHERE ID_PROTOCOLO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			if ($id_categoria != 0) {

				$protocolos = $this->obtener($id_categoria);

			}else{

				$protocolos = $this->obtener_todos();

			}

			return $protocolos;
		}

		function registrar($request){

			$nombre = $request["NOMBRE"];

			if (array_key_exists("DESCRIPCION", $request)) {
				$descripcion = $request["DESCRIPCION"];
			}else{
				$descripcion = "";
			}

			if (array_key_exists("REQUIERE_UBICACION", $request)) {
				$requiere_ubicacion = $request["REQUIERE_UBICACION"];
			}else{
				$requiere_ubicacion = "";
			}

			if (array_key_exists("REQUIERE_ACTIVACION", $request)) {
				$requiere_activacion = $request["REQUIERE_ACTIVACION"];
			}else{
				$requiere_activacion = "";
			}

			if (array_key_exists("ORDEN", $request)) {
				if ($request["ORDEN"] == NULL) {
					$orden = '';
				}else{
					$orden = $request["ORDEN"];
				}

			}else{
				$orden = "";
			}

			if (array_key_exists("ESTADO", $request)) {
				$estado = $request["ESTADO"];
			}else{
				$estado = "";
			}

			if (array_key_exists("ID_CATEGORIA", $request)) {
				if ($request["ID_CATEGORIA"] == NULL) {
					$id_categoria = '';
				}else{
					$id_categoria = $request["ID_CATEGORIA"];
				}
			}else{
				$id_categoria = "";
			}

			$query = "INSERT INTO CAT_PROTOCOLOS (NOMBRE, DESCRIPCION, REQUIERE_UBICACION, REQUIERE_ACTIVACION, ORDEN, ESTADO, ID_CATEGORIA) VALUES (UPPER('$nombre'), UPPER('$descripcion'), '$requiere_ubicacion', '$requiere_activacion', '$orden', '$estado', '$id_categoria')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			if (array_key_exists('MODULO_PROTOCOLOS', $request)) {

				$protocolos = $this->obtener_todos();

			}else{

				$protocolos = $this->obtener($id_categoria);

			}

			return $protocolos;
		}

		function detalles($id){

			$query = "SELECT * FROM CAT_PROTOCOLOS WHERE ID_PROTOCOLO = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$protocolo = oci_fetch_array($stid);

			return $protocolo;
		}

		function editar($request){

			$id_protocolo = $request["ID_PROTOCOLO"];
			$nombre = $request["NOMBRE"];

			if (array_key_exists("DESCRIPCION", $request)) {
				$descripcion = $request["DESCRIPCION"];
			}else{
				$descripcion = "";
			}

			if (array_key_exists("REQUIERE_UBICACION", $request)) {
				$requiere_ubicacion = $request["REQUIERE_UBICACION"];
			}else{
				$requiere_ubicacion = "";
			}

			if (array_key_exists("REQUIERE_ACTIVACION", $request)) {
				$requiere_activacion = $request["REQUIERE_ACTIVACION"];
			}else{
				$requiere_activacion = "";
			}

			if (array_key_exists("ORDEN", $request)) {
				if ($request["ORDEN"] == NULL) {
					$orden = '';
				}else{
					$orden = $request["ORDEN"];
				}

			}else{
				$orden = "";
			}

			if (array_key_exists("ESTADO", $request)) {
				$estado = $request["ESTADO"];
			}else{
				$estado = "";
			}

			if (array_key_exists("ID_CATEGORIA", $request)) {
				if ($request["ID_CATEGORIA"] == NULL) {
					$id_categoria = '';
				}else{
					$id_categoria = $request["ID_CATEGORIA"];
				}
			}else{
				$id_categoria = "";
			}

			$query = "UPDATE CAT_PROTOCOLOS SET NOMBRE = UPPER('$nombre'), DESCRIPCION = UPPER('$descripcion'), REQUIERE_UBICACION = '$requiere_ubicacion', REQUIERE_ACTIVACION = '$requiere_activacion', ORDEN = '$orden', ESTADO = '$estado', ID_CATEGORIA = '$id_categoria' WHERE ID_PROTOCOLO = $id_protocolo";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			if (array_key_exists('MODULO_PROTOCOLOS', $request)) {

				$protocolos = $this->obtener_todos();

			}else{

				$protocolos = $this->obtener($id_categoria);

			}

			return $protocolos;
		}

		function verificar_eliminacion($id){

			/* Buscar si alguna actividad depende de esta */

				$eliminar = 0;

				$query = "	SELECT COUNT(*) AS DEPENDE
							FROM CAT_ACTIVIDADES
							WHERE ID_PROTOCOLO = $id";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$actividades_dependen = oci_fetch_array($stid);

				if ($actividades_dependen["DEPENDE"] == 0) {

					$eliminar = 1;

					/* Verificar si existen incidentes con este protocolo */

					$query = "	SELECT COUNT(*) AS DEPENDE
								FROM IN_INCIDENTES
								WHERE ID_PROTOCOLO = $id";

					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

					$incidentes_dependen = oci_fetch_array($stid);

					if ($incidentes_dependen["DEPENDE"] == 0) {

						$eliminar = 1;

					}else{

						$eliminar = 0;

					}

				}else{

					$eliminar = 0;

				}

				return $eliminar;

		}

		function probar_alerta($id){

			/* Nombre del protocolo */
			$query = "	SELECT *
						FROM CAT_PROTOCOLOS
						WHERE ID_PROTOCOLO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$protocolo = oci_fetch_array($stid);

			/* Personas involucradas en un protocolo */
			$query = "SELECT CAT_PERSONAS.ID_PERSONA, UPPER(CAT_PERSONAS.NOMBRE) AS NOMBRE, CAT_PERSONAS.TELEFONO, CAT_PERSONAS.ID_DISPOSITIVO, CAT_ROLES.NOMBRE AS ROL, CAT_MENSAJES_ROL.TEXTO_MENSAJE
            FROM CAT_PERSONAS
            INNER JOIN CAT_PERSONA_ROL
            ON CAT_PERSONAS.ID_PERSONA = CAT_PERSONA_ROL.ID_PERSONA
            INNER JOIN CAT_ROLES
            ON CAT_PERSONA_ROL.ID_ROL = CAT_ROLES.ID_ROL
            LEFT JOIN CAT_MENSAJES_ROL
            ON CAT_ROLES.ID_ROL = CAT_MENSAJES_ROL.ID_ROL
            AND CAT_MENSAJES_ROL.ID_PROTOCOLO = $id
            WHERE CAT_PERSONA_ROL.ID_ROL IN (

                SELECT CAT_ACTIVIDAD_ROL.ID_ROL
                FROM CAT_ACTIVIDADES
                INNER JOIN CAT_ACTIVIDAD_ROL
                ON CAT_ACTIVIDADES.ID_ACTIVIDAD = CAT_ACTIVIDAD_ROL.ID_ACTIVIDAD
                WHERE ID_PROTOCOLO = $id

            )
            ORDER BY CAT_PERSONAS.ID_PERSONA ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$personas [] = $data;

			}

			/* Cantidad de personas por rol */
			$query = "	SELECT COUNT(CAT_PERSONAS.ID_PERSONA) AS PERSONAS, CAT_ROLES.NOMBRE
						FROM CAT_PERSONA_ROL
						INNER JOIN CAT_PERSONAS
						ON CAT_PERSONA_ROL.ID_PERSONA = CAT_PERSONAS.ID_PERSONA
						INNER JOIN CAT_ROLES
						ON CAT_PERSONA_ROL.ID_ROL = CAT_ROLES.ID_ROL
						WHERE CAT_PERSONA_ROL.ID_ROL IN (

							SELECT CAT_ACTIVIDAD_ROL.ID_ROL
							FROM CAT_ACTIVIDADES
							INNER JOIN CAT_ACTIVIDAD_ROL
							ON CAT_ACTIVIDADES.ID_ACTIVIDAD = CAT_ACTIVIDAD_ROL.ID_ACTIVIDAD
							WHERE ID_PROTOCOLO = $id

						)
						GROUP BY CAT_ROLES.NOMBRE";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles_generales = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles_generales [] = $data;

			}

			return array($personas, $roles_generales, $protocolo);

		}

		function verificar_envio($request){

			$telefono = $request["TELEFONO"];
			$id_persona = $request["ID_PERSONA"];
			$id_protocolo = $request["ID_PROTOCOLO"];

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

			$id_protocolo = $request["ID_PROTOCOLO"];
			$id_persona = $request["ID_PERSONA"];

			$datos_envio = $this->probar_alerta($id_protocolo);

			$personas = $datos_envio[0];
			$protocolo = $datos_envio[2];

			$myfile = fopen("../../public/log.txt", "a") or die("Unable to open file!");

			$txt = "********************** ACTIVACIÓN PROTOCOLO ".$protocolo["NOMBRE"]." ***********************\n";
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
