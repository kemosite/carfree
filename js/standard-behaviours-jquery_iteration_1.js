/*=============================================
[Standard JavaScript Behaviours, HTML Template]
Version: 3.0
Author: Kevin Montgomery
==============================================*/

/* [Debug Tool] */
function debug_report(item) {
	 if(this.console){ console.log(item); }
}

/* [Safe Execute] */
function safe_exec(function_name) {
	try {
		function_name();
	} catch (e) {
		debug_report(e); // statements to handle any unspecified exceptions
	}
	finally {
		window.onerror = function(message, url, linenumber) {
			debug_report("Error: " + message + " on line " + linenumber + " for " + url);
		}
	}
}

$(document).ready(function(){
	
	/* [TypeSet Body Copy] */
	$("body, p").typeset();
	
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
		
		if (url && !rel) {
			
			// If link is local, smooth-scroll to it
			if (url.substr(0,1) == "#") {
				$.scrollTo($(url), 1000);
			
			// Otherwise, fade the page out, then go to the link
			} else {
				$(".container").fadeOut("fast").css("display: none");
				document.location.href=url;
			}
		} 
	});
});

/* [Fade The Page In] */
$(window).load( function() {
	$(".throbber").fadeOut().css("display: none");
	$(".container").fadeIn().css("display: block");
});