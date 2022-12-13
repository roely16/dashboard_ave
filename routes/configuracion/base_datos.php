<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ConfiguracionController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$configuracion_ctrl = new ConfiguracionController();

	$data = $configuracion_ctrl->base_datos($_POST);

	echo json_encode($data);

?>
