<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/AlertasController.php';

	$alertas_ctrl = new AlertasController();

	$data = $alertas_ctrl->probar_alerta($_REQUEST["id"]);

	echo json_encode($data);

?>
