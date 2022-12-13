<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/NoticiasController.php';

	$noticias_ctrl = new NoticiasController();

	$data = $noticias_ctrl->obtener();

	echo json_encode($data);

?>
