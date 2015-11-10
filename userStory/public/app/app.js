angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})