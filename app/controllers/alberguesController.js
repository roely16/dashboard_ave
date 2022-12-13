app.controller('alberguesController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

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

	$http({

		method: 'GET',
		url: 'routes/albergues/obtener_albergues.php'

	}).then(function successCallback(response){

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.albergues = response.data
		$scope.filter_data = $scope.albergues.length

		console.log(response.data)

	})

	$scope.modalAddAlbergue = function(){

		$scope.albergue = {}
		$scope.albergue.NOMBRE = ''
		$scope.albergue.DIRECCION = ''
		$scope.albergue.NOMBRE_CONTACTO = ''
		$scope.albergue.TELEFONO_CONTACTO = ''
		$scope.albergue.EMAIL_CONTACTO = ''
		$scope.albergue.CAPACIDAD = ''
		$scope.albergue.ZONA = ''

		$('#modalRegistrarAlbergue').modal('show')

		$('#modalRegistrarAlbergue').on('shown.bs.modal', function () {
  			$('#nuevo_nombre').trigger('focus')
		})

	}

	$scope.deleteAlbergue = function(id){

		$http({

			method: 'GET',
			url: 'routes/albergues/verificar_eliminacion.php',
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
							url: 'routes/albergues/eliminar_albergue.php',
							params: {id: id}

						}).then(function successCallback(response){

							$scope.albergues = response.data
							$scope.filter_data = $scope.albergues.length

							swal({

								position: 'center',
								type: 'success',
								title: 'Excelente!',
								text: 'El albergue se ha eliminado con éxito!',
								showConfirmButton: false,
								timer: 1000

							})

							/*
							swal("Excelente!", "El albergue se ha eliminado con éxito!", "success")

							console.log(response.data)
							*/

						})

				  	}
				})

			}

		})

	}

	$scope.addAlbergue = function(){

		$http({

			method: 'POST',
			url: 'routes/albergues/registrar_albergue.php',
			data: $scope.albergue,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.albergues = response.data
			$scope.filter_data = $scope.albergues.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El albergue se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

				  	$('#modalRegistrarAlbergue').modal('hide')

				  	$('#modalRegistrarAlbergue').on('hidden.bs.modal', '.modal', function () {

					  	$(this).removeData('bs.modal');

				  	});

				}

			})

			/*
			swal("Excelente!", "El albergue se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarAlbergue').modal('hide')

					$('#modalRegistrarAlbergue').on('hidden.bs.modal', '.modal', function () {

        				$(this).removeData('bs.modal');

      				});

				});



			console.log(response.data)
			*/

		})
	}

	$scope.detailsAlbergue = function(id){

		$http({

			method: 'GET',
			url: 'routes/albergues/detalles_albergue.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.albergue_detalles = response.data

			$('#modalDetallesAlbergue').modal('show')

		})
	}

	$scope.modalEditAlbergue = function(id){

		$http({

			method: 'GET',
			url: 'routes/albergues/detalles_albergue.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.albergue_edit = response.data

			$('#modalEditarAlbergue').modal('show')

		})
	}

	$scope.editAlbergue = function(){

		$http({

			method: 'POST',
			url: 'routes/albergues/editar_albergue.php',
			data: $scope.albergue_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.albergues = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El albergue se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

				  	$('#modalEditarAlbergue').modal('hide')

				}

			})

			/*
			swal("Excelente!", "El albergue se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarAlbergue').modal('hide')

				});

			console.log(response.data)
			*/

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
