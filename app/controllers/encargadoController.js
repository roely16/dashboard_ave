app.controller('encargadoController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

	$rootScope.tiempo_carga = 100000000000000

	/* Validar que el usuario este autenticado */

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

		$rootScope.logueado = false

	}else{

		$rootScope.logueado = true

	}

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	$http({

		method:'GET',
		url: 'routes/encargados/obtener_encargados.php'

	}).then(function successCallback(response){

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.encargados = response.data
		$scope.filter_data = $scope.encargados.length

	})

	$scope.modalAddEncargado = function(){

		$scope.encargado = {}

		$('#modalRegistrarEncargado').modal('show')

		$('#modalRegistrarEncargado').on('shown.bs.modal', function () {
			$('#nuevo_nombre').trigger('focus')
		})

	}

	$scope.addEncargado = function(){

		$http({

			method: 'POST',
			url: 'routes/encargados/registrar_encargado.php',
			data: $scope.encargado

		}).then(function successCallback(response){

			$scope.encargados = response.data
			$scope.filter_data = $scope.encargados.length

			swal("Excelente!", "El encargado se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarEncargado').modal('hide')


				});

		})

	}

	$scope.deleteEncargado = function(id){

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
					url: 'routes/encargados/eliminar_encargado.php',
					params: {id: id}

				}).then(function successCallback(response){

					$scope.encargados = response.data
					$scope.filter_data = $scope.encargados.length

					swal("Excelente!", "El encargado se ha eliminado con éxito!", "success")

				})

			}
		})

	}

	$scope.detailsEncargado = function(id){

		$http({

			method: 'GET',
			url: 'routes/encargados/detalles_encargado.php',
			params: {id: id}

		}).then(function successCallback(response){

			$scope.encargado_detalles = response.data

			$('#modalDetallesEncargado').modal('show')

		})

	}

	$scope.modalEditEncargado = function(id){

		$http({

			method: 'GET',
			url: 'routes/encargados/detalles_encargado.php',
			params: {id: id}

		}).then(function successCallback(response){

			$scope.encargado_edit = response.data

			$('#modalEditarEncargado').modal('show')

		})

	}

	$scope.editEncargado = function(){

		$http({

			method: 'POST',
			url: 'routes/encargados/editar_encargado.php',
			data: $scope.encargado_edit

		}).then(function successCallback(response){

			console.log(response.data);

			$scope.encargados = response.data
			$scope.filter_data = $scope.encargados.length

			swal("Excelente!", "El encargado se ha editaco con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarEncargado').modal('hide')


				});

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
