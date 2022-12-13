<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/RolActividadesController.php';

	$actividades_ctrl = new RolActividadesController();

	$data = $actividades_ctrl->detalles($_REQUEST["id"]);

	echo json_encode($data);

?>
