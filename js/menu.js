/* 
  * To Title Case 2.1 – http://individed.com/code/to-title-case/
  * Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
 */

String.prototype.toTitleCase = function(){
	var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
	return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }
    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }
    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};


	function menuClick(value) {
		$('.menu-list li').removeClass('selected');
		var about = "<p>The Idaho Rangeland Atlas is a collaboration of the University of Idaho Library and the University of Idaho Rangeland Center.  Its purpose is to provide simple, clear information about Idaho's rangelands using open, accessible web technologies.  Leveraging the University of Idaho's investements in geospatial data and infrastructure enable us to present this information.  We believe that if an Idaho citizen wants to understand the basic facts of rangeland ecology and space in our state, those facts should be available without the need to engage in advanced analysis or obtain new skills.<br /><br />The lack of an aggregating resource, like a statistical abstract, adds time to process of discovery and delays the ability of users to move on, either to advanced research questions, as they have to answer and prove more fundamental ones first, or to other tasks based on the information that they now have.  Given the increasing accessibility of web-based geospatial processing, and the improvement in technology to provide rich, informative, web-based queries of spatial data, the opportunity exists to re-invent the statistical abstract for natural resource and agricultural questions, providing a simple interface to gather facts about the state of Idaho’s rangelands.</p>"
			
		var data = '<p>Data is obtained from available federal sources.<br /><br />Land Cover:  Land cover estimates are derived from the National Land Cover Database (NLCD) 2011 using values 52 (Shrub/Scrub) and 71(Grassland/Herbaceous).  The NLCD is a national products based on a classification of 2011 Landsat satellite imagery of the United States.  It is developed by the Multi-Resoultion Land Characteristics Consortium and available from the <a href="http://www.mrlc.gov/nlcd2011.php">USGS</a>.<br /><br />Land Management:  Land management information is obtained from the Bureau of Land Management\'s Surface Management Agency, which shows who manages the lands of the United States.  The data is available from the <a href="http://www.geocommunicator.gov/GeoComm/services.htm#Download">BLM</a>.<br /><br />Processing:  Using a geoprocessing model in ArcGIS 10.4, we identified the two areas classified as rangeland.  These choices were verified with the UI Rangeland Center as the best two choices to represent rangeland land cover.  Land management data was obtained by identifying the intersection between the land cover and land management data.</p>';
			
		var technical = '<p>All application development uses a combination of HTML5, CSS3, and Javascript.  The geoprocessing uses ESRI’s ArcGIS Javascript API.  Our goal is to use basic, open W3C-endorsed web technologies that are supported by all web browsers and require no additional add-ins, plug-ins, or special software.  All work will be done on software/hardware provided by the University of Idaho Library Data & Digital Services Department and INSIDE Idaho.</p>';
			
		var accuracy = '<p>Not sure what to say here yet.</p>';
			
		var contact = '<p>Any questions or comments should be directed to either Jeremy Kenyon (jkenyon@uidaho.edu) or Bruce Godfrey (bgodfrey@uidaho.edu).</p>';
		
		if (value == "Data and Methods") {
			$('.menu-list li:nth-child(2)').addClass('selected');
			$('.menu-heading').html("Data and Methods");
			$('.menu-content').html(data);
		} else if (value == "Technical Details") {
			$('.menu-list li:nth-child(3)').addClass('selected');
			$('.menu-heading').html("Technical Details");
			$('.menu-content').html(technical);
		} else if (value == "Accuracy and Disclaimer") {
			$('.menu-list li:nth-child(4)').addClass('selected');
			$('.menu-heading').html("Accuracy and Disclaimer");
			$('.menu-content').html(accuracy);
		} else if (value == "Contact Us") {
			$('.menu-list li:nth-child(5)').addClass('selected');
			$('.menu-heading').html("Contact Us");
			$('.menu-content').html(contact);
		} else {
			$('.menu-list li:first-child').addClass('selected');
			$('.menu-heading').html("About the Project");
			$('.menu-content').html(about);
		}
	}
		
	$().ready(menuClick("About the Project"));