<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/PersonasController.php';

	$personas_ctrl = new PersonasController();

	$data = $personas_ctrl->obtener($_REQUEST["id"]);

	echo json_encode($data);

?>