<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/NoticiasController.php';

	$noticias_ctrl = new NoticiasController();

	$data = $noticias_ctrl->detalles($_REQUEST["id_noticia"]);

	echo json_encode($data);

?>
