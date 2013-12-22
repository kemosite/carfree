/*=============================================
[Standard JavaScript Behaviours, HTML Template]
Version: 3.0
Author: Kevin Montgomery
==============================================*/

/* [Debug Tool] */
function debug_report(item) {
	if(this.console) {
	 	console.log("Item is type: "+typeof item);
	 	console.log(item);
	}
}

/* [Safe Execute] */
function safe_exec(input) {
	
	if (typeof input === "function") {

		try {
			input();
		}

		catch (error) {
			debug_report(error); // statements to handle any unspecified exceptions
		}
		
		finally {
			window.onerror = function(message, url, linenumber) {
				debug_report("Error: " + message + " on line " + linenumber + " for " + url);
			}
		}

	} else {
		debug_report("What is this "+ typeof input + " thing?");
		debug_report(input); // what is this thing?
	}
}

$(document).ready(function(){
	
	/* [TypeSet Body Copy] */
	$("body, p, label, input, select").typeset();
	
	/* [Switch SVG for PNG Image, If Not Supported] */
	if(!Modernizr.svg) {
		$('img[src*="svg"]').attr('src', function () {
			return $(this).attr('src').replace('.svg', '.png');
		});
	}
	
	/*
	[If Retina Display, Load 2x Pixel Images]
	var retina = window.devicePixelRatio > 1;
	if (retina) {
		$('img[src!="svg"]').attr('src', function () {
			return $(this).attr('src').replace(/\.(png|jpg|gif)+$/i, '@2x.$1');
		});
	}
	*/
	
	/* [Default Link Behaviour] */
		
	$("a").click(function(event) {

		// Override default behaviour
		event.preventDefault();
		var url = $(this).attr("href");
		var rel = $(this).attr("rel");
		
		if (url && url !== "#" && !rel) {

			// If link is local, smooth-scroll to it
			if (url.substr(0,1) == "#" && adaptive_scripts.attach_scrollto) {
				$.scrollTo($(url), 1000);
			
			// Otherwise, fade the page out, then go to the link
			} else {
				$(".container").fadeOut("fast").css("display: none");
				document.location.href=url;
			}
		} 
	});
});