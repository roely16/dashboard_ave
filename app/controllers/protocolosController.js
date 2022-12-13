app.controller('protocolosController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true
		$rootScope.NOMBRE_USUARIO = $.cookie("usuario_ave")

	}

	/* Datos de categoria */
	$rootScope.tiempo_carga = 100000000000000

	if ($routeParams.id) {

		/* Protocolos en categoria */

		$http({

			method:'GET',
			url: 'routes/categorias/detalles_categoria.php',
			params: {id: $routeParams.id}

		}).then(function successCallback(response){

			$scope.categoria = response.data

			console.log(response.data)

			/* Datos de protocolos */
			$scope.maxSize = 5
			$scope.bigCurrentPage = 1

			$http({

				method:'GET',
				url: 'routes/protocolos/obtener_protocolos.php',
				params: {id: $scope.categoria.ID_CATEGORIA}

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.current_grid = 1
				$scope.data_limit = 5

				$scope.protocolos = response.data
				$scope.filter_data = $scope.protocolos.length

			})

		})

	}else{

		/* Protocolos modulo general */
		$http({

			method:'GET',
			url: 'routes/protocolos/obtener_todos_protocolos.php'

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.current_grid = 1
			$scope.data_limit = 5

			$scope.protocolos = response.data
			$scope.filter_data = $scope.protocolos.length

		})

		/* Obtener categorias */

		$http({

			method: 'GET',
			url: 'routes/categorias/obtener_categorias.php'

		}).then(function successCallback(response){

			$scope.categorias = response.data

		})

	}

	$scope.modalAddProtocolo = function(){

		$scope.protocolo = {}
		$scope.protocolo.NOMBRE = ""
		$scope.protocolo.DESCRIPCION = ""
		$scope.protocolo.REQUIERE_UBICACION = ""
		$scope.protocolo.REQUIERE_ACTIVACION = ""
		$scope.protocolo.ORDEN = ""
		$scope.protocolo.ESTADO = ""

		$('#modalRegistrarProtocolo').modal('show')

		$('#modalRegistrarProtocolo').on('shown.bs.modal', function () {

  			$('#nuevo_nombre').trigger('focus')

		})
	}

	/* Agregar protocolo */
	$scope.addProtocolo = function(){

		$scope.protocolo.ID_CATEGORIA = $scope.categoria.ID_CATEGORIA

		console.log($scope.protocolo)

		$http({

			method: 'POST',
			url: 'routes/protocolos/registrar_protocolo.php',
			data: $scope.protocolo,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.protocolos = response.data
			$scope.filter_data = $scope.protocolos.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El protocolo se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarProtocolo').modal('hide')

				}

			})

			/*
			swal("Excelente!", "El protocolo se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarProtocolo').modal('hide')


				});

			console.log(response.data)
			*/

		})
	}

	$scope.addProtocoloModulo = function(){

		$scope.protocolo.MODULO_PROTOCOLOS = ""

		$http({

			method: 'POST',
			url: 'routes/protocolos/registrar_protocolo.php',
			data: $scope.protocolo,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.protocolos = response.data
			$scope.filter_data = $scope.protocolos.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El protocolo se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarProtocolo').modal('hide')

				}

			})

			/*
			swal("Excelente!", "El protocolo se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarProtocolo').modal('hide')


				});

			console.log(response.data)
			*/

		})
	}

	/* Eliminar protocolo */
	$scope.deleteProtocolo = function(id){

		/* Verificar eliminacion */
		$http({

			method: 'GET',
			url: 'routes/protocolos/verificar_eliminacion.php',
			params: {id: id}

		}).then(function successCallback(response){

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

						if ($scope.categoria) {

							$http({

								method: 'GET',
								url: 'routes/protocolos/eliminar_protocolo.php',
								params: {id: id, id_categoria: $scope.categoria.ID_CATEGORIA}

							}).then(function successCallback(response){

								$scope.protocolos = response.data
								$scope.filter_data = $scope.protocolos.length

								//swal("Excelente!", "El protocolo se ha eliminado con éxito!", "success")

								swal({

									position: 'center',
									type: 'success',
									title: 'Excelente!',
									text: 'El protocolo se ha eliminado con éxito!',
									showConfirmButton: false,
									timer: 1000

								})

								console.log(response.data)

							})

						}else{

							$http({

								method: 'GET',
								url: 'routes/protocolos/eliminar_protocolo.php',
								params: {id: id, id_categoria: 0}

							}).then(function successCallback(response){

								$scope.protocolos = response.data
								$scope.filter_data = $scope.protocolos.length

								//swal("Excelente!", "El protocolo se ha eliminado con éxito!", "success")

								swal({

									position: 'center',
									type: 'success',
									title: 'Excelente!',
									text: 'El protocolo se ha eliminado con éxito!',
									showConfirmButton: false,
									timer: 1000

								})

								console.log(response.data)

							})

						}

				  	}
				})

			}

		})

	}

	/* Detalles protocolo */
	$scope.detailsProtocolo = function(id){

		$http({

			method: 'GET',
			url: 'routes/protocolos/detalles_protocolo.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.protocolo_detalles = response.data

			$('#modalDetallesProtocolo').modal('show')

		})
	}

	/* Editar protocolo */
	$scope.modalEditProtocolo = function(id){

		$http({

			method: 'GET',
			url: 'routes/protocolos/detalles_protocolo.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.protocolo_edit = response.data

			$('#modalEditarProtocolo').modal('show')

		})
	}

	$scope.editProtocolo = function(){

		$http({

			method: 'POST',
			url: 'routes/protocolos/editar_protocolo.php',
			data: $scope.protocolo_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.protocolos = response.data

			/*
			swal("Excelente!", "El protocolo se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarProtocolo').modal('hide')

				});

			console.log(response.data)
			*/

		})
	}

	$scope.editProtocoloModulo = function(){

		$scope.protocolo_edit.MODULO_PROTOCOLOS = ""

		$http({

			method: 'POST',
			url: 'routes/protocolos/editar_protocolo.php',
			data: $scope.protocolo_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.protocolos = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El protocolo se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarProtocolo').modal('hide')

				}

			})

			/*
			swal("Excelente!", "El protocolo se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarProtocolo').modal('hide')

				});

			console.log(response.data)
			*/

		})
	}

	$scope.alertarPersona = function(id){

		$http({

			method: 'GET',
			url: 'routes/protocolos/probar_alerta.php',
			params: {id: id}

		}).then(function successCallback(response){

			$('#modalSimularAlerta').modal('show')

			$scope.personas_alerta = response.data[0]
			$scope.roles_alerta = response.data[1]
			$scope.protocolo_modal = response.data[2]

			$scope.filter_data_personas_alertas = $scope.personas_alerta.length
			$scope.data_limit_alerta_protocolo = 5
			$scope.current_grid_alerta_protocolo = 1
			$scope.maxSize_alerta_protocolo = 5

			console.log(response.data)

		})

	}

	$scope.enviarAlertas = function(){

		$('#modalSimularAlerta').modal('hide')

		swal({
			title: '¿Está seguro?',
			text: "Se enviará notificación a " + $scope.personas_alerta.length + " dispositivos!",
			type: 'warning',
			input: 'password',
			inputPlaceholder	: 'Ingrese su número de teléfono',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Enviar Alerta',
			cancelButtonText: 'Cancelar',
			inputValidator: (value) => {

				return !value && 'Es necesario su número de teléfono!'

			}
			}).then((result) => {
				if (result.value) {

				/* Enviar clave para verificación */
				$scope.verificacion = {}
				$scope.verificacion.TELEFONO = result.value
				$scope.verificacion.ID_PERSONA = $.cookie("id_usuario_ave")
				$scope.verificacion.ID_PROTOCOLO = $scope.protocolo_modal.ID_PROTOCOLO

				console.log($scope.verificacion);

				$http({

					method: 'POST',
					url: 'routes/protocolos/verificar_envio.php',
					data: $scope.verificacion

				}).then(function successCallback(response){

					console.log(response.data);

					if (response.data[0] == 0) {

						swal({
						  type: 'error',
						  title: 'Error!',
						  text: 'Número de telefono incorrecto.',
						})

					}else{

						$http({

							method: 'POST',
							url: 'routes/protocolos/enviar_alertas.php',
							data: $scope.verificacion

						}).then(function successCallback(response){

							console.log(response.data);

						})

					}

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

	/* Paginacion y busqueda en modal de alerta protocolo */
	$scope.page_position_alerta_protocolo = function(page_number){

		$scope.current_grid_alerta_protocolo = page_number
	}

	$scope.filter_alerta_protocolo = function(){

		$timeout(function(){
			$scope.filter_data_personas_alertas = $scope.searched_alerta_protocolo.length
		}, 20)
	}

	$scope.sort_with_alerta_protocolo = function(base){

		$scope.base_alerta_protocolo = base
		$scope.reverse_alerta_protocolo = !$scope.reverse_alerta_protocolo
	}

}])
