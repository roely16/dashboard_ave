<?php  
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/AlberguesController.php';

	$albergues_ctrl = new AlberguesController();

	$data = $albergues_ctrl->obtener();

	echo json_encode($data);

?>