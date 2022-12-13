<?php  
	
	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/RolesController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$roles_ctrl = new RolesController();

	$data = $roles_ctrl->editar($_POST);

	echo json_encode($data);

?>