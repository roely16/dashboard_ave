<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/EquipoTrabajoController.php';

	$equipo_trabajo_ctrl = new EquipoTrabajoController();

	$data = $equipo_trabajo_ctrl->obtener($_REQUEST["id"]);

	echo json_encode($data);

?>
