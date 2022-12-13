<?php
	/* Conexión a base de datos */
	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/database/ave/db.php';

	/* Envio de notificaciones */
	require_once $_SERVER['DOCUMENT_ROOT'] . '/apps/dashboard_ave/notifications/GCM.php';

	class PersonasController {

		function __construct(){

			$dbc = new Oracle();
			$this->conn = $dbc->connect();

		}

		function obtener($id_comunidad){

			$query = "SELECT * FROM CAT_COMUNIDADES WHERE ID_COMUNIDAD = $id_comunidad";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidad = oci_fetch_array($stid);

			$query = "	SELECT CAT_PERSONAS.*, CAT_ENCARGADOS.ID_PERSONA AS ENCARGADO
                        FROM CAT_PERSONAS
                        LEFT OUTER JOIN CAT_ENCARGADOS
                        ON CAT_PERSONAS.ID_PERSONA = CAT_ENCARGADOS.ID_PERSONA
                        LEFT OUTER JOIN CAT_EQUIPO_TRABAJO
                        ON CAT_PERSONAS.ID_PERSONA = CAT_EQUIPO_TRABAJO.ID_PERSONA
                        WHERE CAT_PERSONAS.ID_COMUNIDAD = $id_comunidad
                        AND CAT_EQUIPO_TRABAJO.ID_PERSONA IS NULL
						ORDER BY CAT_PERSONAS.ID_PERSONA DESC";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$id_persona = $data["ID_PERSONA"];

				/* Buscar si es encargado */
				$query = "SELECT COUNT(*) AS ENCARGADO FROM CAT_ENCARGADOS WHERE ID_PERSONA = $id_persona";
				$stid1 = oci_parse($this->conn, $query);

				oci_execute($stid1);
				$encargado = oci_fetch_array($stid1);

				if ($encargado["ENCARGADO"] > 0) {

					$data["ES_ENCARGADO"] = 1;

				}else{

					$data["ES_ENCARGADO"] = 0;

				}

				/* Buscar si forma parte de  un equipo */
				$query = "SELECT COUNT(*) AS EQUIPO_TRABAJO FROM CAT_EQUIPO_TRABAJO WHERE ID_PERSONA = $id_persona";
				$stid2 = oci_parse($this->conn, $query);

				oci_execute($stid2);
				$equipo_trabajo = oci_fetch_array($stid2);

				if ($equipo_trabajo["EQUIPO_TRABAJO"] > 0) {

					$data["ES_EQUIPO_TRABAJO"] = 1;

				}else{

					$data["ES_EQUIPO_TRABAJO"] = 0;

				}

				$personas [] = $data;

			}

			return array($comunidad, $personas);
		}

		function obtener_todas(){

			$query = "	SELECT CAT_PERSONAS.ID_PERSONA,
						CONCAT(CONCAT(UPPER(CAT_PERSONAS.NOMBRE), ' '), UPPER(CAT_PERSONAS.APELLIDO)) AS NOMBRE, CAT_PERSONAS.TELEFONO, UPPER(CAT_PERSONAS.EMAIL) AS EMAIL,
						CAT_DEPENDENCIAS.NOMBRE AS DEPENDENCIA, CAT_COMUNIDADES.NOMBRE AS COMUNIDAD
						FROM CAT_PERSONAS
						LEFT OUTER JOIN CAT_DEPENDENCIAS
						ON CAT_PERSONAS.ID_DEPENDENCIA = CAT_DEPENDENCIAS.ID_DEPENDENCIA
						LEFT OUTER JOIN CAT_COMUNIDADES
						ON CAT_PERSONAS.ID_COMUNIDAD = CAT_COMUNIDADES.ID_COMUNIDAD ORDER BY ID_PERSONA ASC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$id_persona = $data["ID_PERSONA"];

				/** Buscar dispostivos de cada persona */
				$query = "SELECT COUNT(*) AS DISPOSITIVOS FROM CAT_API_ACCESS WHERE ID_PERSONA = $id_persona";
				$stid_ = oci_parse($this->conn, $query);
				oci_execute($stid_);

				$dispositivos = oci_fetch_array($stid_, OCI_ASSOC);
				$data["DISPOSITIVOS"] = $dispositivos["DISPOSITIVOS"];

				$personas [] = $data;

			}

			return $personas;
		}

		function registrar($request){

			$nombre = $request["NOMBRE"];
			$telefono = $request["TELEFONO"];
			$email = $request["EMAIL"];
			$roles = $request["ID_ROL"];
			$id_dependencia = $request["ID_DEPENDENCIA"];
			$id_comunidad = $request["ID_COMUNIDAD"];
			$tipo_persona = $request["TIPO_PERSONA"];
			$id_nivel = $request["ID_NIVEL"];

			if (array_key_exists('EMAIL_ALTERNATIVO', $request)) {

				$email_alternativo = $request["EMAIL_ALTERNATIVO"];

			}else{

				$email_alternativo = "";

			}

			$query = "INSERT INTO CAT_PERSONAS (NOMBRE, TELEFONO, EMAIL, EMAIL_ALTERNO, ID_DEPENDENCIA, ID_COMUNIDAD, ID_NIVEL, ID_DISPOSITIVO) VALUES (UPPER('$nombre'), '+502$telefono', UPPER('$email'), UPPER('$email_alternativo'), '$id_dependencia', '$id_comunidad', '$id_nivel', '1')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			//Registrar los roles en CAT_PERSONA_ROL

			if (sizeof($roles) > 0) {

				//Obtener el ID de la persona registrada en CAT_PERSONAS
				$query = "SELECT MAX(ID_PERSONA) AS ID_PERSONA FROM CAT_PERSONAS";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$persona = oci_fetch_array($stid);
				$id_persona = $persona["ID_PERSONA"];

				foreach ($roles as $rol) {

					$query = "INSERT INTO CAT_PERSONA_ROL (ID_PERSONA, ID_ROL) VALUES ($id_persona, $rol)";
					$stid = oci_parse($this->conn, $query);
					oci_execute($stid);

				}

			}

			 //Si la persona es tipo 2 registrar en tabla CAT_ENCARGADOS
			 /*
			if ($tipo_persona == 2) {

				$dependencia = $request["DEPENDENCIA"];

				//Se obtiene el ultimo ID_PERSONA
				$query = "SELECT MAX(ID_PERSONA) AS ID_PERSONA FROM CAT_PERSONAS";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$persona = oci_fetch_array($stid);
				$id_persona = $persona["ID_PERSONA"];

				//Se inserta en la tabla CAT_PERSONAS
				$query = "INSERT INTO CAT_ENCARGADOS(ID_PERSONA, DEPENDENCIA) VALUES($id_persona, '$dependencia')";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

			}
			*/
			$personas = $this->obtener_todas();

			return $personas;
		}

		function eliminar($id, $id_comunidad){

			$query = "DELETE FROM CAT_PERSONAS WHERE ID_PERSONA = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			if ($id_comunidad == 0) {

				$personas = $this->obtener_todas();

			}else{

				$personas = $this->obtener($id_comunidad);

			}

			return $personas;
		}

		function detalles($id){

			$query = "SELECT ID_PERSONA, UPPER(NOMBRE) AS NOMBRE, UPPER(APELLIDO) AS APELLIDO, TELEFONO, ID_DISPOSITIVO, UPPER(PLATAFORMA) AS PLATAFORMA, UPPER(EMAIL) AS EMAIL, UPPER(EMAIL_ALTERNO) AS EMAIL_ALTERNO, TO_CHAR(FECHA_MODIFICACION, 'DD/MM/YYYY HH24:MI:SS') AS FECHA_MODIFICACION, DPI, ID_DEPENDENCIA AS ID_DEPENDENCIA, ID_COMUNIDAD, ZONA, ID_NIVEL FROM CAT_PERSONAS WHERE ID_PERSONA = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$persona = oci_fetch_array($stid, OCI_ASSOC);

			//Buscar roles de la persona
			$id_persona = $persona["ID_PERSONA"];
			$query = "SELECT ID_ROL FROM CAT_PERSONA_ROL WHERE ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$roles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$roles[] = $data["ID_ROL"];

			}

			$persona["ID_ROL"] = $roles;

			/** Buscar comunidades */

			$query = "	SELECT CAT_COMUNIDAD_PERSONAS.ID_COMUNIDAD_P AS ID,
						CAT_COMUNIDADES.ID_COMUNIDAD, CAT_COMUNIDADES.NOMBRE, CAT_ROLES.NOMBRE AS ROL
						FROM CAT_COMUNIDAD_PERSONAS
						INNER JOIN CAT_COMUNIDADES
						ON CAT_COMUNIDAD_PERSONAS.ID_COMUNIDAD = CAT_COMUNIDADES.ID_COMUNIDAD
						INNER JOIN CAT_ROLES
						ON CAT_COMUNIDAD_PERSONAS.ID_ROL = CAT_ROLES.ID_ROL
						WHERE ID_PERSONA = $id";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$comunidades = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$comunidades [] = $data;

			}

			$persona["COMUNIDADES"] = $comunidades;

			/* Buscar dispositivos */
			$query = "SELECT * FROM CAT_API_ACCESS WHERE ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$dispositivos = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$dispositivos [] = $data;

			}

			$persona["DISPOSITIVOS"] = $dispositivos;

			return $persona;
		}

		function editar($request){

			return $request;

			// $nombre = $request["NOMBRE"];
			// $telefono = $request["TELEFONO"];
			// $email = $request["EMAIL"];
			// $dpi = $request["DPI"];
			// $roles = $request["ID_ROL"];
			// $id_dependencia = $request["ID_DEPENDENCIA"];
			// $id_comunidad = $request["ID_COMUNIDAD"];
			// $id_persona = $request["ID_PERSONA"];
			// $es_encargado = $request["ES_ENCARGADO"];
			// $id_nivel = $request["ID_NIVEL"];
			//
			// if (array_key_exists('EMAIL_ALTERNO', $request)) {
			//
			// 	$email_alternativo = $request["EMAIL_ALTERNO"];
			//
			// }else{
			//
			// 	$email_alternativo = "";
			//
			// }
			//
			// $modulo_personas = false;
			//
			// if (array_key_exists('MODULO_PERSONAS', $request)) {
			//
			// 	$modulo_personas = true;
			//
			// }
			//
			// $query = "UPDATE CAT_PERSONAS SET NOMBRE = UPPER('$nombre'), TELEFONO = '$telefono', EMAIL = UPPER('$email'), EMAIL_ALTERNO = UPPER('$email_alternativo'),  DPI = '$dpi', ID_DEPENDENCIA = '$id_dependencia', ID_COMUNIDAD = '$id_comunidad', ID_NIVEL = '$id_nivel' WHERE ID_PERSONA = $id_persona";
			//
			// $stid = oci_parse($this->conn, $query);
			// oci_execute($stid);
			//
			// /* Actualizar los roles */
			// //Se eliminar los roles
			// $query = "DELETE FROM CAT_PERSONA_ROL WHERE ID_PERSONA = $id_persona";
			// $stid = oci_parse($this->conn, $query);
			// oci_execute($stid);
			//
			// //Se insertan los nuevos roles
			// foreach ($roles as $rol) {
			//
			// 	$query = "INSERT INTO CAT_PERSONA_ROL (ID_PERSONA, ID_ROL) VALUES ($id_persona, $rol)";
			// 	$stid = oci_parse($this->conn, $query);
			// 	oci_execute($stid);
			//
			// }
			//
			// //Si es encargado editar DEPENDENCIA en CAT_DEPENDENCIAS
			//
			// if ($es_encargado == 1) {
			//
			// 	$dependencia = $request["DEPENDENCIA"];
			// 	$query = "UPDATE CAT_ENCARGADOS SET DEPENDENCIA = '$dependencia' WHERE ID_PERSONA = $id_persona";
			// 	$stid = oci_parse($this->conn, $query);
			// 	oci_execute($stid);
			//
			// }
			//
			// if ($modulo_personas == true) {
			//
			// 	$personas = $this->obtener_todas();
			//
			// }else{
			//
			// 	//Validar si se edita desde la sección de equipo de trabajo
			// 	if (array_key_exists('EQUIPO_TRABAJO', $request)) {
			// 		$id_encargado = $request["ID_ENCARGADO"];
			// 		$personas = $this->obtener_equipo_trabajo($id_encargado);
			//
			// 	}else{
			//
			// 		$personas = $this->obtener($id_comunidad);
			//
			// 	}
			//
			// }
			//
			// return $personas;

		}

		function editar_modulo_personas(){
		}

		function buscar_persona($nombre){

			$query = "SELECT * FROM CAT_PERSONAS WHERE UPPER(NOMBRE) LIKE UPPER('%$nombre%')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$personas [] = $data;

			}

			return $personas;

		}

		function agregar_persona_existente($request){

			$id_persona = $request["ID_PERSONA"];
			$id_comunidad = $request["ID_COMUNIDAD"];

			$query = "UPDATE CAT_PERSONAS SET ID_COMUNIDAD = $id_comunidad WHERE ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = $this->obtener($id_comunidad);

			return $personas;

		}

		function filtrar($opcion){

			if ($opcion == 1) {

				// $query = "	SELECT CAT_PERSONAS.ID_PERSONA, CAT_PERSONAS.NOMBRE AS NOMBRE, CAT_PERSONAS.ID_DISPOSITIVO,  CAT_PERSONAS.TELEFONO,
				// 			CAT_DEPENDENCIAS.NOMBRE AS DEPENDENCIA, CAT_COMUNIDADES.NOMBRE AS COMUNIDAD
				// 			FROM CAT_PERSONAS

				// 			LEFT OUTER JOIN CAT_DEPENDENCIAS
				// 			ON CAT_PERSONAS.ID_DEPENDENCIA = CAT_DEPENDENCIAS.ID_DEPENDENCIA
				// 			LEFT OUTER JOIN CAT_COMUNIDADES
				// 			ON CAT_PERSONAS.ID_COMUNIDAD = CAT_COMUNIDADES.ID_COMUNIDAD
				// 			WHERE CAT_PERSONAS.ID_DISPOSITIVO != '1'";

				$query = "SELECT CAT_PERSONAS.ID_PERSONA, CONCAT(CONCAT(UPPER(CAT_PERSONAS.NOMBRE), ' '), UPPER(CAT_PERSONAS.APELLIDO)) AS NOMBRE, CAT_PERSONAS.TELEFONO, UPPER(CAT_PERSONAS.EMAIL) AS EMAIL,
				CAT_DEPENDENCIAS.NOMBRE AS DEPENDENCIA, COUNT(CAT_API_ACCESS.ID_PERSONA) AS DISPOSITIVOS
				FROM CAT_PERSONAS
				INNER JOIN CAT_API_ACCESS
				ON CAT_API_ACCESS.ID_PERSONA = CAT_PERSONAS.ID_PERSONA
				LEFT OUTER JOIN CAT_DEPENDENCIAS
				ON CAT_PERSONAS.ID_DEPENDENCIA = CAT_DEPENDENCIAS.ID_DEPENDENCIA
				GROUP BY CAT_PERSONAS.ID_PERSONA, CAT_PERSONAS.NOMBRE, CAT_PERSONAS.APELLIDO, CAT_PERSONAS.TELEFONO, CAT_PERSONAS.EMAIL, CAT_DEPENDENCIAS.NOMBRE";

			}else if ($opcion == 2) {

				$query = "	SELECT CAT_PERSONAS.ID_PERSONA, CONCAT(CONCAT(UPPER(CAT_PERSONAS.NOMBRE), ' '), UPPER(CAT_PERSONAS.APELLIDO)) AS NOMBRE, CAT_PERSONAS.ID_DISPOSITIVO,  CAT_PERSONAS.TELEFONO, UPPER(CAT_PERSONAS.EMAIL) AS EMAIL,
				CAT_DEPENDENCIAS.NOMBRE AS DEPENDENCIA
				FROM CAT_PERSONAS
				LEFT JOIN CAT_API_ACCESS
				ON CAT_PERSONAS.ID_PERSONA = CAT_API_ACCESS.ID_PERSONA
				LEFT OUTER JOIN CAT_DEPENDENCIAS
				ON CAT_PERSONAS.ID_DEPENDENCIA = CAT_DEPENDENCIAS.ID_DEPENDENCIA
				WHERE CAT_API_ACCESS.API_KEY IS NULL";

			}

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$personas = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				if ($opcion == 2) {

					$data["DISPOSITIVOS"] = 0;

				}

				$personas [] = $data;

			}

			return $personas;

		}

		function obtener_equipo_trabajo($id_encargado){

			$query = "	SELECT CAT_PERSONAS.*, CAT_EQUIPO_TRABAJO.ID_ENCARGADO
						FROM CAT_EQUIPO_TRABAJO
						INNER JOIN CAT_PERSONAS
						ON CAT_EQUIPO_TRABAJO.ID_PERSONA = CAT_PERSONAS.ID_PERSONA
						WHERE CAT_EQUIPO_TRABAJO.ID_ENCARGADO = $id_encargado
						ORDER BY CAT_EQUIPO_TRABAJO.ID_PERSONA DESC";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$equipo_trabajo = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$equipo_trabajo [] = $data;

			}

			return $equipo_trabajo;

		}

		function registrar_equipo_trabajo($request){

			$nombre = $request["NOMBRE"];
			$telefono = $request["TELEFONO"];
			$email = $request["EMAIL"];
			$id_comunidad = $request["ID_COMUNIDAD"];
			$zona = $request["ZONA"];
			$email_alternativo = $request["EMAIL_ALTERNATIVO"];
			$id_encargado = $request["ID_ENCARGADO"];

			$query = "INSERT INTO CAT_PERSONAS (NOMBRE, TELEFONO, EMAIL, EMAIL_ALTERNO, ID_COMUNIDAD, ZONA) VALUES ('$nombre', '$telefono', '$email', '$email_alternativo', '$id_comunidad', '$zona')";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Se obtiene el ultimo ID_PERSONA */
			$query = "SELECT MAX(ID_PERSONA) AS ID_PERSONA FROM CAT_PERSONAS";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$persona = oci_fetch_array($stid);
			$id_persona = $persona["ID_PERSONA"];

			/* Registrar en la tabla de equipo de trabajo */
			$query = "INSERT INTO CAT_EQUIPO_TRABAJO (ID_ENCARGADO, ID_PERSONA) VALUES ($id_encargado, $id_persona)";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			/* Obtener el equipo de trabajo */
			$equipo_trabajo = $this->obtener_equipo_trabajo($id_encargado);

			return $equipo_trabajo;

		}

		function eliminar_equipo_trabajo($id_encargado, $id_persona){

			$query = "DELETE FROM CAT_EQUIPO_TRABAJO WHERE ID_ENCARGADO = $id_encargado AND ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn,$query);
			oci_execute($stid);

			$equipo_trabajo = $this->obtener_equipo_trabajo($id_encargado);

			return $equipo_trabajo;

		}

		function alertar($id){

			$query = "SELECT * FROM CAT_PERSONAS WHERE ID_PERSONA = $id";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$persona = oci_fetch_array($stid);

			$id_dispositivo = $persona["ID_DISPOSITIVO"];
			$telefono = $persona["TELEFONO"];
			$id_persona = $persona["ID_PERSONA"];

			/* Buscar roles de la persona para obtener mensaje a enviar */
			$query = "	SELECT CAT_PERSONA_ROL.ID_ROL, CAT_ROLES.TEXTO_MENSAJE
						FROM CAT_PERSONA_ROL
						INNER JOIN CAT_ROLES
						ON CAT_PERSONA_ROL.ID_ROL = CAT_ROLES.ID_ROL
						WHERE CAT_PERSONA_ROL.ID_PERSONA = $id_persona";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$mensajes = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$mensajes [] = $data["TEXTO_MENSAJE"];

			}

			$notificacion = new GCM();

			/* Enviar notificación por cada uno de los roles asignados a la persona */
			foreach ($mensajes as $mensaje) {

				$result = $notificacion->send_notification($id_dispositivo, 'EMERGENCIA ACTIVADA REVISE SU APP', 'alerta', $mensaje, $telefono);

			}

			return array($persona, $mensajes, $query);

		}

		function obtener_niveles(){

			$query = "	SELECT ID_NIVEL, DESCRIPCION
						FROM CAT_NIVELES";

			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$niveles = array();

			while ($data = oci_fetch_array($stid,OCI_ASSOC)) {

				$niveles [] = $data;

			}

			return $niveles;

		}

		function enviar_alerta_personalizada($request){

			$id_persona = $request["ID_PERSONA"];
			$mensaje = $request["MENSAJE"];

			// $query = "SELECT * FROM CAT_PERSONAS WHERE ID_PERSONA = $id_persona";
			// $stid = oci_parse($this->conn, $query);
			// oci_execute($stid);

			// $persona = oci_fetch_array($stid);

			// $id_dispositivo = $persona["ID_DISPOSITIVO"];

			/** Buscar todos los dispositivos */
			$query = "SELECT * FROM CAT_API_ACCESS WHERE ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$notificacion = new GCM();

			while($data = oci_fetch_array($stid,OCI_ASSOC)){

				$id_dispositivo = $data["FCM_TOKEN"];

				$result = $notificacion->send_notification($id_dispositivo, $mensaje, 'alerta', $mensaje, '44522476');

			}

			return $request;

		}

		function actualizar_datos($request){

			$nombre = $request["NOMBRE"];
			$apellido = $request["APELLIDO"];
			$telefono = $request["TELEFONO"];
			$email = $request["EMAIL"];
			$dpi = $request["DPI"];
			//$dependencia = $request["ID_DEPENDENCIA"];
			$id_persona = $request["ID_PERSONA"];
			$id_nivel = $request["ID_NIVEL"];

			$query = "UPDATE CAT_PERSONAS SET NOMBRE = '$nombre', APELLIDO = '$apellido', TELEFONO = '$telefono', EMAIL = '$email', DPI = '$dpi', ID_NIVEL = '$id_nivel' WHERE ID_PERSONA = '$id_persona'";

			$stid = oci_parse($this->conn, $query);

			if (false === oci_execute($stid)) {

				$err = oci_error($stid);

				return $err["code"];

			}else{

				return $request;

			}

		}

		function registrar_comunidad($request){

			$id_persona = $request["ID_PERSONA"];
			$id_comunidad = $request["ID_COMUNIDAD"];
			$permisos =  $request["PERMISOS"];
			$id_rol = $request["ID_ROL"];
			$persona_invita = $request["PERSONA_REGISTRA"];

			/* Verificar que el usuario no exista ya en esa comunidad */

			$query = "SELECT * FROM CAT_COMUNIDAD_PERSONAS WHERE ID_COMUNIDAD = $id_comunidad AND ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$resultado = oci_fetch_array($stid, OCI_ASSOC);

			if ($resultado) {
				return 100;
			}

			/* Buscar ID_ROL_COM */
			$query = "SELECT ID_ROL_COM, ID_NIVEL FROM CAT_ROLES_COMUNIDAD WHERE ID_COMUNIDAD = '$id_comunidad' AND ID_ROL = '$id_rol'";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$result = oci_fetch_array($stid, OCI_ASSOC);
			$id_rol_com = $result["ID_ROL_COM"];
			$id_nivel = $result["ID_NIVEL"];

			$query = "INSERT INTO CAT_COMUNIDAD_PERSONAS (ID_COMUNIDAD, ID_PERSONA, ID_ROL, ID_ROL_COM, ID_PERSONA_INVITO) VALUES ($id_comunidad, $id_persona, $id_rol, $id_rol_com, $persona_invita)";

			$stid = oci_parse($this->conn, $query);

			if (false === oci_execute($stid)) {

				$err = oci_error($stid);

				return $err["code"];

			}else{

				/* Obtener el ultimo ID */
				$query = "	SELECT ID_COMUNIDAD_P
										FROM CAT_COMUNIDAD_PERSONAS
										WHERE ROWNUM = 1
										ORDER BY ID_COMUNIDAD_P DESC";

				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				$ultimo = oci_fetch_array($stid, OCI_ASSOC);
				$id_comunidad_registrada = $ultimo["ID_COMUNIDAD_P"];

				/* Obtener las capacidades por nivel */
				$query = "SELECT * FROM CAT_CAPACIDADES_NIVEL WHERE ID_NIVEL = $id_nivel";
				$stid = oci_parse($this->conn, $query);
				oci_execute($stid);

				while ($data = oci_fetch_array($stid, OCI_ASSOC)) {
				
					/* Registrar las capacidades */
					$id_capacidad = $data["ID_CAPACIDAD"];

					$query = "INSERT INTO CAT_PERSONA_CAPACIDAD (ID_COMUNIDAD_PERSONA, ID_CAPACIDAD, CREATED_AT) VALUES ($id_comunidad_registrada, '$id_capacidad', SYSDATE)";
					$stid2 = oci_parse($this->conn, $query);
					oci_execute($stid2);

				}

				// foreach ($permisos as $permiso) {

				// 	$query = "INSERT INTO CAT_PERSONA_CAPACIDAD (ID_COMUNIDAD_PERSONA, ID_CAPACIDAD) VALUES ($id_comunidad_registrada, '$permiso')";

				// 	$stid = oci_parse($this->conn, $query);

				// 	if (false === oci_execute($stid)) {

				// 		$err = oci_error($stid);

				// 		return $err["code"];

				// 	}

				// }

				$persona = $this->detalles($id_persona);

				return $persona;

			}

		}

		function eliminar_comunidad($id_comunidad, $id_persona){

			/* Eliminar Capacidades */
			$query = "DELETE FROM CAT_PERSONA_CAPACIDAD WHERE ID_COMUNIDAD_PERSONA = $id_comunidad";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$query = "DELETE FROM CAT_COMUNIDAD_PERSONAS WHERE ID_COMUNIDAD_P = $id_comunidad";
			$stid = oci_parse($this->conn, $query);

			if (false === oci_execute($stid)) {

				$err = oci_error($stid);

				return $err["code"];

			}else{

				$persona = $this->detalles($id_persona);

				return $persona;

			}

		}

		function obtener_dispositivos($id_persona){

			$query = "SELECT * FROM CAT_API_ACCESS WHERE ID_PERSONA = $id_persona";
			$stid = oci_parse($this->conn, $query);
			oci_execute($stid);

			$dispositivos = array();

			while ($data = oci_fetch_array($stid, OCI_ASSOC)) {

				$dispositivos [] = $data;

			}

			return $dispositivos;

		}

		function eliminar_dispositivo($id_dispositivo, $id_persona){

			return $id_dispositivo;

		}

	}

?>
