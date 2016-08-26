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
		var about = "<p>Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank. Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.</p>"
			
		var data = '<p>Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank. Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.</p>';
			
		var technical = '<p>Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank. Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.</p>';
			
		var accuracy = '<p>Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank. Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.<br /><br />Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.Bacon ipsum dolor amet short loin brisket ground round, ribeye turducken corned beef rump pancetta shank leberkas tri-tip. Beef ribs sausage cow salami swine, leberkas bacon flank doner meatloaf alcatra boudin brisket pancetta shank.</p>';
			
		var contact = '<p>Send an email to Bob.  You know Bob, right?</p>';
		
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