app.controller('actividades2Controller', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true

	}

	$rootScope.tiempo_carga = 100000000000000

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$http({

		method: 'GET',
		url: 'routes/roles/detalles_rol.php',
		params: {id: $routeParams.id_rol}

	}).then(function successCallback(response){

		$scope.rol = response.data

	})

	$http({

		method: 'GET',
		url: 'routes/mensajes/detalles_mensaje_join.php',
		params: {id: $routeParams.id_mensaje}

	}).then(function successCallback(response){

		console.log(response.data);
		$scope.mensaje = response.data

	})

	$http({

		method: 'GET',
		url: 'routes/rol_actividades/obtener.php',
		params: {id: $routeParams.id_mensaje}

	}).then(function successCallback(response){

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.actividades = response.data
		$scope.filter_data = $scope.actividades.length

	})

	$scope.modalAddActividad = function(){

		$scope.actividad = {}
		$scope.actividad.NOMBRE = ""
		$scope.actividad.DESCRIPCION = ""
		$scope.actividad.ESTADO = ""
		$scope.actividad.ORDEN = ""
		$scope.actividad.ID_TARJETA_ROL = $routeParams.id_mensaje

		$('#modalRegistrarActividad').modal('show')

	}

	$scope.addActividad = function(){

		$http({

			method: 'POST',
			url: 'routes/rol_actividades/registrar.php',
			data: $scope.actividad

		}).then(function successCallback(response){

			$scope.actividades = response.data
			$scope.filter_data = $scope.actividades.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La actividad se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarActividad').modal('hide')

				}

			})

		})

	}

	$scope.modalEditarActividad = function(id){

		$http({

			method: 'GET',
			url: 'routes/rol_actividades/detalles.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data);
			$scope.actividad_edit = response.data
			$('#modalEditarMensaje').modal('show')

		})

	}

	$scope.editActividad = function(){

		$http({

			method: 'POST',
			url: 'routes/rol_actividades/editar.php',
			data: $scope.actividad_edit

		}).then(function successCallback(response){

			$scope.actividades = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La actividad se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarMensaje').modal('hide')

				}

			})

		})

	}

	$scope.eliminarActividad = function(id){

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
					url: 'routes/rol_actividades/eliminar.php',
					params: {id: id, id_mensaje: $routeParams.id_mensaje}

				}).then(function successCallback(response){

					$scope.actividades = response.data
					$scope.filter_data = $scope.actividades.length

					swal({

						position: 'center',
						type: 'success',
						title: 'Excelente!',
						text: 'La actividad se ha eliminado con éxito!',
						showConfirmButton: false,
						timer: 1000

					})

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

}])
