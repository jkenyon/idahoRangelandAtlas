define(["dojo/_base/declare","esri/widgets/Search","esri/layers/FeatureLayer","dojo/domReady!"],function(a,b,c){return a(null,{searchConfig:null,constructor:function(a){this.view=a,this.searchConfig=new Object({url:"https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_atlas_2014/MapServer/0"})},searchWidget:function(a){return this.searchConfig.url=a.FeatureLayerUrl?a.FeatureLayerUrl:this.searchConfig.url,this.searchConfig.zoomScale=a.zoomScale?a.zoomScale:5e3,this.searchConfig.resultGraphicEnabled=!!a.resultGraphicEnabled&&a.resultGraphicEnabled,this.searchWidget=new b({view:this.view,popupEnabled:!1,sources:[{featureLayer:new c({url:this.searchConfig.url}),searchFields:["NAME"],suggestionTemplate:"{NAME}",displayField:"NAME",suggestionEnabled:!0,exactMatch:!1,outFields:["*"],name:"Land Cover",zoomScale:this.searchConfig.zoomScale,resultGraphicEnabled:this.searchConfig.resultGraphicEnabled}]}),this.searchWidget.startup(),this.searchWidget},searchWidgetSetup:function(a){this.searchConfig=a?a:this.searchConfig}})});