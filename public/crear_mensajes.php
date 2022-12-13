<?php

	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	$dbc = new Oracle();
	$conn = $dbc->connect();

	for ($i=0; $i < 211; $i++) {

		$query = "	INSERT INTO LOC_MENSAJE (NOMBRE, MENSAJE, ID_PROTOCOLO, ID_PERSONA, CREATED_AT, ESTADO)
				    VALUES ('Mensaje Video', 'SE HA INICIADO EL EJERCICIO DE SIMULACRO DE TERREMOTO EN BAM, ES NECESARIO QUE INICIE SU PROTOCOLO DE EVACUACIÓN.', 441, 662, SYSDATE, 'A')";

		$stid = oci_parse($conn, $query);
		oci_execute($stid);

	}

?>
