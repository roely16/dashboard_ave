<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/RolesController.php';

	$roles_ctrl = new RolesController();

	$data = $roles_ctrl->verificar_eliminacion($_REQUEST["id"]);

	echo json_encode($data);

?>