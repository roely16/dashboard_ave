<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/NoticiasController.php';
	
	$noticias_ctrl = new NoticiasController();
	$data = $noticias_ctrl->subirArchivo($_FILES);

	echo json_encode($data);

?>