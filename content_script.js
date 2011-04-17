// Object to hold information about the current page
function filterText(text)
{

	var maxlength = 90;
	var badchars = ["#","@","-","<",">","\n","!","?","&",'"',"  "];
	var replaces = ["","","","","","","","","","+and+",""," "]
	for(var i in badchars)
	{
		text = text.split(badchars[i]).join(replaces[i]);		
	}

	txtlen = text.length;
	if(txtlen > maxlength)
	{
		text = text.split(' ');
	
		strlen = 0; j = 0; str = [];
		lastword = 0; i=0;
		while (j < Math.floor(txtlen/maxlength))
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

var selected = {"text": filterText(window.getSelection().toString()),"unfiltered": window.getSelection().toString()};
// Send the information back to the extension
chrome.extension.sendRequest(selected);