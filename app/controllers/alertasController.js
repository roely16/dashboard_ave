app.controller('alertasController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

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

	/* Obtener todas las alertas */
	$http({

		method: 'GET',
		url: 'routes/alertas/obtener_alertas.php'

	}).then(function successCallback(response){

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.alertas = response.data
		$scope.filter_data = $scope.alertas.length

	})

	$scope.modalAddAlerta = function(){

		$scope.alerta = {}
		$scope.alerta.NOMBRE = ''
		$scope.alerta.DESCRIPCION = ''
		$scope.alerta.ID_ROL = ''

		/* Mensaje de espera */

		var mensaje_espera =  swal({
			title: 'Obteniendo datos',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
			    	// Read more about handling dismissals
			    	result.dismiss === swal.DismissReason.timer
			  	) {
			    	console.log('I was closed by the timer')
			  	}
		})

		$http({

			method: 'GET',
			url: 'routes/roles/obtener_roles.php'

		}).then(function successCallback(response){

			$scope.roles = response.data

			swal.close()

			$('#modalRegistrarAlerta').modal('show')

			$('#modalRegistrarAlerta').on('shown.bs.modal', function () {

				$(document).ready(function() {

					$('#nuevo_nombre_alerta').trigger('focus')

					$('#select_roles_nueva_alerta').selectpicker('render')

				});

			})

		})

	}

	$scope.addAlerta = function(){

		/* Mensaje de espera */
		swal({

			title: 'Registrando datos',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
			    	// Read more about handling dismissals
			    	result.dismiss === swal.DismissReason.timer
			  	) {

			  	}
		})

		console.log($scope.alerta);

		$http({

			method: 'POST',
			url: 'routes/alertas/registrar_alerta.php',
			data: $scope.alerta

		}).then(function successCallback(response){

			console.log(response.data);

			swal.close()

			$scope.alertas = response.data
			$scope.filter_data = $scope.alertas.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La alerta se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarAlerta').modal('hide')

				}

			})

		}, function errorCallback(response){

			swal({
				type: 'error',
				title: 'Se ha producido un error!',
				text: response.status + ' - ' +  response.statusText,
			})


		})

	}

	$scope.deleteAlerta = function(id){

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

				var mensaje_espera =  swal({
					title: 'Eliminando datos',
					text: 'Espere un momento...',
					timer: 50000,
					allowOutsideClick: false,
					onOpen: () => {
						swal.showLoading()
					}
					}).then((result) => {

						if (
					    	// Read more about handling dismissals
					    	result.dismiss === swal.DismissReason.timer
					  	) {
					    	console.log('I was closed by the timer')
					  	}
				})

				$http({

					method: 'GET',
					url: 'routes/alertas/eliminar_alerta.php',
					params: {id: id}

				}).then(function successCallback(response){

					swal.close()

					$scope.alertas = response.data
					$scope.filter_data = $scope.alertas.length

					//swal("Excelente!", "La actividad se ha eliminado con éxito!", "success")
					swal({

						position: 'center',
						type: 'success',
						title: 'Excelente!',
						text: 'La alerta se ha eliminado con éxito!',
						showConfirmButton: false,
						timer: 1000

					})


				})

			}
		})

	}

	$scope.modalEditAlerta = function(id){

		var mensaje_espera =  swal({
			title: 'Obteniendo datos',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
					// Read more about handling dismissals
					result.dismiss === swal.DismissReason.timer
				) {
					console.log('I was closed by the timer')
				}
		})

		$http({

			method: 'GET',
			url: 'routes/roles/obtener_roles.php'

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.roles = response.data

			$http({

				method: 'GET',
				url: 'routes/alertas/detalles_alerta.php',
				params: {id: id}

			}).then(function successCallback(response){

				swal.close()

				$scope.alerta_edit = response.data

				$('#modalEditarAlerta').modal('show')

				$('#modalEditarAlerta').on('shown.bs.modal', function () {

					$(document).ready(function() {

						$('#edit_nombre_alerta').trigger('focus')

						$('#select_roles_edit_alerta').selectpicker('render')
						

					});

				})

			})

		})



	}

	$scope.editAlerta = function(){

		var mensaje_espera =  swal({
			title: 'Editando datos',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
					// Read more about handling dismissals
					result.dismiss === swal.DismissReason.timer
				) {
					console.log('I was closed by the timer')
				}
		})

		$http({

			method: 'POST',
			url: 'routes/alertas/editar_alerta.php',
			data: $scope.alerta_edit

		}).then(function successCallback(response){

			swal.close()

			$scope.alertas = response.data
			$scope.filter_data = $scope.alertas.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La alerta se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarAlerta').modal('hide')

				}

			})

		})

	}

	$scope.alertarPersona = function(id){

		$http({

			method: 'GET',
			url: 'routes/alertas/probar_alerta.php',
			params: {id: id}

		}).then(function successCallback(response){

			$('#modalSimularAlerta').modal('show')

			$scope.current_grid_personas_alertas = 1
			$scope.data_limit_personas_alertas = 5

			$scope.personas_alerta = response.data[0]
			$scope.roles_alerta = response.data[1]
			$scope.alerta_modal = response.data[2]

			$scope.filter_data_personas_alertas = $scope.personas_alerta.length
			$scope.data_limit_alerta_protocolo = 5
			$scope.current_grid_alerta_protocolo = 1
			$scope.maxSize_alerta_protocolo = 5

			console.log(response.data)

		})

	}

	$scope.enviarAlertas = function(id){

		$('#modalSimularAlerta').modal('hide')

		swal({
			title: '¿Está seguro?',
			text: "Se enviará notificación a todos los dispositivos!",
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
				$scope.verificacion.ID_ALERTA = $scope.alerta_modal.ID_ALERTA

				console.log($scope.verificacion)

				$http({

					method: 'POST',
					url: 'routes/alertas/verificar_envio.php',
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
							url: 'routes/alertas/enviar_alertas.php',
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

	/* Busqueda en modal de simulacion de alertas */
	$scope.page_position_personas_alertas = function(page_number){

		$scope.current_grid_personas_alertas = page_number
	}

	$scope.filter_personas_alertas = function(){

		$timeout(function(){
			$scope.filter_data_personas_alertas = $scope.searched_personas_alertas.length
		}, 20)
	}

	$scope.sort_with_personas_alertas = function(base){

		$scope.base_personas_alertas = base
		$scope.reverse_personas_alertas = !$scope.reverse
	}

}])
