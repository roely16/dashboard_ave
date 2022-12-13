app.controller('equipoTrabajoController', ['$scope', '$http', '$timeout', '$rootScope', '$location', '$routeParams', function($scope, $http, $timeout, $rootScope, $location, $routeParams){

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
		url: 'routes/encargados/detalles_encargado.php',
		params: {id: $routeParams.id_encargado}

	}).then(function successCallback(response){

		$scope.encargado = response.data

		$http({

			method: 'GET',
			url: 'routes/equipo_trabajo/obtener.php',
			params: {id: $routeParams.id_encargado}

		}).then(function successCallback(response){

			console.log(response.data);

			$scope.current_grid = 1
			$scope.data_limit = 5

			$scope.equipo_trabajo = response.data
			$scope.filter_data = $scope.equipo_trabajo.length

		})

	})

	$scope.modalAddEmpleado = function(){

		$('#modalRegistrarEmpleado').modal('show')

		$('#modalRegistrarEmpleado').on('shown.bs.modal', function () {

			$('#nuevo_nombre').trigger('focus')

		})

	}

	$scope.addEmpleado = function(){

		$scope.empleado.ID_ENCARGADO = $scope.encargado.ID_ENCARGADO

		$http({

			method: 'GET',
			url: 'routes/equipo_trabajo/registrar_empleado.php',
			data: $scope.empleado

		}).then(function successCallback(response){

		})

	}

}])
