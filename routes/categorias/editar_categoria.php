<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/CategoriasController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$categorias_ctrl = new CategoriasController();

	$data = $categorias_ctrl->editar($_POST);

	echo json_encode($data);

?>