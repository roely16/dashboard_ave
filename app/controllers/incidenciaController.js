app.controller('incidenciaController', ['$scope', '$http', '$routeParams', '$rootScope', '$timeout', '$location', function($scope, $http, $routeParams, $rootScope, $timeout, $location){
	
	if (!$.cookie("usuario_ave")) {

		$location.path('/login');
		$location.replace();

	}else{

		$rootScope.logueado = true
		
	}

	$rootScope.tiempo_carga = 100000000000000

	$http({

		method: 'GET',
		url: 'routes/monitoreo_incidencias/obtener_incidente_protocolo.php',
		params: {id_incidente: $routeParams.id_incidencia}

	}).then(function successCallback(response){

		console.log(response.data)

		$scope.incidente = response.data[0]

		$scope.actividades = response.data[1]
		$scope.filter_data = $scope.actividades.length	

	    var ctx = document.getElementById('chart-area').getContext('2d');
	    window.myDoughnut = new Chart(ctx, {
	        type: 'doughnut',
	        data: {
	            datasets: [{
	                data: [
	                    response.data[3],
	                    response.data[2]
	                ],
	                backgroundColor: [
	                    'rgba(255, 99, 132, 0.2)',
	                    'rgba(54, 162, 235, 0.2)',
	                ],
	                label: 'Dataset 1'
	            }],
	            labels: [
	                'Restante',
	                'Completado',

	            ]
	        },
	        options: {
	            responsive: true,
	            legend: {
	                position: 'top',
	            },
	            animation: {
	                animateScale: true,
	                animateRotate: true
	                
	            },
	            pieceLabel: {
			        render: 'value' //show values
			    }
	        }

   	 	});

	})

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