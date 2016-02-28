'use strict';

describe('Controller: ExpCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var ExpCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExpCtrl = $controller('ExpCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
