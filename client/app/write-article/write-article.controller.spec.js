'use strict';

describe('Controller: WriteArticleCtrl', function () {

  // load the controller's module
  beforeEach(module('fullstackApp'));

  var WriteArticleCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WriteArticleCtrl = $controller('WriteArticleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
