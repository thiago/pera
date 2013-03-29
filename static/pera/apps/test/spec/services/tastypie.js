'use strict';

describe('Service: tastypie', function () {

  // load the service's module
  beforeEach(module('apiApp'));

  // instantiate service
  var tastypie;
  beforeEach(inject(function (_tastypie_) {
    tastypie = _tastypie_;
  }));

  it('should do something', function () {
    expect(!!tastypie).toBe(true);
  });

});
