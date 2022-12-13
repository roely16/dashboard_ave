var app = angular.module("app", ["ngRoute", "ui.bootstrap", "checklist-model"])

app.config(function($sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain. **.
        'https://udicat.muniguate.com/**'
      ]);

}) 

/* Filtro */
app.filter('beginning_data', function(){
    return function(input, begin){
        if (input) {
            begin = +begin
            return input.slice(begin)
        }
        return []
    }
})

/* Directiva para subir archivo */
app.directive('fileInput', function($parse){
    return{
        restrict : 'A',
        link: function(scope, elem, attrs){
            elem.bind('change', function(){
                $parse(attrs.fileInput).assign(scope,elem[0].files)
            })
        }
    }
})

//Configuracion de rutas
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        controller: 'homeController',
        templateUrl: 'views/layouts/home.html'
    })
    .when('/login', {
        controller: 'loginController',
        templateUrl: 'views/layouts/login.html'
    })
	.when('/configuracion', {
        controller: 'configuracionController',
        templateUrl: 'views/layouts/configuracion.html',
        activetab: "configuracion"
    })
    .when('/comunidades', {
        controller: 'comunidadController',
        templateUrl: 'views/layouts/comunidades.html',
        activetab: "comunidades"
    })
	.when('/comunidades/:id_comunidad/detalles', {
        controller: 'comunidadDetalleController',
        templateUrl: 'views/layouts/detalle_comunidad.html',
        activetab: "comunidades"
    })
    .when('/roles', {
        controller: 'rolesController',
        templateUrl: 'views/layouts/roles.html',
        activetab: "roles"
    })
	.when('/roles/:id_rol/mensajes', {
        controller: 'mensajesController',
        templateUrl: 'views/layouts/mensajes.html',
        activetab: "roles"
    })
	.when('/roles/:id_rol/mensajes/:id_mensaje/actividades', {
		controller: 'actividades2Controller',
        templateUrl: 'views/layouts/actividades2.html',
        activetab: "roles"
    })
    .when('/albergues', {
        controller: 'alberguesController',
        templateUrl: 'views/layouts/albergues.html',
        activetab: "albergues"
    })
    .when('/categorias', {
        controller: 'categoriasController',
        templateUrl: 'views/layouts/categorias.html',
        activetab: "categorias"
    })
    .when('/dependencias', {
        controller: 'dependenciasController',
        templateUrl: 'views/layouts/dependencias.html',
        activetab: "dependencias"
    })
    .when('/personas', {
        controller: 'personasController',
        templateUrl: 'views/layouts/personas.html',
        activetab: "personas"
    })
    .when('/personas/:id_persona/editar_persona', {
        controller: 'editarPersonaController',
        templateUrl: 'views/layouts/editar_persona.html',
        activetab: "personas"
    })
    .when('/protocolos', {
        controller: 'protocolosController',
        templateUrl: 'views/layouts/protocolos_general.html',
        activetab: "protocolos"
    })
	.when('/terremoto', {
        controller: 'terremotoController',
        templateUrl: 'views/layouts/terremoto.html',
        activetab: "terremoto"
    })
	.when('/alertas', {
        controller: 'alertasController',
        templateUrl: 'views/layouts/alertas.html',
        activetab: "alertas"
    })
    .when('/noticias', {
        controller: 'noticiasController',
        templateUrl: 'views/layouts/noticias.html',
        activetab: "noticias"
    })
    .when('/monitor_incidencias', {
        controller: 'monitoreoIncidenciasController',
        templateUrl: 'views/layouts/monitor_incidencias.html',
        activetab: "monitor_incidencias"
    })
	.when('/encargados', {
        controller: 'encargadoController',
        templateUrl: 'views/layouts/encargados.html',
        activetab: "encargados"
    })
	.when('/encargados/:id_encargado/equipo_trabajo', {
        controller: 'equipoTrabajoController',
        templateUrl: 'views/layouts/equipo_trabajo.html',
        activetab: "encargados"
    })
    .when('/monitor_incidencias/:id_incidencia', {
        controller: 'incidenciaController',
        templateUrl: 'views/layouts/detalle_incidencia.html',
        activetab: "monitor_incidencias"
    })
    .when('/protocolos/:id_protocolo/actividades', {
        templateUrl: 'views/layouts/actividades.html',
        controller: 'actividadesController',
        activetab: "protocolos"
    })
    .when('/categorias/:id/protocolos', {
        templateUrl: 'views/layouts/protocolos.html',
        controller: 'protocolosController'
    })
    .when('/roles/:id_rol/actividades', {
        templateUrl: 'views/layouts/actividades.html',
        controller: 'actividadesController'
    })
    .when('/comunidades/:id/personas', {
        templateUrl: 'views/layouts/personas.html',
        controller: 'personasController'
    })
    .when('/categorias/:id/protocolos/:id_protocolo/actividades', {
        templateUrl: 'views/layouts/actividades.html',
        controller: 'actividadesController'
    })
	.when('/capacidades_opciones', {
        templateUrl: 'views/layouts/capacidades_opciones.html',
		activetab: "capacidades_opciones"
    })
    .otherwise({redirectTo:'/'})

}])

app.run(function ($rootScope, $route) {
    $rootScope.$route = $route;
})
