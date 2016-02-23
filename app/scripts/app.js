/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document, window) {
'use strict';
  window.onload = function () {
    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    // Close drawer after menu item is selected if drawerPanel is narrow
    app.onMenuSelect = function() {
      var drawerPanel = document.querySelector('#paperDrawerPanel');
      if (drawerPanel.narrow) {
        drawerPanel.closeDrawer();
      }
    };
  };
})(document, window);
