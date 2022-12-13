<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/PersonasController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$personas_ctrl = new PersonasController();

	$data = $personas_ctrl->enviar_alerta_personalizada($_POST);

	echo json_encode($data);

?>
