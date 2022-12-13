<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/AlertasController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$alertas_ctrl = new AlertasController();

	$data = $alertas_ctrl->verificar_envio($_POST);

	echo json_encode($data);

?>
