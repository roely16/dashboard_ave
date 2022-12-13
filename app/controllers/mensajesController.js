app.controller('mensajesController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

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
		url: 'routes/mensajes/obtener_mensajes.php',
		params: {id: $routeParams.id_rol}

	}).then(function successCallback(response){

		$scope.rol = response.data[0]
		$scope.roles = response.data[1]
		$scope.protocolos = response.data[2]
		$scope.alertas = response.data[3]

		$scope.mensajes = response.data[4]
		$scope.filter_data = $scope.mensajes.length
		$scope.data_limit = 5
		$scope.maxSize = 5

		console.log(response.data);

	})

	$scope.modalAddMensaje = function(){

		$scope.mensaje = {}
		$scope.mensaje.ID_ROL = ""
		$scope.mensaje.ID_PROTOCOLO = ""
		$scope.mensaje.ID_ALERTA = ""
		$scope.mensaje.MENSAJE = ""

		$('#modalRegistrarMensaje').modal('show')



	}

	$scope.addMensaje = function(){

		$scope.mensaje.ID_ROL = $scope.rol.ID_ROL

		$http({

			method: 'POST',
			url: 'routes/mensajes/registrar_mensaje.php',
			data: $scope.mensaje

		}).then(function successCallback(response){

			$scope.mensajes = response.data[4]
			$scope.filter_data = $scope.mensajes.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El mensaje se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarMensaje').modal('hide')

				}

			})

			console.log(response.data);

		})

	}

	$scope.deleteMensaje = function(id_mensaje, id_rol){

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
					url: 'routes/mensajes/eliminar_mensaje.php',
					params: {id_mensaje: id_mensaje, id_rol: id_rol}

				}).then(function successCallback(response){

					$scope.mensajes = response.data[4]
					$scope.filter_data = $scope.mensajes.length

					swal({

						position: 'center',
						type: 'success',
						title: 'Excelente!',
						text: 'El mensaje se ha eliminado con éxito!',
						showConfirmButton: false,
						timer: 1000

					})

					console.log(response.data)

				})

			}
		})


	}

	$scope.modalEditMensaje = function(id_mensaje){

		$http({

			method: 'GET',
			url: 'routes/mensajes/detalles_mensaje.php',
			params: {id: id_mensaje}

		}).then(function successCallback(response){

			$scope.mensaje_edit = response.data

			$('#modalEditarMensaje').modal('show')

			console.log(response.data);

		})

	}

	$scope.editMensaje = function(){

		$http({

			method: 'POST',
			url: 'routes/mensajes/editar_mensaje.php',
			data: $scope.mensaje_edit

		}).then(function successCallback(response){

			$scope.mensajes = response.data[4]
			$scope.filter_data = $scope.mensajes.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El mensaje se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarMensaje').modal('hide')

				}

			})

			console.log(response.data);

		})

	}

}])
