app.controller('noticiasController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location){

    if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true
		$rootScope.NOMBRE_USUARIO = $.cookie("usuario_ave")

    }

    $scope.nombreArchivoPortada = "Seleccione un archivo..."

    /** Obtener todas las noticias */
    $http({

		method:'GET',
		url: 'routes/noticias/obtener.php'

	}).then(function successCallback(response){

        console.log(response.data);

        $scope.noticias = response.data
        $scope.filter_data = $scope.noticias.length

    })

    /** Modal para agregar noticia */

    $scope.modalAgregarNoticia = function(){

        $scope.noticiaAgregar = {}
        $scope.noticiaAgregar.TITULO = ''
        $scope.noticiaAgregar.DESCRIPCION_CORTA = ''
        $scope.noticiaAgregar.TEXTO = ''
        $scope.noticiaAgregar.IMAGEN = ''
        $scope.noticiaAgregar.TIPO = ''
        $scope.noticiaAgregar.ID_VIDEO = ''

        $('#modalAgregarNoticia').modal('show')

    }

    /** Agregar Noticia */
    $scope.agregarNoticia = function(){
				
        var fd = new FormData()

		angular.forEach($scope.files, function(file){

						file.tipo = 1
						fd.append('file', file)

						console.log(fd)

        })

        /** Imagen de Portada */
        $http({

			method:'POST',
			url: 'routes/noticias/subir_archivo.php',
			data: fd,
			transformRequest: angular.identity,
			headers : { 'Content-Type': undefined }

		}).then(function successCallback(response){

				console.log(response.data)

            if (response.data == 0) {

                alert('Ya existe una portada con el mismo nombre')

            }else{

                console.log(response.data)
                $scope.noticiaAgregar.IMAGEN = response.data[1]

                $http({

                    method:'POST',
                    url: 'routes/noticias/registrar.php',
                    data: $scope.noticiaAgregar,
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

                }).then(function successCallback(response){

                    console.log(response.data)

                    $scope.noticias = response.data
                    $scope.filter_data = $scope.noticias.length

                    $('#modalAgregarNoticia').modal('hide')

                    swal({

                        position: 'center',
                        type: 'success',
                        title: 'Excelente!',
                        text: 'La noticia se ha registrado con éxito!',
                        showConfirmButton: false,
                        timer: 1000

                    })

                })
            }

        })

    }

    $scope.tipoNoticia = function(tipo){

        $scope.noticiaAgregar.TIPO = tipo

    }

    /** Modal para editar noticia */
    $scope.modalEditarNoticia = function(id){

		$("#input_portada").val(null);
		$scope.imagen_seleccionada = false

		$http({
			method: 'GET',
			url: 'routes/noticias/detalles.php',
			params: {id_noticia: id}
		}).then(function successCallback(response){
			console.log(response.data)
			$scope.noticia_edit = response.data
			$('#modalEditarNoticia').modal('show')
		})

    }

    /** Editar Noticia */
    $scope.editarNoticia = function(id){

		var fd = new FormData()

		angular.forEach($scope.files, function(file){

            fd.append('file', file)

        })

		if ($scope.imagen_seleccionada) {

			$scope.noticia_edit.IMAGEN_SELECCIONADA = true
			console.log('El usuario selecciona una imagen')

			$http({

				method:'POST',
				url: 'routes/noticias/subir_archivo.php',
				data: fd,
				transformRequest: angular.identity,
				headers : { 'Content-Type': undefined }

			}).then(function successCallback(response){

				console.log(response.data)

				if (response.data == 0) {

					Swal.fire({
					  	type: 'error',
					  	title: 'Error',
					  	text: 'Ya existe una portada con el mismo nombre!'
					})

				}else{

					console.log(response.data)
					if ($scope.noticia_edit.TIPO == 2) {

						$scope.noticia_edit.IMAGEN_PORTADA = response.data[1]
						$scope.noticia_edit.URL_RECURSO = response.data[1]

					}else{

						$scope.noticia_edit.IMAGEN_PORTADA = response.data[1]

					}

					console.log($scope.noticia_edit)

					$http({
						method: 'POST',
						url: 'routes/noticias/editar.php',
						data: $scope.noticia_edit
					}).then(function successCallback(response){

						console.log(response.data)
						$('#modalEditarNoticia').modal('hide')
						$scope.noticias = response.data

						swal({

	                        position: 'center',
	                        type: 'success',
	                        title: 'Excelente!',
	                        text: 'La noticia se ha actualizado con éxito!',
	                        showConfirmButton: false,
	                        timer: 1000

	                    })

					})

				}

			})

		}else{

			$scope.noticia_edit.IMAGEN_SELECCIONADA = false

			console.log('No selecciono una imagen')

			/* Enviar peticion para actualizar unicamente los datos */

			$http({
				method: 'POST',
				url: 'routes/noticias/editar.php',
				data: $scope.noticia_edit
			}).then(function successCallback(response){

				console.log(response.data)
				$scope.noticias = response.data

				$('#modalEditarNoticia').modal('hide')

				swal({

					position: 'center',
					type: 'success',
					title: 'Excelente!',
					text: 'La noticia se ha actualizado con éxito!',
					showConfirmButton: false,
					timer: 1000

				})

			})

		}

    }

    /** Eliminar Noticia */
    $scope.eliminarNoticia = function(id){

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
                    url: 'routes/noticias/eliminar.php',
                    params: {id: id}

                }).then(function successCallback(response){

                    $scope.noticias = response.data
                    $scope.filter_data = $scope.noticias.length

                    swal({

                        position: 'center',
                        type: 'success',
                        title: 'Excelente!',
                        text: 'La dependencia se ha eliminado con éxito!',
                        showConfirmButton: false,
                        timer: 1000

                    })

                    /*
                    swal("Excelente!", "La dependencia se ha eliminado con éxito!", "success")

                    console.log(response.data)
                    */

                })

            }
        })

    }


    /* Edicion */
	/* Subir imagenes */
	$scope.imageIsLoaded = function(e){

		$scope.$apply(function (){
			$scope.noticia_edit.URL_IMAGEN = e.target.result
			$scope.imagen_seleccionada = true
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

	}

}])
