<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/EncargadoController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$encargado_ctrl = new EncargadoController();

	$data = $encargado_ctrl->editar($_POST);

	echo json_encode($data);

?>
