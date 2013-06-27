/**
  * TYPESET.JS
	* Version: 3
	* By: A Designer Called Kevin
	* Copyright: 
	*
	* A JavaScript to set a default font size for your web page.
	* 
	* Steps:
	+ Capture Screen Resolution
	+ Decide the best value for a diameter
	+ Establish the Fovial Vision area within a Field of View for monitor viewing
	+ Determine diameter for 1 letter within Fovial Vision
	+ Determine appropriate line height based on 1 letter width
	+ Determine ideal line length based on font size
	+ Establish other elements of style appropriate for font size.
	*/

(function( $ ){

  $.fn.typeset = function() {
  
		// Capture screen resolution, use minimum for diameter //
    var screen_width = screen.width;
		var screen_height = screen.height;
		var screen_min = Math.min(screen_width, screen_height);

		// Establish our parameters for field of view and fovial vision //
		var fov = 30; // About 30 degree fov monitor viewing.
		var fv = 1.5; // fovial vision, in degrees, for 4 letters. Usually 1-2 degrees.
		var fov_ratio = (fv / fov); // Calculate ratio, apply to monitor resolution
		var fv_pixels = Math.round(screen_min * fov_ratio); // Fovial diameter in pixels, for 4 letters
		var calc_fontheight = Math.round(fv_pixels / 4); // Diameter of 1 lowercase letter
		
		// Evaluate users font size.
		$("body").append('<p id="typeset_usr_fontobj">&nbsp;</p>');
		var typeset_usr_fontobj = $("#typeset_usr_fontobj");
		$(typeset_usr_fontobj).css({'line-height':'100%', 'padding':'0', 'margin':'0'});
		var usr_fontheight = typeset_usr_fontobj.height();
		$(typeset_usr_fontobj).css({'font-size':'1ex'});
		var usr_font_xheight = typeset_usr_fontobj.height();
		$(typeset_usr_fontobj).remove();
		
		var g_ratio = 1 + (usr_font_xheight / usr_fontheight); // 1.61803399;
		
		var typeset_px_fontheight = Math.max(calc_fontheight, usr_fontheight); // Apply the larger of the users setting, or the new setting.
		var typeset_em_fontheight = Math.round((typeset_px_fontheight / usr_fontheight) * 1000) / 1000; // Calculate height using em measure.
		var typeset_letter_dia = Math.round(typeset_px_fontheight / g_ratio);
		var typeset_px_lineheight = (typeset_letter_dia * 2);
		var typeset_em_lineheight = Math.round((typeset_px_lineheight / typeset_px_fontheight) * 1000) / 1000;
		var typeset_px_itemspace = (typeset_letter_dia);
		var typeset_em_itemspace = Math.round((typeset_px_itemspace / typeset_px_fontheight) * 1000) / 1000;
			
		var typeset_em_maxlength = Math.max(39, (typeset_px_fontheight * 2));
		// Calculate ideal line length, compare the 'alphabet-and-a-half rule' to the 'points-times-two' rule
		var typeset_px_maxlength = (typeset_em_maxlength * typeset_px_fontheight);
		
		return this.each(function(){

      // Store the object
      var $this = $(this);
        
      // Typesetter() typesets the item
      var typesetter = function () {
				
				/*
				for (var i = 0; i < $this.length; i++) {
					var line = $($this[i]).html();
					
					// Do a REGEX match for line_terminator + "word" + " ",
					// Swap the space at the end for a non-breaking one.
					// var line_terminators = line.split("!.,?:");
					
					var word_array = line.split(" ");
					var last_words =  word_array.splice(-2);
					var last_words_join = last_words.join("&nbsp;");
					word_array.push(last_words_join);
					line = word_array.join(" ");
					$($this[i]).html(line);
				}
				*/
				
				if ($this[0].nodeName.toLowerCase() != "body") {
					$this.css({
						'font-size':typeset_em_fontheight+'em', 
						'line-height':typeset_em_lineheight+'em', 
						'max-width':typeset_em_maxlength+'em',
						'margin':typeset_em_itemspace+'em 0'
					});
				} else {
					$this.css({
						'font-size':typeset_em_fontheight+'em', 
						'line-height':typeset_em_lineheight+'em'
					});
				}
      };

      // Call once to set.
      typesetter();
      	
    });
				
  };
})( jQuery );