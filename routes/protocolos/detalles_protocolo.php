<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ProtocolosController.php';

	$protocolos_ctrl = new ProtocolosController();

	$data = $protocolos_ctrl->detalles($_REQUEST["id"]);

	echo json_encode($data);

?>