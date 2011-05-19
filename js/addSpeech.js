/*
 * SpeakIt Speech Input
 *
 * This file contains SpeakIt speech input functions
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
	var options = response.options;
	if(options != null && options.speechinput)
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


