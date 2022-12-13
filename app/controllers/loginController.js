app.controller('loginController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope){


	/*
	if ($.cookie("usuario_ave")) {

		$location.path('/home');
		$location.replace();

		console.log('se ejecuta cuando recarga')

		//$rootScope.principal_template = "views/layouts/dashboard.html"
		$rootScope.logueado = true

	}else{

		//$rootScope.principal_template = "views/layouts/login.html"
		$rootScope.logueado = false

	}
	*/

	$scope.start_login = function(){

		$http({

			method: 'POST',
			url: 'routes/login/login.php',
			data: $scope.login,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.usuario = response.data

			if (typeof $scope.usuario === "object") {

				$rootScope.logueado = true

				$.cookie("usuario_ave", $scope.usuario.USUARIO)
				$.cookie("id_usuario_ave", $scope.usuario.ID_PERSONA)

				$location.path('/home');
				$location.replace();

			}else{

				swal({
				  	type: 'error',
				  	title: 'Oops...',
				  	text: 'Usuario o contraseña incorrectos!',
				})

			}

		})
	}

	$scope.cerrar_sesion = function(){

		/* Destruir cookie */
		$.removeCookie('usuario_ave')
		$.removeCookie('id_usuario_ave')

		/* Redirigir */
		$location.path('/login');
		$location.replace();

		$rootScope.logueado = false

	}


}])
