<?php  

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/controllers/NoticiasController.php';

    $_POST = json_decode(file_get_contents('php://input'), true);

	$noticias_ctrl = new NoticiasController();

	$data = $noticias_ctrl->registrar($_POST);

	echo json_encode($data);

?>