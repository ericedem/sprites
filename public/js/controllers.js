'use strict';

/* Controllers */

function AppCtrl($scope, sheets) {
    $scope.text = '864x480 78x107 410x321 188x167 315x274 229x163 629x236 39x32 193x56 543x155';
    $scope.word = /^\d+x\d+(\s\d+x\d+)*$/;

    $scope.sheets = sheets.getSheets($scope.text);

    $scope.submit = function(){
        if ($scope.text){
            $scope.sheets = sheets.getSheets($scope.text);
        }
    }
}