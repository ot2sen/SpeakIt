/*
 * SpeakIt Core
 *
 * This file contains SpeakIt core functions 
 *
 * @package		SpeakIt
 * @category	Core
 * @author		Trajche Petrov a.k.a SkechBoy
 * @link		https://github.com/skechboy/SpeakIt
*/

/*
 * -----------------------------------------------------------------------------
 * Defining main background variables
 * -----------------------------------------------------------------------------
*/
	var i = 0,
		words = 0,
		audio = [],
		current = 0,
		debug = true, // make this true if you want to debug SpeakIt
		state = true,
		reloaded = [],
		datastack = [],
		textstack = [],
		gt = 'http://translate.google.com/translate_tts?tl=',// Google's TTS API
		options = JSON.parse(localStorage.getItem("options"));

/*
 * -----------------------------------------------------------------------------
 * Set default options
 * -----------------------------------------------------------------------------
*/
(function(){
	if(options == null)
	{
	  	options =
		{
			volume: 0.5,
			context: true,			
			donate : true,
			speechinput : false,
			hotkeys:"ctrl + shift + 83" // Ctrl+Shift+S default kb shortcut
		}
		localStorage.setItem("options", JSON.stringify(options));
		options = JSON.parse(localStorage.getItem("options"));
	}
	var volume = options.volume;
})();

/*
 * -----------------------------------------------------------------------------
 * This function is called onload in the popup code
 * -----------------------------------------------------------------------------
*/
function getPageInfo() 
{
	if(state)
	{
		// Injects the content script into the current page 
	    chrome.tabs.executeScript(null, { file: "js/content_script.js" });
	}
}; 

/*
 * -----------------------------------------------------------------------------
 * Play audio
 * -----------------------------------------------------------------------------
*/
function playAudio(channel,data,first,firstdata)
{
	current = channel;
	nextchannel = channel ? 0 : 1;
	if(first)
	{
		audio[channel].src = firstdata;
	}
	audio[channel].play();
	setVolume(volume);
	preloadAudio(nextchannel,data);
	words--;
	updateNumber(words);
}

/*
 * -----------------------------------------------------------------------------
 * Preloading next audio so the pause between 2 sentences is minimal
 * -----------------------------------------------------------------------------
*/
function preloadAudio(channel,data)
{
	if(data.search(/&q=undefined/i) == -1) // removing undefined bug :) 
	{
		if(debug) console.log('Preloading audio in channel: '+channel);
		datastack[channel] = data;
		audio[channel].src = data;
		audio[channel].preload = true;
		reloaded[channel] = 1;
	}
}

/*
 * -----------------------------------------------------------------------------
 * Functions for controlling audio
 * -----------------------------------------------------------------------------
*/
function pauseAudio() // Pause Audio
{
	state = true;
	audio[current].pause(); // pause current audio channel
	if(debug) console.log('Audio channel: '+current+' was paused.');	
}

function resumeAudio() // resume paused audio
{
	if(audio[current] !== undefined) // stupid bug but i'll fix that :) 
	{
		audio[current].play(); // resume paused audio channel
		if(debug) console.log('Audio channel: '+current+' was resumed.');		
	}
}

function replayAudio() // replay audio
{
	speakIt(textstack);
}

function setVolume(value) // set volume
{
	audio[0].volume = parseFloat(value); // Set volume on bouth channels
	audio[1].volume = parseFloat(value);
	volume = parseFloat(value);
	if(debug) console.log('Volume is set to'+parseFloat(value)+'%');
}

function showReplay() // shows replay button in popup.html
{
	state = true;
	var popups = chrome.extension.getViews({type: "popup"});
	if (popups.length != 0)
	{
		var popup = popups[0];
		popup.showReplay();
	}	
}

function sendDuration(channel) // Send audio duration to popup.html
{
	var popups = chrome.extension.getViews({type: "popup"});
	if (popups.length != 0)
	{
		var popup = popups[0];
		popup.displayProgress(audio[channel].duration);
		if(debug) console.log('Duration of audio in channel '+channel+' was sent. It is: '+audio[channel].duration+' seconds');
	}
}
/*
 * -----------------------------------------------------------------------------
 * Error handling functions
 * -----------------------------------------------------------------------------
*/
function handleError(channel)
{
	if(debug) console.log('Error in channel: '+channel);
	reloadAudio(channel);
}

