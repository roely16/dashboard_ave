<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/MensajesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$mensajes_ctrl = new MensajesController();

	$data = $mensajes_ctrl->registrar($_POST);

	echo json_encode($data);

?>
