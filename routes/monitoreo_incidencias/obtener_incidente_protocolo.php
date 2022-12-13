<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/MonitorIncidenciasController.php';

	$incidencias_ctrl = new MonitorIncidenciasController();

	$data = $incidencias_ctrl->obtener_incidente_protocolo($_REQUEST["id_incidente"]);

	echo json_encode($data);

?>