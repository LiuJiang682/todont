describe('ListController', function() {
    
  'use strict';

  var scope, controller, timeout, q, TodoService, mockTodoService,
     testItem, testItems, testNewItem, testErrorMessage, testResponseSuccess, testResponseFailure;

  beforeEach(module('ToDont'));

  beforeEach(inject(function($rootScope, $controller, $timeout, $q, _TodoService_) {
    // Test data
    testItem = {id:1,desc:'test item',complete:false}; 
    testItems = [testItem];
    testNewItem = 'test item 2';
    testErrorMessage = 'Error message';
    testResponseSuccess = { success: true, data: { items: testItems } };
    testResponseFailure = { error: testErrorMessage };
    // Services
    TodoService = _TodoService_;
    timeout = $timeout;
    q = $q;
    // Controller setup
    scope = $rootScope.$new();
    controller = $controller('ListController', {
      $scope: scope,
      TodoService: TodoService
    });
  }));

  describe('initialization', function() {

    it('initializes with proper $scope variables and methods', function() {
      scope.$apply();
      expect(scope.items).toEqual([]);
      expect(scope.newItem).toEqual('');
      expect(scope.errorMsg).toEqual(false);
    });

    it('initializes by getting the list of items', function() {
      spyOn(scope, 'getItems');
      timeout.flush();
      expect(scope.getItems).toHaveBeenCalled();
    });

  });

  describe('getItems()', function() {

    it('successfully gets the list of items from the service', function() {
      spyOn(TodoService, 'get').and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve(testResponseSuccess);
        return deferred.promise;
      });
      scope.$apply(function() {
        scope.getItems();
      });
      expect(TodoService.get).toHaveBeenCalled();
      expect(scope.items.length).toBe(testItems.length);
    });

    it('fails to get the list of items and displays an error message', function() {
      spyOn(TodoService, 'get').and.callFake(function() {
        var deferred = q.defer();
        deferred.reject(testResponseFailure);
        return deferred.promise;
      });
      scope.$apply(function() {
        scope.getItems();
      });
      expect(TodoService.get).toHaveBeenCalled();
      expect(scope.items.length).toBe(0);
      expect(scope.errorMsg).toEqual(testResponseFailure.error);
    });

  });

  describe('completeItem()', function() {

    it('successfully toggles the complete status of the item', function() {
      spyOn(TodoService, 'update').and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve(testResponseSuccess);
        return deferred.promise;
      });
      scope.$apply(function() {
        scope.completeItem(testItem);
      });
      expect(TodoService.update).toHaveBeenCalled();
      expect(testItem.complete).toBe(true);
    });

    it('fails to toggle the complete status and displays an error message', function() {
      spyOn(TodoService, 'update').and.callFake(function() {
        var deferred = q.defer();
        deferred.reject(testResponseFailure);
        return deferred.promise;
      });
      scope.$apply(function() {
        scope.completeItem(testItem);
      });
      expect(TodoService.update).toHaveBeenCalled();
      expect(testItem.complete).toBe(false);
      expect(scope.errorMsg).toEqual(testResponseFailure.error);
    });

  });

  describe('addItem()', function() {

    it('successfully adds a new item to $scope.items', function() {
      spyOn(TodoService, 'add').and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve(testResponseSuccess);
        return deferred.promise;
      });
      expect(scope.items.length).toBe(0);
      scope.$apply(function() {
        scope.newItem = testNewItem;
        scope.addItem();
      });
      expect(TodoService.add).toHaveBeenCalled();
      expect(scope.items.length).toBe(1);
      expect(scope.newItem).toBe('');
    });

    it('does not add a new item if $scope.newItem is an empty string', function() {
      spyOn(TodoService, 'add');
      expect(scope.items.length).toBe(0);
      scope.$apply(function() {
        scope.addItem();
      });
      expect(TodoService.add).not.toHaveBeenCalled();
      expect(scope.items.length).toBe(0);
      expect(scope.newItem).toBe('');
    });

    it('fails to add a new item and displays an error message', function() {
      spyOn(TodoService, 'add').and.callFake(function() {
        var deferred = q.defer();
        deferred.reject(testResponseFailure);
        return deferred.promise;
      });
      expect(scope.items.length).toBe(0);
      scope.$apply(function() {
        scope.newItem = testNewItem;
        scope.addItem();
      });
      expect(TodoService.add).toHaveBeenCalled();
      expect(scope.items.length).toBe(0);
      expect(scope.errorMsg).toBe(testResponseFailure.error);
      expect(scope.newItem).toBe(testNewItem);
    });

  });

  describe('deleteItem()', function() {

    it('successfully deletes the item from $scope.items', function() {
      testResponseSuccess = { success: true, data: { items: [] } };
      spyOn(TodoService, 'delete').and.callFake(function() {
        var deferred = q.defer();
        deferred.resolve(testResponseSuccess);
        return deferred.promise;
      });
      scope.$apply(function() {
        scope.items = testItems;
        scope.deleteItem(testItem);
      });
      expect(TodoService.delete).toHaveBeenCalled();
      expect(scope.items.length).toBe(0);
    });

    it('does not delete anything if item is not present in $scope.items', function() {
      spyOn(TodoService, 'delete');
      scope.$apply(function() {
        scope.items = testItems;
        scope.deleteItem('not a real item');
      });
      expect(TodoService.delete).not.toHaveBeenCalled();
      expect(scope.items.length).toBe(1);
    });

    it('fails to delete the item and displays an error message', function() {
      spyOn(TodoService, 'delete').and.callFake(function() {
        var deferred = q.defer();
        deferred.reject(testResponseFailure);
        return deferred.promise;
      });
      scope.$apply(function() {
        scope.items = testItems;
        scope.deleteItem(testItem);
      });
      expect(TodoService.delete).toHaveBeenCalled();
      expect(scope.items.length).toBe(1);
      expect(scope.errorMsg).toBe(testResponseFailure.error);
    });

  });

});
