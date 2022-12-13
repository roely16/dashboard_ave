app.controller('rolesController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

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
		url: 'routes/roles/obtener_roles.php'

	}).then(function successCallback(response){

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.roles = response.data
		$scope.filter_data = $scope.roles.length

	})

	$scope.modalAddRol = function(){

		$scope.rol = {}
		$scope.rol.NOMBRE = ""
		$scope.rol.DESCRIPCION = ""
		$scope.rol.TEXTO_MENSAJE = ""

		$('#modalRegistrarRol').modal('show')

		$('#modalRegistrarRol').on('shown.bs.modal', function () {
  			$('#nuevo_nombre').trigger('focus')
		})

	}

	$scope.addRol = function(){

		var mensaje_espera =  swal({
			title: 'Registrando rol',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
			    	// Read more about handling dismissals
			    	result.dismiss === swal.DismissReason.timer
			  	) {
			    	console.log('I was closed by the timer')
			  	}
		})

		$http({

			method: 'POST',
			url: 'routes/roles/registrar_rol.php',
			data: $scope.rol,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			swal.close()

			$scope.roles = response.data
			$scope.filter_data = $scope.roles.length

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El rol se ha registrado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRegistrarRol').modal('hide')

				}

			})

			/*
			swal("Excelente!", "El rol se ha registrado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalRegistrarRol').modal('hide')


				});
			*/

		})
	}

	$scope.deleteRol = function(id){

		/* Validar si se puede eliminar */

		$http({

			method: 'GET',
			url: 'routes/roles/validar_eliminacion.php',
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

						/* Mensaje de espera */
						var mensaje_espera =  swal({
							title: 'Eliminando rol',
							text: 'Espere un momento...',
							timer: 50000,
							allowOutsideClick: false,
							onOpen: () => {
								swal.showLoading()
							}
							}).then((result) => {

								if (
							    	// Read more about handling dismissals
							    	result.dismiss === swal.DismissReason.timer
							  	) {
							    	console.log('I was closed by the timer')
							  	}
						})

						$http({

							method: 'GET',
							url: 'routes/roles/eliminar_rol.php',
							params: {id: id}

						}).then(function successCallback(response){

							/* Cerrar la ventana de espera */
							swal.close()

							$scope.roles = response.data

							$scope.filter_data = $scope.roles.length

							//swal("Excelente!", "El rol se ha eliminado con éxito!", "success")

							swal({

								position: 'center',
								type: 'success',
								title: 'Excelente!',
								text: 'El rol se ha eliminado con éxito!',
								showConfirmButton: false,
								timer: 1000

							})

						})

				  	}
				})

			}

		})

	}

	$scope.modalEditRol = function(id){

		var mensaje_espera =  swal({
			title: 'Obteniendo información',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
			    	// Read more about handling dismissals
			    	result.dismiss === swal.DismissReason.timer
			  	) {
			    	console.log('I was closed by the timer')
			  	}
		})

		$http({

			method: 'GET',
			url: 'routes/roles/detalles_rol.php',
			params: {id: id}

		}).then(function successCallback(response){

			swal.close()

			$scope.rol_edit = response.data

			$('#modalEditarRol').modal('show')

		})
	}

	$scope.editRol = function(){

		$http({

			method: 'POST',
			url: 'routes/roles/editar_rol.php',
			data: $scope.rol_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.roles = response.data

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El rol se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarRol').modal('hide')

				}

			})

			/*
			swal("Excelente!", "El rol se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarRol').modal('hide')

				});
			*/

		})
	}

	$scope.detailsRol = function(id){

		var mensaje_espera =  swal({
			title: 'Obteniendo información',
			text: 'Espere un momento...',
			timer: 50000,
			allowOutsideClick: false,
			onOpen: () => {
				swal.showLoading()
			}
			}).then((result) => {

				if (
			    	// Read more about handling dismissals
			    	result.dismiss === swal.DismissReason.timer
			  	) {
			    	console.log('I was closed by the timer')
			  	}
		})

		$http({

			method: 'GET',
			url: 'routes/roles/detalles_rol.php',
			params: {id: id}

		}).then(function successCallback(response){

			swal.close()

			$scope.rol_detalles = response.data

			$('#modalDetallesRol').modal('show')

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
