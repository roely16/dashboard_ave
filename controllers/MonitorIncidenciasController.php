<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	/**
	* 
	*/
	class MonitorIncidenciasController {

		protected $conn;
		
		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();	
		}

		function obtener_incidencias(){

			$query = "	SELECT IN_INCIDENTES.ID_INCIDENTE, CAT_PROTOCOLOS.NOMBRE AS NOMBRE 
						FROM IN_INCIDENTES 
						INNER JOIN CAT_PROTOCOLOS
						ON IN_INCIDENTES.ID_PROTOCOLO = CAT_PROTOCOLOS.ID_PROTOCOLO
						ORDER BY IN_INCIDENTES.ID_PROTOCOLO DESC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$incidentes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
				
				$data["ID_GRAFICA"] = "chart-area" . $data["ID_INCIDENTE"];

				$id_incidente = $data["ID_INCIDENTE"];

				/* Obtener total de actividades */
				$query = "	SELECT COUNT(*) AS TOTAL_ACTIVIDADES 
							FROM IN_ACTIVIDADES
							WHERE ID_INCIDENTE = $id_incidente";

				$stid_ = oci_parse($this->conn, $query);
				oci_execute($stid_);

				$total_actividades = oci_fetch_array($stid_);

				/* Total de actividades finalizadas */
				$query = "	SELECT COUNT(*) AS TOTAL_ACTIVIDADES_FINALIZADAS 
							FROM IN_ACTIVIDADES
							WHERE ID_INCIDENTE = $id_incidente AND ESTADO = 'F'";

				$stid_ = oci_parse($this->conn, $query);
				oci_execute($stid_);

				$total_actividades_finalizadas = oci_fetch_array($stid_);

				if ($total_actividades_finalizadas["TOTAL_ACTIVIDADES_FINALIZADAS"] != 0) {
					
					$porcentaje_finalizado = round(($total_actividades_finalizadas["TOTAL_ACTIVIDADES_FINALIZADAS"] / $total_actividades["TOTAL_ACTIVIDADES"]) * 100);

				}else{

					$porcentaje_finalizado = 0;
				}

				$porcentaje_restante = 100 - $porcentaje_finalizado;

				$datos_grafica = array($porcentaje_restante, $porcentaje_finalizado);

				$data["DATOS_GRAFICA"] = $datos_grafica;

				$incidentes [] = $data;

			}

			return $incidentes;

		}

		function obtener_incidente_protocolo($id){

			$query = "	SELECT CAT_PROTOCOLOS.NOMBRE, TO_CHAR(IN_INCIDENTES.FECHA_INI, 'DD/MM/YYYY') AS FECHA_INI, 
						TO_CHAR(IN_INCIDENTES.FECHA_FIN, 'DD/MM/YYYY') AS FECHA_FIN
						FROM IN_INCIDENTES
						INNER JOIN CAT_PROTOCOLOS
						ON IN_INCIDENTES.ID_PROTOCOLO = CAT_PROTOCOLOS.ID_PROTOCOLO
						WHERE ID_INCIDENTE = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$incidente = oci_fetch_array($stid);

			$query = "	SELECT CAT_ACTIVIDADES.ORDEN, CAT_ACTIVIDADES.NOMBRE, IN_ACTIVIDADES.ESTADO 
						FROM IN_ACTIVIDADES
						INNER JOIN CAT_ACTIVIDADES
						ON IN_ACTIVIDADES.ID_ACTIVIDAD = CAT_ACTIVIDADES.ID_ACTIVIDAD
						WHERE ID_INCIDENTE = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$actividades = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {
				
				$actividades [] = $data;

			}

			/* Datos para grafica */

			/* Total de actividades */
			$query = "	SELECT COUNT(*) AS TOTAL_ACTIVIDADES 
						FROM IN_ACTIVIDADES
						WHERE ID_INCIDENTE = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$total_actividades = oci_fetch_array($stid);

			/* Total de actividades finalizadas */
			$query = "	SELECT COUNT(*) AS TOTAL_ACTIVIDADES_FINALIZADAS 
						FROM IN_ACTIVIDADES
						WHERE ID_INCIDENTE = $id AND ESTADO = 'F'";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$total_actividades_finalizadas = oci_fetch_array($stid);

			if ($total_actividades_finalizadas["TOTAL_ACTIVIDADES_FINALIZADAS"] != 0) {
				
				$porcentaje_finalizado = round(($total_actividades_finalizadas["TOTAL_ACTIVIDADES_FINALIZADAS"] / $total_actividades["TOTAL_ACTIVIDADES"]) * 100);

			}else{

				$porcentaje_finalizado = 0;
			}

			$porcentaje_restante = 100 - $porcentaje_finalizado;

			return array($incidente, $actividades, $porcentaje_finalizado, $porcentaje_restante);

		}
	}

?>