/**
 * Created by kande on 12/5/2016.
 */

define([
    "dojo/_base/declare",
    "dojo/store/Memory",
    "dijit/form/FilteringSelect",
    "dojo/domReady!"
  ],
  function (declare, Memory, FilteringSelect) {
    return declare(null, {
      id: null,
      data: null,
      constructor: function () {
        var stateStore = new Memory({
          data: ['ADA', 'ADAMS', 'BANNOCK', 'BEAR LAKE', 'BENEWAH', 'BINGHAM', 'BLAINE', 'BOISE', 'BONNER', 'BONNEVILLE', 'BOUNDARY', 'BUTTE', 'CAMAS', 'CANYON', 'CARIBOU', 'CASSIA', 'CLARK', 'CLEARWATER', 'CUSTER', 'ELMORE', 'FRANKLIN', 'FREMONT', 'GEM', 'GOODING', 'IDAHO', 'JEFFERSON', 'JEROME', 'KOOTENAI', 'LATAH', 'LEMHI', 'LEWIS', 'LINCOLN', 'MADISON', 'MINIDOKA', 'NEZ PERCE', 'ONEIDA', 'OWYHEE', 'PAYETTE', 'POWER', 'SHOSHONE', 'TETON', 'TWIN FALLS', 'VALLEY', 'WASHINGTON']
        });

        var filteringSelect = new FilteringSelect({
          id: "stateSelect",
          name: "state",
          value: "CA",
          store: stateStore,
          searchAttr: "name"
        }, "stateSelect").startup();
      }
    });
  });