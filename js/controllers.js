'use strict';

/* Controllers */

function TestCtrl($scope) {


}

function CollapseDemoCtrl($scope) {
  $scope.isCollapsed = true;
  $scope.text = "CREATE/VIEW";
  $scope.linkClicked = function() {
  	$scope.isCollapsed = !$scope.isCollapsed
  	if ($scope.isCollapsed) $scope.text = "CREATE/VIEW"
  	else $scope.text="(HIDE)";
  }
}

function AccordionDemoCtrl($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: "Dynamic Group Header - 1",
      content: "Dynamic Group Body - 1"
    },
    {
      title: "Dynamic Group Header - 2",
      content: "Dynamic Group Body - 2"
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };
}