app.controller('monitoreoIncidenciasController', ['$scope', '$http', '$timeout', '$rootScope', '$location', function($scope, $http, $timeout, $rootScope, $location) {

    if (!$.cookie("usuario_ave")) {

        $location.path('/login');
        $location.replace();

    }else{

        $rootScope.logueado = true
        
    }

    $rootScope.tiempo_carga = 0

    $scope.getData = function(){

    	$http({

    		method: 'GET',
    		url: 'routes/monitoreo_incidencias/obtener_incidencias.php'

    	}).then(function successCallback(response){

            console.log(response.data)

            $scope.incidentes = response.data

            $( document ).ready(function() {
                 
                $.each($scope.incidentes, function( index, value ) {

                    /* Reset Canvas */
                    $("#"+value["ID_GRAFICA"]).remove()
                    $('#grafica-incidente-'+value["ID_GRAFICA"]).append('<canvas id="'+value["ID_GRAFICA"]+'"></canvas>')

                    var config = {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: value["DATOS_GRAFICA"],
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
                                animateScale: false,
                                animateRotate: false
                            },
                            pieceLabel: {
                                render: 'value' //show values
                            }
                        }
                    };

                    var ctx = document.getElementById(value["ID_GRAFICA"]).getContext('2d');
                    window.myDoughnut = new Chart(ctx, config);

                });

            

                /*
                var ctx = document.getElementById('chart-area5').getContext('2d');
                window.myDoughnut = new Chart(ctx, config);

                var ctx = document.getElementById('chart-area2').getContext('2d');
                window.myDoughnut = new Chart(ctx, config);
                */

            });

    	})

    }

    //$scope.getData()

    $scope.intervalFunction = function(){
        $timeout(function() {

            $scope.getData();
            $scope.intervalFunction();

        }, $rootScope.tiempo_carga)
    };

    $scope.intervalFunction();

    $rootScope.tiempo_carga = 5000
    
    /*
    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    20,
                    80
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                label: 'Dataset 1'
            }],
            labels: [
                'Red',
                'Orange',

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
            }
        }
    };



    var ctx = document.getElementById('chart-area3').getContext('2d');
    window.myDoughnut = new Chart(ctx, config);

    var ctx = document.getElementById('chart-area5').getContext('2d');
    window.myDoughnut = new Chart(ctx, config);

    var ctx = document.getElementById('chart-area2').getContext('2d');
    window.myDoughnut = new Chart(ctx, config);
    
    */

}])