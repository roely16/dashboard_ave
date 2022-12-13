<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ProtocolosController.php';

	$protocolos_ctrl = new ProtocolosController();

	$data = $protocolos_ctrl->eliminar($_REQUEST["id"], $_REQUEST["id_categoria"]);

	echo json_encode($data);

?>