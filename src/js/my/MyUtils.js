/**
 * Created by kande on 11/14/2016.
 */
define([
    "dojo/_base/declare",
    "dojo/domReady!"
  ],
  function (declare) {
    return declare(null, {
      constructor: function () {
      },
      fixHeading: function (head) {
        var h = head.toLowerCase();
        var hE = h.toTitleCase();
        $(".resultHead").html("<h3>" + hE + "</h3>");
      },
      colorize: function (pixelData) {
        pixelBlock = pixelData.pixelBlock;
        var numPixels = pixelBlock.width * pixelBlock.height;
        var rBand = [];
        var gBand = [];
        var bBand = [];
        for (i = 0; i < numPixels; i++) {
          // Sets a color between blue (coldest) and red (warmest) in each band
          rBand[i] = 0;
          gBand[i] = 0;
          bBand[i] = 0;
        }
        pixelData.pixelBlock.pixels = [rBand, gBand, bBand];
      }
    });
  });