<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/MonitorIncidenciasController.php';

	$incidencias_ctrl = new MonitorIncidenciasController();

	$data = $incidencias_ctrl->obtener_incidencias();

	echo json_encode($data);

?>