app.controller('terremotoController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

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

	$scope.peticiones = function(){

		console.log('peticiones');

	}

	$scope.servicios_basicos = function(){

		console.log('servicios_basicos');

	}

	$scope.actividades = function(){

		console.log('actividades');

	}

	$scope.albergues = function(){

		console.log('albergues');

	}

	$scope.damages = function(){

		console.log('damages');

	}

}])
