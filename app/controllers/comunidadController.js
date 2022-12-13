
function cargarPersonas(id){

	var id_comunidad_marcada = id

	angular.element(document.getElementById('comunidades')).scope().seleccionarLista(id);

}

function seleccionarComunidadAgregar(id){

	angular.element(document.getElementById('comunidades')).scope().seleccionarListaAgregar(id);

}

function seleccionarComunidadEditar(id){

	angular.element(document.getElementById('comunidades')).scope().seleccionarListaEditar(id);

}

app.controller('comunidadController', ['$scope', '$http', '$timeout', '$window', '$rootScope', '$location', function($scope, $http, $timeout, $window, $rootScope, $location){

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true
		$rootScope.NOMBRE_USUARIO = $.cookie("usuario_ave")

	}

	$rootScope.tiempo_carga = 100000000000000

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$scope.id_comunidad_marcada = ""

	$http({

		method:'GET',
		url: 'routes/comunidades/obtener_comunidades.php'

	}).then(function successCallback(response){

		console.log(response.data)

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.segmentos = response.data
		$scope.filter_data = $scope.segmentos.length

		$(document).ready(function(){

			$('#principal_container').jstree();

			$('#principal_container').jstree("open_all");

		});

	})

	$scope.modalAddComunidad = function(){

		$scope.segmento = {}
		$scope.segmento.NOMBRE = ""
		$scope.segmento.DESCRIPCION = ""
		$scope.segmento.DEPENDE = ""
		$scope.segmento.ZONA = ""

		$scope.id_comunidad_marcada_agregar = ''

		/* Obtener datos para jsTree */
		$http({

			method:'GET',
			url: 'routes/comunidades/obtener_comunidades.php'

		}).then(function successCallback(response){

			$scope.segmentosAdd = response.data

			console.log($scope.segmentosAdd);

			$('#modalRegistrarComunidad').modal('show')

			$('#modalRegistrarComunidad').on('shown.bs.modal', function () {

	  			$('#nuevo_nombre').trigger('focus')

				$('#toggle-one').bootstrapToggle({
					on: 'Si',
					off: 'No'
				});

				$('#toggle-one').bootstrapToggle('off')

				$(document).ready(function(){

					$('#addTree').jstree();

					$(document).ready(function(){
						$('#addTree').jstree("deselect_all");
						$('#addTree').jstree("close_all");

					})

				});

			})

		})

	}

	$scope.seleccionarLista = function(id){

		$scope.id_comunidad_marcada = id

		/*
		$scope.equipo_trabajo = 0

		$scope.comunidad_activa_id = id

		if ($scope.marcado == true) {

			$scope.marcado = false

		}else{

			$scope.marcado = true

		}
		*/

		/*
		$http({

			method:'GET',
			url: 'routes/personas/obtener_personas.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.current_grid = 1
			$scope.data_limit = 5

			$scope.segmento_personas = response.data[0]
			$scope.personas = response.data[1]

			$scope.filter_data = $scope.personas.length

		})

		$http({

			method: 'GET',
			url: 'routes/roles/obtener_roles.php'

		}).then(function successCallback(response){

			$scope.roles = response.data

		})

		$http({

			method:'GET',
			url: 'routes/dependencias/obtener_dependencias.php'

		}).then(function successCallback(response){

			$scope.dependencias = response.data

		})
		*/
	}

	$scope.seleccionarListaAgregar = function(id){

		$scope.id_comunidad_marcada_agregar = id

	}

	$scope.seleccionarListaEditar = function(id){

		$scope.id_comunidad_marcada_editar = id

	}

	$scope.addComunidad = function(){

		$scope.segmento.DEPENDE = $scope.id_comunidad_marcada_agregar
		$scope.segmento.OCULTO = $('#toggle-one').prop('checked')

		console.log($scope.segmento);

		$http({

			method: 'POST',
			url: 'routes/comunidades/registrar_comunidad.php',
			data: $scope.segmento,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.segmentos = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El segmento se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarComunidad').modal('hide')

					location.reload()

				}

			})

		})

	}

	$scope.addComunidadSegmento = function(){

		/*
		$http({

			method: 'POST',
			url: 'routes/comunidades/registrar_comunidad_segmento.php',
			data: $scope.comunidad,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.current_grid = 1
			$scope.data_limit = 5

			$scope.segmento = response.data[0]
			$scope.comunidades = response.data[1]
			$scope.segmentos = response.data[2]
			$scope.filter_data = $scope.comunidades.length

			swal("Excelente!", "La comunidad se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarComunidadSegmento').modal('hide')


				});

			console.log(response.data)

		})
		*/
	}

	$scope.deleteSegmento = function(id){

		swal({

		  	title: '¿Está seguro?',
		  	text: "Una vez eliminado no se podra recuperar!",
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonColor: '#3085d6',
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Eliminar',
		  	cancelButtonText: 'Cancelar'

		}).then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/comunidades/eliminar_segmento.php',
					params: {id: id}

				}).then(function successCallback(response){

					$scope.segmentos = response.data
					$scope.filter_data = $scope.segmentos.length

					swal("Excelente!", "El segmento se ha eliminado con éxito!", "success")

					console.log(response.data)

				})

		  	}
		})

	}

	$scope.deleteComunidad = function(id){

		swal({

		  	title: '¿Está seguro?',
		  	text: "Una vez eliminado no se podra recuperar!",
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonColor: '#3085d6',
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Eliminar',
		  	cancelButtonText: 'Cancelar'

		}).then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/comunidades/eliminar_comunidad.php',
					params: {id: id, id_comunidad: $scope.id_comunidad_marcada}

				}).then(function successCallback(response){

					$scope.comunidades = response.data[1]
					$scope.filter_data = $scope.comunidades.length

					swal("Excelente!", "La comunidad se ha eliminado con éxito!", "success")

					console.log(response.data)

				})

		  	}
		})
	}

	$scope.modalEditComunidad = function(id){

		$http({

			method: 'GET',
			url: 'routes/comunidades/detalles_comunidad.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.comunidad_edit = response.data

			$('#modalEditarComunidad').modal('show')

		})
	}

	$scope.detailsComunidad = function(id){

		$http({

			method: 'GET',
			url: 'routes/comunidades/detalles_comunidad.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.comunidad_detalles = response.data

			$('#modalDetallesComunidad').modal('show')

		})
	}

	/* Metodos de TreeView	*/
	$scope.deleteSegmento = function(id){

		if ($scope.id_comunidad_marcada == '') {

			swal({
				type: 'error',
				title: 'Error!',
				text: 'Debe de seleccionar una comunidad',
			})

		}else{

			$http({

				method: 'GET',
				url: 'routes/comunidades/verificar_eliminacion.php',
				params: {id: id}

			}).then(function successCallback(response){

				console.log(response.data)

				if (response.data == 0) {

					swal({
					  	type: 'error',
					  	title: 'No se puede eliminar!',
					  	text: 'Existen registros que dependen de este',
					})

				}else{

					swal({

					  	title: '¿Está seguro?',
					  	text: "Una vez eliminado no se podra recuperar!",
					  	type: 'warning',
					  	showCancelButton: true,
					  	confirmButtonColor: '#3085d6',
					  	cancelButtonColor: '#d33',
					  	confirmButtonText: 'Eliminar',
					  	cancelButtonText: 'Cancelar'

					}).then((result) => {

						if (result.value) {

							$http({

								method: 'GET',
								url: 'routes/comunidades/eliminar_segmento.php',
								params: {id: id}

							}).then(function successCallback(response){

								console.log(response.data)

								$scope.segmentos = response.data

								swal({

									position: 'center',
									type: 'success',
									title: 'Excelente!',
									text: 'El segmento se ha registrado con éxito!',
									showConfirmButton: false,
									timer: 1000

								}).then((result) => {

								  if (result.dismiss === swal.DismissReason.timer) {

										location.reload()

									}

								})

								/*
								swal("Excelente!", "El registro se ha eliminado con éxito!", "success")
								.then((value) => {

									//Cerrar modal
									$('#modalRegistrarComunidad').modal('hide')
									location.reload()

								});
								*/

							})

					  	}
					})

				}

			})

		}

	}

	$scope.modalEditSegmento = function(id){

		if ($scope.id_comunidad_marcada == '') {

			swal({
				type: 'error',
				title: 'Error!',
				text: 'Debe de seleccionar un segmento',
			})

		}else{

			$http({

				method: 'GET',
				url: 'routes/comunidades/detalles_comunidad.php',
				params: {id: id}

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.comunidad_edit = response.data

				/* Obtener datos para jsTree */
				$http({

					method:'GET',
					url: 'routes/comunidades/obtener_comunidades.php'

				}).then(function successCallback(response){

					$scope.segmentosEdit = response.data

					$('#modalEditarComunidad').modal('show')

					$('#modalEditarComunidad').on('shown.bs.modal', function () {

						$('#toggle-two').bootstrapToggle({
							on: 'Si',
							off: 'No'
						});

						if ($scope.comunidad_edit.CERRADA == 0)
						{
							$('#toggle-two').bootstrapToggle('off')

						}else{

							$('#toggle-two').bootstrapToggle('on')

						}

			  			//$('#nuevo_nombre').trigger('focus')

						$(document).ready(function(){

							$('#editTree').jstree();
							$('#editTree').jstree("deselect_all");
							$('#editTree').jstree("close_all");
							$('#editTree').jstree('select_node', 'li' + $scope.comunidad_edit.DEPENDE);

						});

						$scope.id_comunidad_marcada_editar = $scope.comunidad_edit.DEPENDE

					})

				})

			})
		}


	}

	$scope.editComunidad = function(){

		$scope.comunidad_edit.DEPENDE = $scope.id_comunidad_marcada_editar
		$scope.comunidad_edit.OCULTO = $('#toggle-two').prop('checked')

		console.log($scope.comunidad_edit);

		$http({

			method: 'POST',
			url: 'routes/comunidades/editar_comunidad.php',
			data: $scope.comunidad_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.segmentos = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El registro se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarComunidad').modal('hide')
					location.reload()

				}

			})

			/*
			swal("Excelente!", "El registro se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarComunidad').modal('hide')
					location.reload()

				});

			console.log(response.data)
			*/

		})

	}

	$scope.detallesComunidad = function(id){

		if ($scope.id_comunidad_marcada == '') {

			swal({
				type: 'error',
				title: 'Error!',
				text: 'Debe de seleccionar una comunidad',
			})

		}else{

			$window.location.href  = "#/comunidades/"+id+"/detalles";

		}


	}

	/* PERSONAS */

	$scope.modalAddPersona = function(){

		$scope.persona = {}
		$scope.persona.NOMBRE = ""
		$scope.persona.TELEFONO = ""
		$scope.persona.EMAIL = ""
		$scope.persona.EMAIL_ALTERNATIVO = ""
		$scope.persona.ID_ROL = ""
		$scope.persona.ID_DEPENDENCIA = ""
		$scope.persona.TIPO_PERSONA = ""

		$('#modalRegistrarPersona').modal('show')

		$('#modalRegistrarPersona').on('shown.bs.modal', function () {
  			$('#nuevo_nombre').trigger('focus')
		})
	}

	$scope.addPersona = function(){

		$scope.persona.ID_COMUNIDAD = $scope.comunidad_activa_id

		console.log($scope.persona)

		$http({

			method: 'POST',
			url: 'routes/personas/registrar_persona.php',
			data: $scope.persona,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.personas = response.data[1]
			$scope.filter_data = $scope.personas.length

			swal("Excelente!", "La persona se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarPersona').modal('hide')

				});

		})
	}

	$scope.deletePersona = function(id){

		swal({

		  	title: '¿Está seguro?',
		  	text: "Una vez eliminado no se podra recuperar!",
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonColor: '#3085d6',
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Eliminar',
		  	cancelButtonText: 'Cancelar'

		}).then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/personas/eliminar_persona.php',
					params: {id: id, id_comunidad: $scope.id_comunidad_marcada}

				}).then(function successCallback(response){

					$scope.personas = response.data[1]
					$scope.filter_data = $scope.personas.length

					swal("Excelente!", "La persona se ha eliminado con éxito!", "success")

					console.log(response.data)

				})

		  	}
		})
	}

	$scope.modalEditPersona = function(id){

		$http({

			method: 'GET',
			url: 'routes/personas/detalles_persona.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.persona_edit = response.data

			$('#modalEditarPersona').modal('show')

		})
	}

	$scope.editPersona = function(){

		/* Validar si la edición es desde la raiz del segmento o desde el equipo de trabajo */
		if ($scope.equipo_trabajo == 1) {

			$scope.persona_edit.EQUIPO_TRABAJO = 1

		}

		if ($scope.persona_edit.ID_ROL == '') {

			swal({
				type: 'error',
				title: 'Error!',
				text: 'Debe seleccionar al menos un rol',
			})

		}else{

			$http({

				method: 'POST',
				url: 'routes/personas/editar_persona.php',
				data: $scope.persona_edit,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){


				if ($scope.equipo_trabajo == 1) {

					$scope.integrantes_equipo = response.data
					$scope.filter_data_equipo_trabajo = $scope.integrantes_equipo.length

				}else{

					$scope.personas = response.data[1]
					$scope.filter_data = $scope.personas.length

				}


				swal("Excelente!", "La persona se ha editado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalEditarPersona').modal('hide')

					});

				console.log(response.data)

			})

		}

	}

	$scope.detailsPersona = function(id){

		$http({

			method: 'GET',
			url: 'routes/personas/detalles_persona.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.persona_detalles = response.data

			$('#modalDetallesPersona').modal('show')

		})
	}

	$scope.modalAddPersonaExistente = function(){

		$('#modalAddPersonaExistente').modal('show')
		$scope.personas_resultado = 0
		$('#buscar_persona').val('')

	}

	$scope.buscar_persona = function(){

		$scope.busqueda_persona.NOMBRE = $('#buscar_persona').val()

		if ($scope.busqueda_persona.NOMBRE != '') {

			$http({
				method: 'GET',
				url: 'routes/comunidades/buscar_persona.php',
				params: {nombre: $scope.busqueda_persona.NOMBRE}

			}).then(function successCallback(response){

				$scope.personas_resultado = response.data

			})

		}else{

			$scope.personas_resultado = ''

		}

	}

	$scope.addPersonaExistente = function(){

		$scope.persona_agregar = {}
		$scope.persona_agregar.ID_PERSONA = $('#persona_agregar').val()
		$scope.persona_agregar.ID_COMUNIDAD = $scope.segmento_personas.ID_COMUNIDAD

		$http({

			method: 'POST',
			url: 'routes/comunidades/agregar_persona_existente.php',
			data: $scope.persona_agregar

		}).then(function successCallback(response){

			$scope.personas = response.data[1]
			$scope.filter_data = $scope.personas.length

			swal("Excelente!", "La persona se ha agregado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalAddPersonaExistente').modal('hide')

				});

		})

	}

	/* Equipos de Trabajo */
	$scope.verEquipoTrabajo = function(id_persona){

		$scope.equipo_trabajo = 1

		$http({

			method: 'GET',
			url: 'routes/personas/detalles_persona.php',
			params: {id: id_persona}

		}).then(function successCallback(response){

			$scope.persona_encargado = response.data

			/* Obtener equipo de trabajo */
			$http({

				method: 'GET',
				url: 'routes/personas/equipo_trabajo/obtener_equipo_trabajo.php',
				params: {id: id_persona}

			}).then(function successCallback(response){

				$scope.integrantes_equipo = response.data
				$scope.filter_data_equipo_trabajo = $scope.integrantes_equipo.length

				console.log(response.data)

			})

		})

	}

	$scope.modalAddEquipoTrabajo = function(){

		$scope.persona_eqp = {}
		$scope.persona_eqp.NOMBRE = ""
		$scope.persona_eqp.TELEFONO = ""
		$scope.persona_eqp.EMAIL = ""
		$scope.persona_eqp.EMAIL_ALTERNATIVO = ""
		$scope.persona_eqp.ZONA = ""

		$('#modalRegistrarEquipoTrabajo').modal('show')

		$('#modalRegistrarEquipoTrabajo').on('shown.bs.modal', function () {

		})

	}

	$scope.addEquipoTrabajo = function(){

		$scope.persona_eqp.ID_COMUNIDAD = $scope.comunidad_activa_id
		$scope.persona_eqp.ID_ENCARGADO = $scope.persona_encargado.ID_PERSONA

		$http({

			method: 'POST',
			url: 'routes/personas/equipo_trabajo/registrar.php',
			data: $scope.persona_eqp,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.integrantes_equipo = response.data
			$scope.filter_data_equipo_trabajo = $scope.integrantes_equipo.length

			swal("Excelente!", "La persona se ha registrado al equipo de trabajo con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarEquipoTrabajo').modal('hide')

				});

			console.log(response.data)

		})

	}

	$scope.deleteEquipoTrabajo = function(id_persona, id_encargado){

		swal({

		  	title: '¿Está seguro?',
		  	text: "Una vez eliminado no se podra recuperar!",
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonColor: '#3085d6',
		  	cancelButtonColor: '#d33',
		  	confirmButtonText: 'Eliminar',
		  	cancelButtonText: 'Cancelar'

		}).then((result) => {

			if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/personas/equipo_trabajo/eliminar_equipo_trabajo.php',
					params: {id_encargado: id_encargado, id_persona: id_persona}

				}).then(function successCallback(response){

					$scope.integrantes_equipo = response.data
					$scope.filter_data_equipo_trabajo = $scope.integrantes_equipo.length

					swal("Excelente!", "La persona se ha eliminado del equipo de trabajo con éxito!", "success")

					console.log(response.data)

				})

		  	}
		})

	}

	/* Paginación y busqueda */
	$scope.page_position = function(page_number){

		$scope.current_grid = page_number
	}

	$scope.filter = function(){

		$timeout(function(){
			$scope.filter_data = $scope.searched.length
		}, 20)

	}

	$scope.sort_with = function(base){

		$scope.base = base
		$scope.reverse = !$scope.reverse

	}

	/* Paginación y busqueda en equipos de trabajo */
	$scope.page_position = function(page_number){

		$scope.current_grid = page_number
	}

	$scope.filter = function(){

		$timeout(function(){
			$scope.filter_data = $scope.searched.length
		}, 20)

	}

	$scope.sort_with = function(base){

		$scope.base = base
		$scope.reverse = !$scope.reverse

	}

}])
