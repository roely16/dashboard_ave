app.controller('categoriasController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

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
		url: 'routes/categorias/obtener_categorias.php'

	}).then(function successCallback(response){

		$scope.current_grid = 1
		$scope.data_limit = 5

		$scope.categorias = response.data
		$scope.filter_data = $scope.categorias.length

		console.log(response.data)

	})

	$scope.deleteCategoria = function(id){

		/* Verificar si se puede eliminar */

		$http({

			method: 'GET',
			url: 'routes/categorias/verificar_eliminacion.php',
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
				  	text: "Una vez eliminada no se podra recuperar!",
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
							url: 'routes/categorias/eliminar_categoria.php',
							params: {id: id}

						}).then(function successCallback(response){

							$scope.categorias = response.data
							$scope.filter_data = $scope.categorias.length

							/*
							swal("Excelente!", "La categoria se ha eliminado con éxito!", "success")

							console.log(response.data)
							*/

							swal({

								position: 'center',
								type: 'success',
								title: 'Excelente!',
								text: 'La categoria se ha eliminado con éxito!',
								showConfirmButton: false,
								timer: 1000

							})

						})

				  	}
				})

			}

		})

	}

	$scope.addCategoria = function(){

		var fd = new FormData()

		angular.forEach($scope.files, function(file){

			fd.append('file', file)
		})

		/* Se sube el archivo al servidor */

		$http({

			method:'POST',
			url: 'routes/categorias/subir_documento.php',
			data: fd,
			transformRequest: angular.identity,
			headers : { 'Content-Type': undefined }

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.categoria.ICONO = response.data[0]
			$scope.categoria.NOMBRE_ICONO = response.data[1]

			$http({

				method: 'POST',
				url: 'routes/categorias/registrar_categoria.php',
				data: $scope.categoria,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				$scope.categorias = response.data
				$scope.filter_data = $scope.categorias.length

				swal({

					position: 'center',
					type: 'success',
					title: 'Excelente!',
					text: 'La categoria se ha registrado con éxito!',
					showConfirmButton: false,
					timer: 1000

				}).then((result) => {

				  if (result.dismiss === swal.DismissReason.timer) {

						$('#modalRegistrarCategoria').modal('hide')

					}

				})

				/*
				swal("Excelente!", "La categoria se ha registrado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalRegistrarCategoria').modal('hide')


					});

				console.log(response.data)
				*/

			})

		})
	}

	$scope.modalAddCategoria = function(){

		$scope.categoria = {}
		$scope.categoria.NOMBRE = ''
		$scope.categoria.DESCRIPCION = ''

		$('#modalRegistrarCategoria').modal('show')

		$('#modalRegistrarCategoria').on('shown.bs.modal', function () {
  			$('#nuevo_nombre').trigger('focus')
		})

	}

	$scope.detailsCategoria = function(id){

		$http({

			method: 'GET',
			url: 'routes/categorias/detalles_categoria.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.categoria_detalles = response.data
			$scope.categoria_detalles.ICONO = "public/img/" + response.data["ICONO"]

			$('#modalDetallesCategoria').modal('show')

		})
	}

	$scope.modalEditCategoria = function(id){

		$http({

			method: 'GET',
			url: 'routes/categorias/detalles_categoria.php',
			params: {id: id}

		}).then(function successCallback(response){

			console.log(response.data)

			$scope.categoria_edit = response.data
			$scope.categoria_edit.ICONO = "public/img/" + response.data["ICONO"]

			$('#modalEditarCategoria').modal('show')

		})
	}

	$scope.editCategoria = function(){

		/* Validad si ha seleccionado un nuevo archivo */

		var archivo = $('#editar_archivo').val()

		if (archivo == '') {

			/* No selecciono archivo */

			$scope.categoria_edit.NUEVO_DIRECTORIO = ''

			$http({

				method: 'POST',
				url: 'routes/categorias/editar_categoria.php',
				data: $scope.categoria_edit,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.categorias = response.data

				swal({

					position: 'center',
					type: 'success',
					title: 'Excelente!',
					text: 'La categoria se ha editado con éxito!',
					showConfirmButton: false,
					timer: 1000

				}).then((result) => {

				  if (result.dismiss === swal.DismissReason.timer) {

						$('#modalEditarCategoria').modal('hide')

					}

				})

				/*
				swal("Excelente!", "La categoria se ha editado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalEditarCategoria').modal('hide')

					});
				*/

			})

		} else {

			/* Selecciono archivo */

			var fd = new FormData()

			angular.forEach($scope.files, function(file){

				fd.append('file', file)
			})

			$http({

				method: 'POST',
				url: 'routes/categorias/subir_documento.php',
				data: fd,
				transformRequest: angular.identity,
				headers : { 'Content-Type': undefined }

			}).then(function successCallback(response){

				console.log(response.data)

				$scope.categoria_edit.NUEVO_DIRECTORIO = response.data[0]
				$scope.categoria_edit.NUEVO_NOMBRE_ICONO = response.data[1]

				$http({

					method: 'POST',
					url: 'routes/categorias/editar_categoria.php',
					data: $scope.categoria_edit,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

				}).then(function successCallback(response){

					//console.log(response.data)

					$scope.categorias = response.data

					swal("Excelente!", "La categoria se ha editado con éxito!", "success")
					.then((value) => {

						//Cerrar modal
						$('#modalEditarCategoria').modal('hide')

					});

				})

			})

		}

		/*
		$http({

			method: 'POST',
			url: 'routes/categorias/editar_categoria.php',
			data: $scope.categoria_edit,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).then(function successCallback(response){

			$scope.albergues = response.data

			swal("Excelente!", "La categoria se ha editado con éxito!", "success")
				.then((value) => {

					//Cerrar modal
					$('#modalEditarCategoria').modal('hide')

				});

			console.log(response.data)

		})
		*/
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

	/* Subir imagenes */
	$scope.imageIsLoaded = function(e){

		$scope.$apply(function (){
			$scope.categoria.ICONO = e.target.result
		})
	}

	$scope.imageUpload = function(event){

		var files = event.target.files
		var file = files[files.length-1]
		$scope.file = file
		var reader = new FileReader()
		reader.onload = $scope.imageIsLoaded
		reader.readAsDataURL(file)

		$scope.tipo_archivo = file.type

		/*
		if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/jpg") {

			$scope.editar_documento.IS_IMAGE = 1

		} else {

			$scope.editar_documento.IS_IMAGE = 0

		}
		*/
	}

	/* Edicion */
	/* Subir imagenes */
	$scope.imageIsLoaded_ = function(e){

		$scope.$apply(function (){
			$scope.categoria_edit.ICONO = e.target.result
		})
	}

	$scope.imageUpload_ = function(event){

		var files = event.target.files
		var file = files[files.length-1]
		$scope.file = file
		var reader = new FileReader()
		reader.onload = $scope.imageIsLoaded_
		reader.readAsDataURL(file)

		$scope.tipo_archivo = file.type

	}


}])
