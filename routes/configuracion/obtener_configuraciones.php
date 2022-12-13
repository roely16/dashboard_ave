<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ConfiguracionController.php';

	$configuracion_ctrl = new ConfiguracionController();

	$data = $configuracion_ctrl->obtener_configuracion();

	echo json_encode($data);

?>
