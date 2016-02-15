'use strict';

describe('Controller: QuestCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var QuestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestCtrl = $controller('QuestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
