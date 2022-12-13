<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/NivelesController.php';

	$niveles_ctrl = new NivelesController();

	$data = $niveles_ctrl->obtener_niveles();

	echo json_encode($data);

?>
