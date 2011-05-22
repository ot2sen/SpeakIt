/*
 * SpeakIt Speech Input
 *
 * This file contains SpeakIt speech input and shortcut's functions
 *
 * @package		SpeakIt
 * @category	Speech Input
 * @author		Trajche Petrov a.k.a SkechBoy
 * @link		https://github.com/skechboy/SpeakIt
 */

/*
 * -----------------------------------------------------------------------------
 * Defining main background variables and get user defined options
 * -----------------------------------------------------------------------------
*/
chrome.extension.sendRequest({method: "getOptions"}, function(response)
{
	var options = response.options,
		ctrl = /ctrl/.test(options.hotkeys),
		shift = /shift/.test(options.hotkeys),
		alt = /alt/.test(options.hotkeys),
		code = options.hotkeys.substr(options.hotkeys.lastIndexOf('+') + 2);
	
	document.addEventListener("keydown", function (e)
	{
		if(e.keyCode == code && e.ctrlKey == ctrl && e.shiftKey == shift && e.altKey == alt)
		{
			e.preventDefault();
			var selected = {"text": window.getSelection().toString(), "method": undefined};
			chrome.extension.sendRequest(selected);
			return false;
		}
	}, false);
		
	if(options.speechinput)
	{
		addSpeech();
	}
});

/*
 * -----------------------------------------------------------------------------
 * Initializing speech input procedures if enabled
 * -----------------------------------------------------------------------------
*/
	function addSpeech() // add speech input feature
	{
			var textinputs = document.getElementsByTagName("input");
			for(var x=0;x<textinputs.length;x++)
			{
				if(textinputs[x].type == "text")
				{
					textinputs[x].setAttribute('x-webkit-speech');
				}
			}
	}


