<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/MensajesController.php';

	$mensajes_ctrl = new MensajesController();

	$data = $mensajes_ctrl->eliminar($_REQUEST["id_mensaje"], $_REQUEST["id_rol"]);

	echo json_encode($data);

?>
