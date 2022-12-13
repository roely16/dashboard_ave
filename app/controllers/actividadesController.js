app.controller('actividadesController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true

	}

	$rootScope.tiempo_carga = 100000000000000

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	if ($routeParams.id_protocolo) {

		/* Ingreso desde protocolos */
		$http({

			method:'GET',
			url: 'routes/protocolos/detalles_protocolo.php',
			params: {id: $routeParams.id_protocolo}

		}).then(function successCallback(response){

			$scope.protocolo = response.data

			/* Datos de actividades */
			$http({

				method:'GET',
				url: 'routes/actividades/obtener_actividades.php',
				params: {id: $scope.protocolo.ID_PROTOCOLO}

			}).then(function successCallback(response){

				$scope.actividades = response.data
				$scope.filter_data = $scope.actividades.length

			})

			/* Datos de roles */
			$http({

				method:'GET',
				url: 'routes/roles/obtener_roles.php'

			}).then(function successCallback(response){

				$scope.roles = response.data

			})

		})


	}else if($routeParams.id_rol){

		/* Ingreso desde roles */
		$http({

			method:'GET',
			url: 'routes/roles/detalles_rol.php',
			params: {id: $routeParams.id_rol}

		}).then(function successCallback(response){

			$scope.rol = response.data

			console.log(response.data)

			/* Datos de actividades */
			$http({

				method:'GET',
				url: 'routes/actividades/obtener_actividades.php',
				params: {id: $scope.rol.ID_ROL}

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.actividades = response.data
				$scope.filter_data = $scope.actividades.length

			})

			/* Datos de protocolos */
			$http({

				method:'GET',
				url: 'routes/protocolos/obtener_todos_protocolos.php'

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.protocolos = response.data

			})
		})

	}


	$scope.modalAddActividad = function(){

		$scope.actividad = {}
		$scope.actividad.NOMBRE = ""
		$scope.actividad.DESCRIPCION = ""
		$scope.actividad.ESTADO = ""
		$scope.actividad.ID_PROTOCOLO = ""
		$scope.actividad.ORDEN = ""

		$('#modalRegistrarActividad').modal('show')

		$('#modalRegistrarActividad').on('shown.bs.modal', function () {

  			$('#nuevo_nombre').trigger('focus')

			$('#select_roles_nueva_actividad').selectpicker('render')
			//$('#select_roles_nueva_actividad').selectpicker('val', '');

		})
	}

	$scope.addActividad = function(){

		$scope.actividad.ID_PROTOCOLO = $scope.protocolo.ID_PROTOCOLO

		$http({

			method: 'POST',
			url: 'routes/actividades/registrar_actividad.php',
			data: $scope.actividad,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data);

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

	$scope.deleteActividad = function(id){

		$http({

			method: 'GET',
			url: 'routes/actividades/verificar_eliminacion.php',
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

						$http({

							method: 'GET',
							url: 'routes/actividades/eliminar_actividad.php',
							params: {id: id, id_protocolo: $scope.protocolo.ID_PROTOCOLO}

						}).then(function successCallback(response){

							$scope.actividades = response.data
							$scope.filter_data = $scope.actividades.length

							//swal("Excelente!", "La actividad se ha eliminado con éxito!", "success")

							swal({

								position: 'center',
								type: 'success',
								title: 'Excelente!',
								text: 'La actividad se ha eliminado con éxito!',
								showConfirmButton: false,
								timer: 1000

							})

							console.log(response.data)

						})

				  	}
				})

			}

		})

		/*

		*/
	}

	$scope.detailsActividad = function(id){

		$http({

			method: 'GET',
			url: 'routes/actividades/detalles_actividad.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.actividad_detalles = response.data

			$('#modalDetallesActividad').modal('show')

		})
	}

	$scope.modalEditActividad = function(id){

		$http({

			method: 'GET',
			url: 'routes/actividades/detalles_actividad.php',
			params: {id: id}

		}).then(function successCallback(response){

			$scope.actividad_edit = response.data

			$('#modalEditarActividad').modal('show')

			$('#modalEditarActividad').on('shown.bs.modal', function () {

				$('#select_roles_editar_actividad').selectpicker('render');

			})

		})
	}

	$scope.editActividad = function(){


		$http({

			method: 'POST',
			url: 'routes/actividades/editar_actividad.php',
			data: $scope.actividad_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

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

					$('#modalEditarActividad').modal('hide')

				}

			})

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
