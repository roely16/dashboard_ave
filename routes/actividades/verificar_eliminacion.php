<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ActividadesController.php';

	$actividades_ctrl = new ActividadesController();

	$data = $actividades_ctrl->verificar_eliminacion($_REQUEST["id"]);

	echo json_encode($data);

?>