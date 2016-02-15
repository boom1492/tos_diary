'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var questCtrlStub = {
  index: 'questCtrl.index',
  show: 'questCtrl.show',
  create: 'questCtrl.create',
  update: 'questCtrl.update',
  destroy: 'questCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var questIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './quest.controller': questCtrlStub
});

describe('Quest API Router:', function() {

  it('should return an express router instance', function() {
    questIndex.should.equal(routerStub);
  });

  describe('GET /api/quests', function() {

    it('should route to quest.controller.index', function() {
      routerStub.get
        .withArgs('/', 'questCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/quests/:id', function() {

    it('should route to quest.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'questCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/quests', function() {

    it('should route to quest.controller.create', function() {
      routerStub.post
        .withArgs('/', 'questCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/quests/:id', function() {

    it('should route to quest.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'questCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/quests/:id', function() {

    it('should route to quest.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'questCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/quests/:id', function() {

    it('should route to quest.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'questCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
