<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/PersonasController.php';

	$personas_ctrl = new PersonasController();

	$data = $personas_ctrl->eliminar_dispositivo($_REQUEST["id_dispositivo"], $_REQUEST["id_persona"]);

	echo json_encode($data);

?>
