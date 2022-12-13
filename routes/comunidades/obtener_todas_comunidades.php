<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$comunidades_ctrl = new ComunidadesController();

	$data = $comunidades_ctrl->obtener_todas_comunidades();

	echo json_encode($data);

?>