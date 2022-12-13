<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/MensajesController.php';

	$mensajes_ctrl = new MensajesController();

	$data = $mensajes_ctrl->detalles($_REQUEST["id"]);

	echo json_encode($data);

?>
