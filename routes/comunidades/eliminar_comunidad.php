<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$comunidades_ctrl = new ComunidadesController();

	$data = $comunidades_ctrl->eliminar($_REQUEST["id"], $_REQUEST["id_comunidad"]);

	echo json_encode($data);

?>