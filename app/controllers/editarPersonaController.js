function seleccionarElemento(id){

	var id_comunidad_marcada = id

	angular.element(document.getElementById('modalComunidades')).scope().seleccionarComunidad(id);

}

app.controller('editarPersonaController', ['$scope', '$http', '$timeout', '$rootScope', '$location', '$routeParams', function($scope, $http, $timeout, $rootScope, $location, $routeParams){

	$('#myModal').on('hidden.bs.modal', function (e) {
  		// do something...
	})

	$scope.permisos = [
	    { text: 'Ver Integrantes',  value: 'CMIS',  selected: true },
	    { text: 'Administrar Comunidad',  value: 'ADIT', selected: false },
  	];

	// Selected fruits
  	$scope.selection = [];

	// Helper method to get selected fruits
	$scope.selectedPermisos = function selectedPermisos() {
	    return filterFilter($scope.permisos, { selected: true });
	};

	// Watch fruits for changes
	$scope.$watch('permisos|filter:{selected:true}', function (nv) {
	    $scope.selection = nv.map(function (permiso) {
	      	return permiso.value;
	    });
	}, true);

	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true

	}

  	$scope.editar_datos = false

  	/* Obtener dependencias */
	$http({

		method:'GET',
		url: 'routes/dependencias/obtener_dependencias.php'

	}).then(function successCallback(response){

		$scope.dependencias = response.data

	})

	/* Obtener niveles */

	$http({

		method: 'GET',
		url: 'routes/personas/obtener_niveles.php'

	}).then(function successCallback(response){

		$scope.niveles_usuario = response.data
		console.log($scope.niveles_usuario)

	})

	$scope.moduloEditarPersona = function(id){

		var mensaje_espera =  swal({
		title: 'Obteniendo datos',
		text: 'Espere un momento...',
		timer: 50000000000,
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
			url: 'routes/personas/detalles_persona.php',
			params: {id: $routeParams.id_persona}

		}).then(function successCallback(response){

		    $scope.persona_edit = response.data

			if (!$scope.persona_edit.ID_DEPENDENCIA) {

		        $scope.persona_edit.ID_DEPENDENCIA = ''

		    }

			if (!$scope.persona_edit.ID_NIVEL) {

				$scope.persona_edit.ID_NIVEL = ''

			}

      		console.log($scope.persona_edit)

		})
	}

	$scope.modalComunidades = function(){

		$scope.roles_comunidad = {}
		// $scope.selection = [];
		$scope.permisos = [
		    { text: 'Ver Integrantes',  value: 'CMIS',  selected: true },
		    { text: 'Administrar Comunidad',  value: 'ADIT', selected: false },
	  	];

	    /* Obtener las comunidades */
		$http({

			method:'GET',
			url: 'routes/comunidades/obtener_comunidades.php'

		}).then(function successCallback(response){

			console.log(response.data)

	        $scope.segmentos_editar = response.data

			swal.close()

			$(document).ready(function(){

				$('#modalComunidades').modal('show')

				$('#modalComunidades').on('shown.bs.modal', function () {

					$('#html2').jstree();
					$('#html2').jstree("deselect_all");
					$('#html2').jstree("close_all");

				})

			});

		})

	}

	$scope.seleccionarComunidad = function(id_comunidad){

		$scope.id_comunidad = id_comunidad
		console.log($scope.id_comunidad)

		/* Buscar roles de la comunidad */
		$http({

			method: 'GET',
			url: 'routes/comunidades/roles_comunidad.php',
			params: {id_comunidad: $scope.id_comunidad, id_nivel: $scope.persona_edit.ID_NIVEL},

		}).then(function successCallback(response){

			$scope.roles_comunidad = response.data

			console.log(response.data)

		})

	}

	$scope.actualizarDatos = function(){

		$scope.editar_datos = !$scope.editar_datos

	    $http({

	      	method: 'POST',
	      	url: 'routes/personas/actualizar_datos.php',
	      	data: $scope.persona_edit

	    }).then(function successCallback(response){

	      	console.log(response.data)

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'Los datos se han actualizado con éxito!',
				showConfirmButton: false,
				timer: 1000

			})

	    })

	  }

	$scope.agregarComunidad = function(){

	  $scope.comunidad_registro = {}
	  $scope.comunidad_registro.ID_PERSONA = $routeParams.id_persona
	  $scope.comunidad_registro.ID_COMUNIDAD = $scope.id_comunidad
		$scope.comunidad_registro.PERMISOS = $scope.selection
		$scope.comunidad_registro.ID_ROL = $scope.rol_comunidad
		$scope.comunidad_registro.PERSONA_REGISTRA = $.cookie("id_usuario_ave")

		console.log($scope.comunidad_registro)

	    $http({

	      method: 'POST',
	      url: 'routes/personas/registrar_comunidad.php',
	      data: $scope.comunidad_registro

	    }).then(function successCallback(response){

			console.log(response.data)

			if (response.data == 100) {

				console.log('No cerrar el modal y mostrar al usuario que ya existe en la comunidad')

				Swal.fire({
				  	type: 'error',
				  	title: 'Error',
				  	text: 'La persona ya se encuentra registrada en la comunidad!',
				})

			}else{

				$scope.persona_edit = response.data

				Swal.fire({

					position: 'center',
					type: 'success',
					title: 'Excelente!',
					text: 'Los datos se han actualizado con éxito!',
					showConfirmButton: false,
					timer: 1000

				}).then((result) => {

				  if (result.dismiss === swal.DismissReason.timer) {

						$('#modalComunidades').modal('hide')

					}

				})

			}

	    })

	  }

	$scope.editarDatos = function(){
		$scope.editar_datos = true
	}

	$scope.eliminarPersonaComunidad = function(id){

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
					url: 'routes/personas/eliminar_comunidad.php',
					params: { id_comunidad: id, id_persona: $routeParams.id_persona }
				}).then(function successCallback(response){

					$scope.persona_edit = response.data

					Swal.fire({

						position: 'center',
						type: 'success',
						title: 'Excelente!',
						text: 'Se ha eliminado de la comunidad con éxito!',
						showConfirmButton: false,
						timer: 1000

					})

				})

		  	}
		})

	}

	$scope.modalEditarPermisosComunidad = function(id, id_comunidad){

		$scope.comunidad_persona = {}
		$scope.comunidad_persona.id_comunidad_persona = id
		$scope.comunidad_persona.id_comunidad = id_comunidad
		$scope.comunidad_persona.id_nivel_persona = $scope.persona_edit.ID_NIVEL

		$http({
			method: 'POST',
			url: 'routes/comunidades/rol_permisos_comunidad.php',
			data: $scope.comunidad_persona
		}).then(function successCallback(response){

			$scope.comunidad_persona = response.data

			$('#modalPermisosComunidad').modal('show')

			console.log(response.data)
		})

	}

	$scope.eliminarDispositivo = function(id_dispositivo){

		$http({
			method: 'GET',
			url: 'routes/personas/eliminar_dispositivo.php',
			params: {id_dispositivo: id_dispositivo, id_persona: $routeParams.id_persona}
		}).then(function successCallback(response){
			console.log(response.data)
		})

	}

	$scope.actualizarRolPermisos = function(){

		$http({
			method: 'POST',
			url: 'routes/comunidades/actualizar_rol_permisos.php',
			data: $scope.comunidad_persona
		}).then(function successCallback(response){
			console.log(response.data)

			$scope.persona_edit = response.data

			Swal.fire({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'Los datos se han actualizado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalPermisosComunidad').modal('hide')

				}

			})

		})

		console.log($scope.comunidad_persona)

	}

}])
