app.controller('configuracionController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true
		$rootScope.NOMBRE_USUARIO = $.cookie("usuario_ave")

	}

	$rootScope.tiempo_carga = 100000000000000


	$http({

		method: 'GET',
		url: 'routes/configuracion/obtener_configuraciones.php'

	}).then(function successCallback(response){

		$scope.configuracion = response.data

		console.log($scope.configuracion);

	})

	$scope.cambiarBaseDatos = function(){

		console.log($scope.configuracion.BASE_DATOS);

		$http({

			method: 'POST',
			url: 'routes/configuracion/base_datos.php',
			data: $scope.configuracion

		}).then(function successCallback(response){

			console.log(response.data)

			const toast =	swal.mixin({
			  	toast: true,
			  	position: 'top-end',
			  	showConfirmButton: false,
			  	timer: 3000
			});

			toast({
		  		type: 'success',
		  		title: 'Base de datos actualizada'
			})

		})



	}

}])
