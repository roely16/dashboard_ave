<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/RolActividadesController.php';

	$actividades_ctrl = new RolActividadesController();

	$data = $actividades_ctrl->eliminar($_REQUEST["id"], $_REQUEST["id_mensaje"]);

	echo json_encode($data);

?>
