<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/DependenciasController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$dependencias_ctrl = new DependenciasController();

	$data = $dependencias_ctrl->registrar($_POST);

	echo json_encode($data);

?>