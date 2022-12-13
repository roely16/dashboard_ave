<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ComunidadesController.php';

	$comunidades_ctrl = new ComunidadesController();

	$data = $comunidades_ctrl->roles_comunidad($_REQUEST["id_comunidad"], $_REQUEST["id_nivel"]);

	echo json_encode($data);

?>
