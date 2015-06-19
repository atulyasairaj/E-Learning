var mainApp = angular.module('myApp',[]);

mainApp.controller('studentController', function ($scope) {
	// $scope.helloTo = "Sanket";
	// $scope.helloTo.Title = "Sanket";
	$scope.student = {
		firstname: "Mahesh",
		lastname: "Parashar",
		fullname: function() {
			var studentObject;
			studentObject = $scope.student;
			return studentObject.firstname + " " + studentObject.lastname;
		},
		fees: 200,
		subjects:[
		{name:'Physics',marks:70},
		{name:'Chemistry',marks:80},
		{name:'Math',marks:65},
		{name:'English',marks:75},
		{name:'Hindi',marks:67}
		]
	};

	


});

mainApp.controller('studentFormController', function($scope){

	/*$scope.reset = function(){
		$scope.firstname = "Sankt";
		$scope.lastname = "Phanas";

		$scope.email = "gmail@sanket.com";
	};

	$scope.reset();*/
});

