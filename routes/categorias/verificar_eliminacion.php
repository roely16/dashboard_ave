<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/CategoriasController.php';

	$categorias_ctrl = new CategoriasController();

	$data = $categorias_ctrl->verificar_eliminacion($_REQUEST["id"]);

	echo json_encode($data);

?>