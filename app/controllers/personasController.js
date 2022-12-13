function seleccionarElemento(id){

	var id_comunidad_marcada = id

	angular.element(document.getElementById('modalRegistrarPersona')).scope().seleccionarComunidad(id);

}

function seleccionarElementoEditar(id){

	var id_comunidad_marcada = id

	angular.element(document.getElementById('modalRegistrarPersona')).scope().seleccionarComunidadEditar(id);

}

app.controller('personasController', ['$scope', '$http', '$routeParams', '$timeout', '$rootScope', '$location', function($scope, $http, $routeParams, $timeout, $rootScope, $location){

	/* Scopes permanentes */
	$scope.search = $rootScope.busqueda

	$(document).ready(function() {
	    $('.test').select2({
			width: '100% ',
		});
	});


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
	$scope.id_comunidad = ''

	$scope.options_filter1 = [

		{id: '', texto: 'Todas las personas'},
		{id: 1, texto: 'Personas con app'},
		{id: 2, texto: 'Personas sin app'}

    ];

	if ($rootScope.filtro == 1) {
		$scope.filter1 = $scope.options_filter1[1];
	}else if($rootScope.filtro == 2){
		$scope.filter1 = $scope.options_filter1[2];
	}else{
		$scope.filter1 = $scope.options_filter1[0];
	}

	//$scope.filter1 = $scope.options_filter1[0];

	/* Personas */
	// $http({
	//
	// 	method:'GET',
	// 	url: 'routes/personas/obtener_todas_personas.php'
	//
	// }).then(function successCallback(response){
	//
	// 	console.log(response.data);
	//
	// 	$scope.current_grid = 1
	// 	$scope.data_limit = 5
	//
	// 	$scope.personas = response.data
	// 	$scope.filter_data = $scope.personas.length
	//
	// })

	/* Obtener roles */
	$http({

		method: 'GET',
		url: 'routes/roles/obtener_roles.php'

	}).then(function successCallback(response){

		$scope.roles = response.data

	})

	$scope.modalAddPersona = function(){

		var mensaje_espera =  swal({
			title: 'Obteniendo datos',
			text: 'Espere un momento...',
			timer: 5000000,
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

		$scope.persona = {}
		$scope.persona.NOMBRE = ""
		$scope.persona.TELEFONO = ""
		$scope.persona.EMAIL = ""
		$scope.persona.EMAIL_ALTERNATIVO = ""
		$scope.persona.ID_ROL = ""
		$scope.persona.ID_DEPENDENCIA = ""
		$scope.persona.ID_COMUNIDAD = ""
		$scope.persona.ID_NIVEL = 5


		$http({

			method:'GET',
			url: 'routes/comunidades/obtener_comunidades.php'

		}).then(function successCallback(response){

			swal.close()

			$scope.segmentos = response.data

			/* Obtener niveles */

			$http({

				method: 'GET',
				url: 'routes/personas/obtener_niveles.php'

			}).then(function successCallback(response){

				$scope.niveles_usuario = response.data

			})

			$(document).ready(function(){

				$('#modalRegistrarPersona').modal('show')

				$('#modalRegistrarPersona').on('shown.bs.modal', function () {

					$('#html1').jstree();

					$('.bootstrap-select').selectpicker('render')
					//$('#select_dependencias_agregar_persona').selectpicker('render')

				})

			});

		})

	}

	$scope.addPersona = function(){

		/* Verificar que se haya seleccionado una comunidad */

			$scope.persona.ID_COMUNIDAD = $scope.id_comunidad

			var mensaje_espera =  swal({
				title: 'Registrando datos',
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

				method: 'POST',
				url: 'routes/personas/registrar_persona.php',
				data: $scope.persona,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				console.log(response.data);

				swal.close()

				$scope.personas = response.data
				$scope.filter_data = $scope.personas.length

				swal({

					position: 'center',
					type: 'success',
					title: 'Excelente!',
					text: 'La persona se ha registrado con éxito!',
					showConfirmButton: false,
					timer: 1000

				}).then((result) => {

					console.log(result);

				  if (result.dismiss === swal.DismissReason.timer) {

						$('#modalRegistrarPersona').modal('hide')

					}

				})

			})

	}

	$scope.deletePersona = function(id){

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
					url: 'routes/personas/eliminar_persona.php',
					params: {id: id, id_comunidad: 0}

				}).then(function successCallback(response){

					console.log(response.data)

					// $scope.personas = response.data
					// $scope.filter_data = $scope.personas.length

					// //swal("Excelente!", "La persona se ha eliminado con éxito!", "success")

					// swal({

					// 	position: 'center',
					// 	type: 'success',
					// 	title: 'Excelente!',
					// 	text: 'La persona se ha eliminado con éxito!',
					// 	showConfirmButton: false,
					// 	timer: 1000

					// })

				})

		  	}
		})
	}

	$scope.editPersona = function(){

		$scope.persona_edit.MODULO_PERSONAS = ""
		$scope.persona_edit.ID_COMUNIDAD = $scope.id_comunidad_editar

		var mensaje_espera =  swal({
			title: 'Registrando datos',
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

			method: 'POST',
			url: 'routes/personas/editar_persona.php',
			data: $scope.persona_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			console.log(response.data);

			$scope.personas = response.data

			swal.close()

			/*
			swal("Excelente!", "La persona se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarPersona').modal('hide')

				});
			*/

			swal({

				position: 'center',
				type: 'success',
				title: 'Excelente!',
				text: 'La persona se ha editado con éxito!',
				showConfirmButton: false,
				timer: 1000

			}).then((result) => {

			  if (result.dismiss === swal.DismissReason.timer) {

					$('#modalEditarPersona').modal('hide')

				}

			})

		})
	}

	$scope.seleccionarComunidad = function(id_comunidad){

		$scope.id_comunidad = id_comunidad

	}

	$scope.seleccionarComunidadEditar = function(id_comunidad){

		$scope.id_comunidad_editar = id_comunidad

	}

	$scope.alertarPersona = function(id_persona){

		swal({
			title: '¿Está seguro?',
			text: "Se enviará notificación a todos los dispositivos!",
			type: 'warning',
			input: 'textarea',
			inputPlaceholder	: 'Ingrese el mensaje a enviar',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Enviar Alerta',
			cancelButtonText: 'Cancelar',
			inputValidator: (value) => {

				return !value && 'Es necesario ingresar el mensaje a enviar!'

			}
			}).then((result) => {


				if (result.value) {

					$scope.alerta_personalizada = {}
					$scope.alerta_personalizada.MENSAJE = result.value
					$scope.alerta_personalizada.ID_PERSONA = id_persona

					$http({

						method: 'POST',
						url: 'routes/personas/enviar_alerta_personalizada.php',
						data: $scope.alerta_personalizada

					}).then(function successCallback(response){

						console.log(response.data);
						swal.close()

					})

					const toast = swal.mixin({
						toast: true,
					  	position: 'top-end',
					  	showConfirmButton: false,
					  	timer: 3000
					});

					toast({
					  	type: 'success',
					  	title: 'Alerta enviada exitosamente'
					})


				}



			})


		// $http({
		//
		// 	method: 'GET',
		// 	url: 'routes/personas/obtener_mensaje_alerta.php',
		// 	params: { id: id_persona }
		//
		// }).then(function successCallback(response){
		//
		// 	console.log(response.data);
		//
		// })
		//
		// swal({
		//   	title: '¿Está seguro?',
		//   	text: "Se enviará notificación al dispositivo de la persona!",
		//   	type: 'warning',
		//   	showCancelButton: true,
		//   	confirmButtonColor: '#3085d6',
		//   	cancelButtonColor: '#d33',
		//   	confirmButtonText: 'Enviar Alerta',
		// 	cancelButtonText: 'Cancelar',
		// }).then((result) => {
		//
		//   	if (result.value) {
		//
		// 	    // swal(
		// 		//
		// 	    //   'Deleted!',
		// 	    //   'Your file has been deleted.',
		// 	    //   'success'
		// 		//
		// 	    // )
		//
		//   	}
		//
		// })

		// swal({
		// 	title: 'Enviando alerta',
		// 	text: 'Espere un momento...',
		// 	timer: 5000000,
		// 	allowOutsideClick: false,
		// 	onOpen: () => {
		// 		swal.showLoading()
		// 	}
		// 	}).then((result) => {
		//
		// 		if (
		// 			// Read more about handling dismissals
		// 			result.dismiss === swal.DismissReason.timer
		// 		) {
		// 			console.log('I was closed by the timer')
		// 		}
		// })
		//
		// $http({
		//
		// 	method: 'GET',
		// 	url: 'routes/personas/alertar_persona.php',
		// 	params: {id: id_persona}
		//
		// }).then(function successCallback(response){
		//
		// 	swal.close()
		//
		// 	swal(
		// 	  'Alerta Enviada!',
		// 	  '',
		// 	  'info'
		// 	)
		//
		// })


	}

	$scope.restorePassword = function(id_persona){



	}

	/* Paginación y busqueda */
	$scope.page_position = function(){

		$rootScope.pagina = $scope.current_grid

	}

	$scope.filter = function(){

		$timeout(function(){
			$scope.filter_data = $scope.searched.length
			$rootScope.busqueda = $scope.search
			$rootScope.datos_filtrados = $scope.filter_data
			console.log($scope.filter_data)
		}, 20)

	}

	$scope.sort_with = function(base){

		$scope.base = base
		$scope.reverse = !$scope.reverse

	}

	$scope.filtro_instalacion = function(){

		if ($scope.filter1.id == 1) {

			$scope.opcion = 1
			$rootScope.filtro = 1

		}else if ($scope.filter1.id == 2) {

			$scope.opcion = 2
			$rootScope.filtro = 2

		}else{

			$scope.opcion = 0
			$rootScope.filtro = 0

		}

		if ($scope.opcion > 0) {

			$http({
				method: 'GET',
				url: 'routes/personas/filtrar_personas.php',
				params: {opcion: $scope.opcion}
			}).then(function successCallback(response){

				$scope.personas = response.data

				if ($rootScope.datos_filtrados) {
					$scope.filter_data = $rootScope.datos_filtrados
				}else{
					$scope.filter_data = $scope.personas.length
				}

				$scope.current_grid = $rootScope.pagina
				$scope.data_limit = 5

			})

		}else{
			$http({

				method:'GET',
				url: 'routes/personas/obtener_todas_personas.php'

			}).then(function successCallback(response){

				$scope.personas = response.data

				if ($rootScope.datos_filtrados) {
					$scope.filter_data = $rootScope.datos_filtrados
				}else{
					$scope.filter_data = $scope.personas.length
				}

				$scope.current_grid = $rootScope.pagina
				$scope.data_limit = 5

			})
		}

	}

}])
