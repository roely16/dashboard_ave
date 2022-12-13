<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/RolesController.php';

	$roles_ctrl = new RolesController();

	$data = $roles_ctrl->roles_disponibles($_REQUEST["id_comunidad"]);

	echo json_encode($data);

?>
