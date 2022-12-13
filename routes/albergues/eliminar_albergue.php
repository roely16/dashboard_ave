<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/AlberguesController.php';

	$albergues_ctrl = new AlberguesController();

	$data = $albergues_ctrl->eliminar($_REQUEST["id"]);

	echo json_encode($data);

?>