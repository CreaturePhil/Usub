var isUser = require('../config/passport').isUser;

/**
 * Map resources to routes.
 * @param {String} path
 * @param {Object} controller
 * @param {Object} router
 */
module.exports = function Resource(path, controller, router) {
  var id = '/' + (controller.id || ':id');
  if (controller.index) { //  GET /
    router.get(path, controller.index);
  }
  if (controller.new) { //  GET /new
    router.get(path + '/new', controller.new);
  }
  if (controller.create) { //  POST /
    router.post(path, controller.create);
  }
  if (controller.show) { //  GET /:id
    router.get(path + id, controller.show);
  }
  if (controller.edit) { //  GET /edit/:id
    router.get(path + '/edit' + id, controller.edit);
  }
  if (controller.update) { //  PUT /:id
    router.put(path + id, isUser, controller.update);
  }
  if (controller.delete) { //  DELETE /:id
    router.delete(path + id, controller.delete);
  }
};
