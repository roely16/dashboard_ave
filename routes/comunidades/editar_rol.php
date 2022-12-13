<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$comunidad_ctrl = new ComunidadesController();

	$data = $comunidad_ctrl->editar_rol($_POST);

	echo json_encode($data);

?>
