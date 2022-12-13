<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ActividadesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$actividades_ctrl = new ActividadesController();

	$data = $actividades_ctrl->editar($_POST);

	echo json_encode($data);

?>