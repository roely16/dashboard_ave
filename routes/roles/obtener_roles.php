<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/RolesController.php';

	$roles_ctrl = new RolesController();

	$data = $roles_ctrl->obtener();

	echo json_encode($data);

?>