app.controller('dependenciasController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

	$rootScope.tiempo_carga = 100000000000000

	/* Validar que el usuario este autenticado */

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

		$rootScope.logueado = false

	}else{

		$rootScope.logueado = true
		$rootScope.NOMBRE_USUARIO = $.cookie("usuario_ave")

	}


	$(function () {
  		$('[data-toggle="tooltip"]').tooltip()
	})

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$http({

		method:'GET',
		url: 'routes/dependencias/obtener_dependencias.php'

	}).then(function successCallback(response){

		console.log(response.data)

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.dependencias = response.data
		$scope.filter_data = $scope.dependencias.length

	})

	$scope.modalAddDependencia = function(){

		$scope.dependencia = {}
		$scope.dependencia.NOMBRE = ""
		$scope.dependencia.TELEFONO = ""
		$scope.dependencia.EMAIL = ""

		$('#modalRegistrarDependencia').modal('show')

		$('#modalRegistrarDependencia').on('shown.bs.modal', function () {
  			$('#nuevo_nombre').trigger('focus')
		})

	}

	$scope.addDependencia = function(){

		$http({

			method: 'POST',
			url: 'routes/dependencias/registrar_dependencia.php',
			data: $scope.dependencia,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.dependencias = response.data
			$scope.filter_data = $scope.dependencias.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La dependencia se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarDependencia').modal('hide')

				}

			})

			/*
			swal("Excelente!", "La dependencia se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarDependencia').modal('hide')


				});

			console.log(response.data)
			*/

		})
	}

	$scope.deleteDependencia = function(id){

		/* Verificar si existen registros que dependan de este */

		$http({

			method: 'GET',
			url: 'routes/dependencias/verificar_eliminacion.php',
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
							url: 'routes/dependencias/eliminar_dependencia.php',
							params: {id: id}

						}).then(function successCallback(response){

							$scope.dependencias = response.data
							$scope.filter_data = $scope.dependencias.length

							swal({

								position: 'center',
								type: 'success',
								title: 'Excelente!',
								text: 'La dependencia se ha eliminado con éxito!',
								showConfirmButton: false,
								timer: 1000

							})

							/*
							swal("Excelente!", "La dependencia se ha eliminado con éxito!", "success")

							console.log(response.data)
							*/

						})

				  	}
				})

			}

		})

		/*

		*/
	}

	$scope.modalEditDependencia = function(id){

		$http({

			method: 'GET',
			url: 'routes/dependencias/detalles_dependencia.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.dependencia_edit = response.data

			$('#modalEditarDependencia').modal('show')

			$('#modalEditarDependencia').on('shown.bs.modal', function () {
  				$('#editar_nombre').trigger('focus')
			})

		})
	}

	$scope.editDependencia = function(){

		$http({

			method: 'POST',
			url: 'routes/dependencias/editar_dependencia.php',
			data: $scope.dependencia_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.dependencias = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La dependencia se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarDependencia').modal('hide')

				}

			})

			/*
			swal("Excelente!", "La dependencia se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarDependencia').modal('hide')

				});

			console.log(response.data)
			*/

		})
	}

	$scope.detailsDependencia = function(id){

		$http({

			method: 'GET',
			url: 'routes/dependencias/detalles_dependencia.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.dependencia_detalles = response.data

			$('#modalDetallesDependencia').modal('show')

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
