<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/DependenciasController.php';

	$dependencias_ctrl = new DependenciasController();

	$data = $dependencias_ctrl->obtener();

	echo json_encode($data);

?>