var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning']);
  

app.controller('MainCtrl', function ($http, $log) {
    var vm = this;
    vm.isShow = false;
    vm.isSubShow = false;
    vm.modeldata = {
        UnitConfigId: '',
        UnitConfigText: '',
        UnitText: '',
        LanguageName: ''
    };
    vm.gridOptions = {
        expandableRowTemplate: 'expandableRowTemplate.html',
        expandableRowHeight: 150,
        //subGridVariable will be available in subGrid scope
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        }
    };

    vm.gridOptions.columnDefs = [{ name: 'Config ID', field: 'varUnitConfigId' }, { name: 'Unit Config', field: 'varUnitConfiguration' }, { name: 'Language Name', field: 'languageName' }];

    $http.get('Content/test.json')
      .then(function (response) {
          var data = response.data.unitVariableModelList;
          vm.data = {};
          
          for (i = 0; i < data.length; i++) {
              data[i].subGridOptions = {
                  headerTemplate: 'header-template.html',
                  //columnDefs: [{ name: 'Config ID', field: 'varUnitConfigId' }, { name: 'Unit Config', field: 'varUnitConfiguration' }, { name: 'Language Name', field: 'languageName' }],
                  columnDefs: [{field: 'varUnitConfigId' }, { field: 'varUnitConfiguration' }, { field: 'languageName' }],
                  data: data[i].unitLangList
              };
          }
          vm.data = data;
          vm.gridOptions.data = data;
      });

    vm.gridOptions.onRegisterApi = function (gridApi) {
        vm.gridApi = gridApi;
    };    

    vm.addData = function () {
        var unitData =
        {
            "varUnitConfiguration": vm.modeldata.UnitConfigText,
            "varUnitConfigId": vm.modeldata.UnitConfigId,
            "varUnitUserDefined": null
            //"unitLangList": [{}]
        };
        vm.data.push(unitData);
        vm.gridOptions.data = vm.data;
    };

    vm.addSubData = function () {
        var unitLang =
            {
                "unitText": vm.modeldata.UnitText,
                "languageName": vm.modeldata.LanguageName
            };       
        if (angular.isUndefined(vm.data[vm.data.length - 1].unitLangList)) {
            vm.data[vm.data.length - 1].unitLangList = [unitLang];
        }
        else {
            vm.data[vm.data.length - 1].unitLangList.push(unitLang);
        }
        for (i = vm.data.length - 1; i > vm.data.length - 2; i--) {
            vm.data[i].subGridOptions = {
                columnDefs: [{ name: 'Language Name', field: 'languageName' }, { name: 'unit Text', field: 'unitText' }],
                data: vm.data[i].unitLangList
            };
        }

        vm.gridOptions.data = vm.data;
        vm.modeldata.UnitConfigId = '';
        vm.modeldata.UnitConfigText = '';
        vm.modeldata.UnitText = '';
        vm.modeldata.LanguageName = '';
        vm.isShow = false;
        vm.isSubShow = false;
    };
});