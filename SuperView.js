define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  // This is a view base class built on top of the default Backbone.View; it
  // provides a set of rendering, binding, and lifecycle methods that tend to
  // be useful in Backbone applications.
  //
  // To use this SuperView, you should call its `extend` method just like you
  // would extend the normal `Backbone.View`.
  var SuperView = Backbone.SuperView = Backbone.View.extend({
    // ## Rendering

    // ### `placeAt`
    //
    // Once the view has been rendered, it still needs to be placed in the
    // document. The `placeAt` method allows you to specify a destination for
    // the view; this destination can either be a jQuery object, a DOM node, or
    // a selector. The `placeAt` method also optionally takes a position
    // argument, which determines how the object will be placed in the
    // destination node: as the first, last, or only child.
    placeAt : function(node, position) {
      position = position || 'last';

      var method = {
        'first' :     'prepend',
        'last' :      'append',
        'only' :      'html'
      }[position] || 'html';

      $(node)[method](this.$el);

      this.postPlaceAt();
      return this;
    },

    // ### `placeIn`
    //
    // Similar to `placeAt` but used to add elements/views
    // inside of this element. Makes use of the this.$(selector)
    // technique which gives a similar result to $(this).(selector)
    placeIn : function(el, node, position) {
      position = position || 'last';

      var method = {
        'first' :     'prepend',
        'last' :      'append',
        'only' :      'html'
      }[position] || 'html';

      this.$(node)[method](el);

      return this;
    },

    // ### `loading progress bar`
    //
    // creates and returns a bootstrap progress bar
    // defaults to stiped, animated 100%
    progressBar: function(width, classes) {
      //defaults
      width = width || 100;
      classes = classes || 'progress-striped active';

      var el = this.make('div', {'class': 'progress '+classes}, '<div class="bar bar-warning" style="width:'+width+'%;"></div>');

      return el;
    },

    // ## Binding
    //
    // By default, a view's bindings to evented objects are not necessarily torn down
    // when a view is destroyed. These methods provide for the cleanup of these
    // bindings, preventing potential memory leaks.

    // ### `bindTo`
    //
    // The `bindTo` method allows a view to bind a function to an event on an
    // object. The bound function will always run in the context of the view.
    // The `bindTo` method returns an object with an `unbind` method, allowing
    // you to manually unbind a binding later if desired.
    bindTo : function(obj, evt, fn) {
      this._bindings = this._bindings || [];

      obj.bind(evt, fn, this);
      this._bindings.push(obj);

      return {
        unbind : function() {
          obj.off(evt, fn);
        }
      };
    },

    // ### `unbind`
    //
    // The `unbind` method unbinds all handlers that were bound with `bindTo`;
    // you can call it directly, or by calling the view's `destroy` method,
    // which also removes the view from the document.
    unbind : function() {
      if (!this._bindings) { return; }

      _.each(this._bindings, function(b) {
        b.off(null, null, this);
      }, this);
    },

    // ### `destroy`
    //
    // The `destroy` method unbinds all handlers that were bound using
    // `bindTo`, and also calls the default `remove` method.
    destroy : function() {
      this.destroy
      this.unbind();
      this.remove();
    },

    // ### `preDestroy`
    //
    // `preDestroy` fires just before the view's `destroy` method starts
    // call `destroy` on each of the views subviews here
    preDestroy : function() {},

    // ## Lifecycle Methods
    //
    // These methods are stubs for implementation by your views. These methods
    // fire after their respective methods are complete.

    // ### `postRender`
    //
    // `postRender` fires just before the view's `render` method returns. Do
    // things here that require the view's basic markup to be in place, but
    // that do NOT require the view to be placed in the document
    postRender : function() { },

    // ### `postPlaceAt`
    //
    // `postPlaceAt` fires just before the view's `placeAt` method returns. Do
    // things here that require the view to be placed in the document, such as
    // operations that require knowing the dimensions of the view.
    postPlaceAt : function() { },

    // ## Event Helpers

    // ### `stopHash`
    // a util method to prevent the unwated effects of clicking on an <a href="#"></a>
    // style link. These links are commonly used for styling in bootstrap
    stopHash: function(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    //
  });

  return SuperView;
});