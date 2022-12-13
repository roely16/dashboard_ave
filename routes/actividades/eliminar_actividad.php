<?php 

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ActividadesController.php';

	$actividades_ctrl = new ActividadesController();

	$data = $actividades_ctrl->eliminar($_REQUEST["id"], $_REQUEST["id_protocolo"]);

	echo json_encode($data);

?>