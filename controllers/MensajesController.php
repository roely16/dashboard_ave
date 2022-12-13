<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';
	/**
	 *
	 */
	class MensajesController{

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener($id){

			$query = "	SELECT CAT_ALERTAS.NOMBRE AS ALERTA, CAT_ROLES.NOMBRE AS ROL,
						CAT_PROTOCOLOS.NOMBRE AS PROTOCOLO, CAT_MENSAJES_ROL.TEXTO_MENSAJE, CAT_MENSAJES_ROL.ID_CORRELATIVO
						FROM CAT_MENSAJES_ROL
						LEFT JOIN CAT_ALERTAS
						ON CAT_MENSAJES_ROL.ID_ALERTA = CAT_ALERTAS.ID_ALERTA
						LEFT JOIN CAT_ROLES
						ON CAT_MENSAJES_ROL.ID_ROL = CAT_ROLES.ID_ROL
						LEFT JOIN CAT_PROTOCOLOS
						ON CAT_MENSAJES_ROL.ID_PROTOCOLO = CAT_PROTOCOLOS.ID_PROTOCOLO
						WHERE CAT_MENSAJES_ROL.ID_ROL = $id
						ORDER BY CAT_MENSAJES_ROL.ID_CORRELATIVO ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensajes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$mensajes [] = $data;

			}

			$query = "	SELECT *
						FROM CAT_ROLES WHERE ID_ROL = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$rol = oci_fetch_array($stid);

			$query = "	SELECT *
						FROM CAT_ROLES";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles [] = $data;

			}

			$query = "	SELECT *
						FROM CAT_PROTOCOLOS";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$protocolos = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$protocolos [] = $data;

			}

			$query = "	SELECT *
						FROM CAT_ALERTAS";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$alertas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$alertas [] = $data;

			}

			return array($rol, $roles, $protocolos, $alertas, $mensajes);

		}

		function registrar($request){

			$id_rol = $request["ID_ROL"];
			$id_protocolo = $request["ID_PROTOCOLO"];
			$id_alerta = $request["ID_ALERTA"];
			$mensaje = trim($request["MENSAJE"]);

			$query = "INSERT INTO CAT_MENSAJES_ROL (ID_ALERTA, ID_ROL, ID_PROTOCOLO, TEXTO_MENSAJE) VALUES('$id_alerta', '$id_rol', '$id_protocolo', '$mensaje')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensajes = $this->obtener($id_rol);

			return $mensajes;

		}

		function eliminar($id_mensaje, $id_rol){

			$query = "DELETE FROM CAT_MENSAJES_ROL WHERE ID_CORRELATIVO = $id_mensaje";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensajes = $this->obtener($id_rol);

			return $mensajes;

		}

		function detalles($id){

			$query = "	SELECT *
						FROM CAT_MENSAJES_ROL
						WHERE ID_CORRELATIVO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensaje = oci_fetch_array($stid);

			return $mensaje;

		}

		function editar($request){

			$id_alerta = $request["ID_ALERTA"];
			$id_rol = $request["ID_ROL"];
			$id_protocolo = $request["ID_PROTOCOLO"];
			$texto_mensaje = $request["TEXTO_MENSAJE"];
			$id_correlativo = $request["ID_CORRELATIVO"];

			$query = "UPDATE CAT_MENSAJES_ROL SET ID_ALERTA = '$id_alerta', ID_ROL = '$id_rol', ID_PROTOCOLO = '$id_protocolo', TEXTO_MENSAJE = '$texto_mensaje' WHERE ID_CORRELATIVO = $id_correlativo";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensajes = $this->obtener($id_rol);

			return $mensajes;

		}

		function detalles_join($id){

			$query = "	SELECT CAT_MENSAJES_ROL.ID_CORRELATIVO AS ID_MENSAJE, CAT_PROTOCOLOS.NOMBRE AS NOMBRE_PROTOCOLO, CAT_ALERTAS.NOMBRE AS NOMBRE_ALERTA
						FROM CAT_MENSAJES_ROL
						LEFT JOIN CAT_PROTOCOLOS
						ON CAT_MENSAJES_ROL.ID_PROTOCOLO = CAT_PROTOCOLOS.ID_PROTOCOLO
						LEFT JOIN CAT_ALERTAS
						ON CAT_MENSAJES_ROL.ID_ALERTA = CAT_ALERTAS.ID_ALERTA
						WHERE ID_CORRELATIVO = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensaje = oci_fetch_array($stid, OCI_ASSOC);

			return $mensaje;

		}
	}


?>
