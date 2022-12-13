<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$comunidades_ctrl = new ComunidadesController();

	$data = $comunidades_ctrl->verificar_eliminacion($_REQUEST["id"]);

	echo json_encode($data);

?>