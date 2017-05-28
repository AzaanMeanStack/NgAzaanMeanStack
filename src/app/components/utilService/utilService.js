(function() {

  'use strict';

  angular
    .module('AzaanApp')
    .service('utilService', utilService);

  function utilService() {
    this.showAlert = function(status, message, options) {
      var alert = $('#pageAlert');
      alert.attr('class', 'alert alert-' + status);
      alert.find('.content').html(message);

      options = options || {};
      options.triggerClick = function(arg) {
        alert.delay(arg).fadeOut('slow', function() {
          $(this).find('.close').trigger('click');
        });
      }
      var manualClose = options.manualClose;
      var autoClose = options.autoCloseMS;

      if (autoClose && typeof autoClose === 'number' && autoClose > 0) {
        options.triggerClick(autoClose);
      } else if (status === 'success' && !manualClose) {
        alert.find('.close').hide();
        autoClose = 3500;
        options.triggerClick(autoClose);
      } else if (manualClose && typeof manualClose === 'boolean') {
        alert.find('.close').show();
      }
      alert.show();
    }
  }

})();