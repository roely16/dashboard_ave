<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/EncargadoController.php';

	$encargado_ctrl = new EncargadoController();

	$data = $encargado_ctrl->obtener();

	echo json_encode($data);

?>
