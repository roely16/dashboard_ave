<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$personas_ctrl = new ComunidadesController();

	$data = $personas_ctrl->registrar_zona($_POST);

	echo json_encode($data);

?>
