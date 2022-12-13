<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$comunidades_ctrl = new ComunidadesController();

	$data = $comunidades_ctrl->registrarComunidad($_POST);

	echo json_encode($data);

?>