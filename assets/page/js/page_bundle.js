// =========================| Page scripts |========================= //



//--------------------------| DOM Ready

jQuery(document).ready(function($) {

  'use strict';

  $.ajax({
    url: 'README.md',
    context: document.body,
    success: function(mdText) {
      var converter = new showdown.Converter();
      var htmlText = $('<div class="markdown" />').append(converter.makeHtml(mdText));

      // Define DOM elements
      var dom = $.extend({}, {
        title: htmlText.find('h1'),
        slogan: htmlText.find('h1').next('p'),
        pills: htmlText.find('h1').next('p').next('p'),
        description: (function() {
          var descriptionTitle = htmlText.find('#description'),
            descriptionText  = htmlText.find('#description').next('p'),
            description = $('<div class="description" />')
              .append(descriptionTitle)
              .append(descriptionText);

          return description;
        }()),
        license: (function() {
          var license = htmlText.find('#license').next('p');
          license.find('a').attr('target', '_blank');
          htmlText.find('#license').remove();
          return license;
        }()),
        content: htmlText
      });

      // Remove pills
      dom.pills.remove();

      // Remove #demo
      htmlText.find('#demo').next('p').remove();
      htmlText.find('#demo').remove();

      // Reorder DOM structure
      dom.slogan.addClass('description').appendTo('.page-header .wrp-main');
      dom.title.prependTo('.page-header .ttl');
      dom.license.addClass('license').appendTo('.page-footer .wrp-main');
      dom.description.appendTo('.col-description');
      dom.content.appendTo('.page-section article .col-docs');

      Prism.highlightAll();
    }
  });

});