function reloadAudio(channel)
{
	if(reloaded[channel] <= 3)
	{
		if(debug) console.log('Reloading channel: '+channel);
		audio[channel].src = datastack[channel];
		audio[channel].preload = true;
		reloaded[channel]++;
	}
	else
	{
		readingProblems();
	}
}

function readingProblems() // displays reading problems notification in popup
{
	state = true;
	var popups = chrome.extension.getViews({type: "popup"});
	if (popups.length != 0)
	{
		var popup = popups[0];
		popup.showError();
	}	
}

/*
 * -----------------------------------------------------------------------------
 * On contex menu click function
 * -----------------------------------------------------------------------------
*/
function contexMenu(selection)
{
	if(state)
	{
		audio[0] = new Audio(); // defining two new audo objects each time 
		audio[1] = new Audio();
		speakIt(filterText(selection.selectionText.toString()));
	}
}

/*
 * -----------------------------------------------------------------------------
 * Create context Menu
 * -----------------------------------------------------------------------------
*/
if(options.context)
{
	chrome.contextMenus.create({"title": "SpeakIt!", "contexts":["selection"],"onclick": contexMenu});	
}

/*
 * -----------------------------------------------------------------------------
 * Perform the callback when a request is received from the content script
 * -----------------------------------------------------------------------------
*/
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) 
{
	console.log(request);
	if(request.method === undefined)
	{
		text = filterText(request.text); // get selected and formated text
		if(text.length && text[0] != '') 
		{
			audio[0] = new Audio(); // defining two new audo objects each time 
			audio[1] = new Audio();
			speakIt(text);
		}
	}
	else
	{
		sendResponse({options: JSON.parse(localStorage.getItem("options"))});
	}
});

/*
 * -----------------------------------------------------------------------------
 * SpeakIt core function - Use It Wisely :) :) 
 * -----------------------------------------------------------------------------
*/
function speakIt(text)
{
	google.language.detect(text[0], function(result) // detect language
	{
    	if (!result.error)
		{
			i = 0; //reseting global variables
			current = 0;
			state = false;
			textstack = text;
			lang = result.language;
			url = gt+lang+'&q='; // assemble full TTS url
			words = text.length;
			
			playAudio(i,url+text[i+1],1,url+text[i]); // Start first audio
			
			//Audio event listeners
			audio[0].addEventListener("ended", function()
			{
				++i;
				if(i < text.length)
				{
					playAudio(1,url+text[i+1],0,'');
				}
				else
				{
					showReplay();
				}
			}, true);
			
			audio[1].addEventListener("ended", function() 
			{
				++i;
				if(i < text.length)
				{
					playAudio(0,url+text[i+1],0,'');
				}
				else
				{
					showReplay();
				}
			}, true);
			
			//Send audio duration when audio start to playing
			audio[0].addEventListener("playing", function() 
			{
				sendDuration(0);
			});
			audio[1].addEventListener("playing", function() 
			{
				sendDuration(1);
			});
			
			//On audio load error caused by Google bot protection
			audio[0].addEventListener("error", function() 
			{
				handleError(0);
			});	
			audio[1].addEventListener("error", function() 
			{
				handleError(1);
			});
			
			//On audio load error caused by Google bot protection
			audio[0].addEventListener("staled", function() 
			{
				handleError(0);
			});	
			audio[1].addEventListener("staled", function() 
			{
				handleError(1);
			});	
		}
		else
		{
			alert("Sorry SpeakIt couldn't detect the input language.")
		}
	});
}

/*
 * -----------------------------------------------------------------------------
 *  Function for filtering text from "bad" characters and preppare text
 *  for Google Text to Speech API
 * -----------------------------------------------------------------------------
*/	
function filterText(text)
{
	var str = [],
		maxlength = 70, // Max length of one sentence this is Google's fault :)
		badchars = ["+","#","@","-","<",">","\n","!","?",":","&",'"',"  "],
		replaces = ["+plus+","+sharp+","+at+","","","","",".",".",".","+and+","+quotes.+"," "];
		
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