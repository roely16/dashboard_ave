app.controller('comunidadDetalleController', ['$scope', '$http', '$timeout', '$window', '$rootScope', '$location', '$routeParams', function($scope, $http, $timeout, $window, $rootScope, $location, $routeParams){

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true
		$rootScope.NOMBRE_USUARIO = $.cookie("usuario_ave")

	}

	$scope.agregar_roles = {}
    $scope.agregar_roles.LISTA = ""
	$scope.agregar_roles.OCULTO = false

	$scope.maxSize = 5
	$scope.bigCurrentPage = 1

	/* Obtener informacion de la comunidad */
	$http({

		method: 'GET',
		url: 'routes/comunidades/detalles_comunidad.php',
		params: {id: $routeParams.id_comunidad}

	}).then(function successCallback(response){
		console.log(response.data)
		$scope.comunidad = response.data
	})

	/* Obtener integrantes de una comunidad */
	$http({

		method: 'GET',
		url: 'routes/comunidades/integrantes_comunidad.php',
		params: {id_comunidad: $routeParams.id_comunidad}

	}).then(function successCallback(response){
		$scope.integrantes = response.data
		console.log(response.data)
	})

	/* Obtener los roles de la comunidad */
	$http({

		method: 'GET',
		url: 'routes/comunidades/todos_roles_comunidad.php',
		params: {id_comunidad: $routeParams.id_comunidad}

	}).then(function successCallback(response){
		console.log(response.data)
		$scope.roles = response.data
	})

	/* Obtener las zonas de la comunidad */
	$http({

		method: 'GET',
		url: 'routes/comunidades/zonas_comunidad.php',
		params: {id_comunidad: $routeParams.id_comunidad}

	}).then(function successCallback(response){
		console.log('zonas')
		console.log(response.data)
		$scope.zonas_comunidad = response.data
	})

	$scope.modalRolesAgregar = function(){

		$scope.agregar_roles.NIVEL = ''
		$scope.agregar_roles.LISTA = ""
		$scope.agregar_roles.OCULTO = $('#toggle-one').prop('checked')

		/* Obtener los roles disponibles  */
		$http({

			method: 'GET',
			url: 'routes/roles/roles_disponibles.php',
			params: {id_comunidad: $routeParams.id_comunidad}

		}).then(function successCallback(response){

			console.log(response.data)
			$scope.roles_disponibles = response.data
			$scope.filter_data = $scope.roles_disponibles.length
			$scope.current_grid = 1
			$scope.data_limit = 5

			/* Obtener los niveles de usuario */
			$http({

				method: 'GET',
				url: 'routes/niveles/obtener_niveles.php'

			}).then(function successCallback(response){

				$scope.niveles = response.data

				$('#modalRolesAgregar').modal('show')

				$('#modalRolesAgregar').on('shown.bs.modal', function (e) {
  					$('#toggle-one').bootstrapToggle({
						on: 'Si',
						off: 'No'
					});

					$('#toggle-one').bootstrapToggle('off')
				})

			})

		})

	}

	$scope.agregarRoles = function(){

		$scope.agregar_roles.COMUNIDAD = $routeParams.id_comunidad
		$scope.agregar_roles.OCULTO = $('#toggle-one').prop('checked')
		console.log($scope.agregar_roles)

		$http({

			method: 'POST',
			url: 'routes/comunidades/agregar_roles.php',
			data: $scope.agregar_roles

		}).then(function successCallback(response){

			$scope.roles = response.data

			Swal.fire({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'El rol se ha agregado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalRolesAgregar').modal('hide')

					$scope.agregar_roles.LISTA = ""
					$scope.agregar_roles.OCULTO = false

				}

			})
		})

	}

	$scope.eliminarRol = function(id_rol){

		Swal.fire({
		  	title: '¿Está seguro??',
			type: 'warning',
			text: "Una vez eliminado no se podra recuperar!",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar'
		}).then((result) => {

		  	if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/comunidades/eliminar_rol.php',
					params: {id_rol: id_rol, id_comunidad: $routeParams.id_comunidad}

				}).then(function successCallback(response){

					$scope.roles = response.data

					console.log(response.data)

					Swal.fire({

						position: 'center',
						type: 'success',
						title: 'Excelente!',
						text: 'El rol ha sido eliminado con éxito!',
						showConfirmButton: false,
						timer: 1000

					})

				})

		  	}

		})

	}

	$scope.modalEditarRol = function(id_rol){

		$http({

			method: 'GET',
			url: 'routes/comunidades/detalle_rol.php',
			params: { id_rol: id_rol }

		}).then(function successCallback(response){

			console.log(response.data)
			$scope.editar_rol = response.data

		})

		$http({

			method: 'GET',
			url: 'routes/niveles/obtener_niveles.php'

		}).then(function successCallback(response){

			$scope.niveles = response.data

			$('#modalEditarRol').modal('show')

			$('#modalEditarRol').on('shown.bs.modal', function (e) {
				$('#toggle-two').bootstrapToggle({
					on: 'Si',
					off: 'No'
				});

				if ($scope.editar_rol.OCULTO == 0) {
					$('#toggle-two').bootstrapToggle('off')
				}else{
					$('#toggle-two').bootstrapToggle('on')
				}


			})

		})

	}

	$scope.editarRol = function(){

		$scope.editar_rol.OCULTO = $('#toggle-two').prop('checked')

		$http({

			method: 'POST',
			url: 'routes/comunidades/editar_rol.php',
			data: $scope.editar_rol

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.roles = response.data

			Swal.fire({

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

		})

	}

	$scope.modalAgregarZona = function(){

		/* Obtener zonas disponibles */
		$http({
			method: 'GET',
			url: 'routes/comunidades/obtener_zonas_disponibles.php',
			params: {id_comunidad: $routeParams.id_comunidad}
		}).then(function successCallback(response){

			console.log(response.data)
			$scope.zonas = response.data

			$('#modalAgregarZona').modal('show')

		})

	}

	$scope.agregarZona = function(){

		$scope.zona_agregar.ID_COMUNIDAD = $routeParams.id_comunidad

		$http({
			method: 'POST',
			url: 'routes/comunidades/agregar_zona.php',
			data: $scope.zona_agregar
		}).then(function successCallback(response){

			console.log(response.data)
			$scope.zonas_comunidad = response.data

			Swal.fire({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La zona se ha agregado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalAgregarZona').modal('hide')

				}

			})

		})

	}

	$scope.eliminarZona = function(id_comunidad_zona){

		Swal.fire({
			title: '¿Está seguro??',
			type: 'warning',
			text: "Una vez eliminado no se podra recuperar!",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar'
		}).then((result) => {

		  	if (result.value) {

				$http({

					method: 'GET',
					url: 'routes/comunidades/eliminar_zona.php',
					params: { id_comunidad_zona: id_comunidad_zona, id_comunidad: $routeParams.id_comunidad }

				}).then(function successCallback(response){

					console.log(response.data)
					$scope.zonas_comunidad = response.data

					Swal.fire({

						position: 'center',
						type: 'success',
						title: 'Excelente!',
						text: 'La zona ha sido eliminada con éxito!',
						showConfirmButton: false,
						timer: 1000

					})

				})

		  	}

		})

	}

	/* Paginación y busqueda para modal de roles disponibles*/
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
