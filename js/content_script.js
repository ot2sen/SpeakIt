/*
 * -----------------------------------------------------------------------------
 *  Function for filtering text from "bad" characters and preppare text
 *  for Google Text to Speech API
 * -----------------------------------------------------------------------------
*/	
function filterText(text)
{

	var maxlength = 75; // Max length of one sentence this is Google's fault :) 
	var str = [];
	var badchars = ["+","#","@","-","<",">","\n","!","?",":","&",'"',"  "];
	var replaces = ["+plus+","+sharp+","+at+","","","","",".",".",".","+and+","+quotes.+"," "]
	for(var i in badchars) // replacing bad chars
	{
		text = text.split(badchars[i]).join(replaces[i]);		
	}

	txtlen = text.length;
	if(txtlen > maxlength)
	{
		text = text.split(' ');
	
		strlen = 0; j = 0; str = [];
		lastword = 0; i=0;
		while (j < Math.ceil(txtlen/maxlength))
		{
			for(i;strlen<maxlength;i++)
			{
				if(text[i] === undefined)
				{
					strlen = maxlength;
				}
				else
				{
					strlen = strlen + text[i].length;
					if(str[j] == null)
					{
						str[j] = text[i];
					}
					else
					{
						str[j] += '+'+text[i];
					}
				}
			}
			strlen = 0;
			j++;
		}
	}
	else
	{
		str[0] = text.split(' ').join('+');
	}
	return str;
}
/*
 * -----------------------------------------------------------------------------
 *  Get selected text don't work on iframes
 * -----------------------------------------------------------------------------
*/	
var selected = {"text": filterText(window.getSelection().toString())};
chrome.extension.sendRequest(selected); // Sendback the selected text