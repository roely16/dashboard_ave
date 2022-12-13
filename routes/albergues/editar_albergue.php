<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/AlberguesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$albergues_ctrl = new AlberguesController();

	$data = $albergues_ctrl->editar($_POST);

	echo json_encode($data);

?>