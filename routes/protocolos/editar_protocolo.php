<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/ProtocolosController.php';

	$_POST = json_decode(file_get_contents('php://input'), true);

	$protocolos_ctrl = new ProtocolosController();

	$data = $protocolos_ctrl->editar($_POST);

	echo json_encode($data);

?>