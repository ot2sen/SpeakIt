var animationFrames = 36;
var animationSpeed = 10; // ms
var rotation = 0;
var canvas;
var canvasContext;
var gt = 'http://translate.google.com/translate_tts?tl=';
var audio = [];
audio[0] = new Audio();
audio[1] = new Audio();
var words = 0;
var current = 0;

canvas = document.getElementById('canvas');
loggedInImage = document.getElementById('logged_in');
canvasContext = canvas.getContext('2d');

// This function is called onload in the popup code
function getPageInfo() 
{ 
	// Injects the content script into the current page 
    chrome.tabs.executeScript(null, { file: "content_script.js" }); 
}; 

//Icon animation functions
function ease(x) {
  return (1-Math.sin(Math.PI/2+x*Math.PI))/2;
}

function drawIconAtRotation() 
{
  canvasContext.save();
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.translate(
      Math.ceil(canvas.width/2),
      Math.ceil(canvas.height/2));
  canvasContext.rotate(2*Math.PI*ease(rotation));
  canvasContext.drawImage(loggedInImage,
      -Math.ceil(canvas.width/2),
      -Math.ceil(canvas.height/2));
  canvasContext.restore();

  chrome.browserAction.setIcon({imageData:canvasContext.getImageData(0, 0,
      canvas.width,canvas.height)});
}

function animateFlip()
{
	rotation += 1/animationFrames;
	drawIconAtRotation();

	if (rotation <= 1)
	{
		setTimeout("animateFlip()", animationSpeed);
	} 
}

function updateNumber(number)
{
	rotation = 0;
	animateFlip();
	if(number > 1)
	{
		chrome.browserAction.setBadgeText({text:number.toString()});
	}
	else
	{
		chrome.browserAction.setBadgeText({text:''});
	}
}

function playAudio(channel,data,first,firstdata)
{
	current = channel;
	nextchannel = channel ? 0 : 1;
	if(first)
	{
		audio[channel].src = firstdata;
	}
	audio[channel].play();
	setVolume(0.5);
	preloadAudio(nextchannel,data);
	updateNumber(words);
	words--;
}

function preloadAudio(channel,data)
{
	audio[channel].src = data;
	audio[channel].preload = true;
}

function pauseAudio()
{
	audio[current].pause();
}

function resumeAudio()
{
	audio[current].play();
}

function setVolume(value)
{
	audio[0].volume = parseFloat(value);
	audio[1].volume = parseFloat(value);
}

// Perform the callback when a request is received from the content script
chrome.extension.onRequest.addListener(function(request) 
{ 


/* Using this for testing 
	
	for( var i in request.text)
	{
		alert(request.text[i]);
	}
			
*/
	text = request.text;
	if(text.length > 0) 
	{
		google.language.detect(text[0], function(result) 
		{
    		if (!result.error)
			{
				lang = result.language;
				url = gt+lang+'&q=';
				words = text.length;
				
				var i = 0;
				playAudio(i,url+text[i+1],1,url+text[i]);
				
				audio[0].addEventListener("ended", function() 
				{
					i++;
					if(i < text.length)
					{
						playAudio(1,url+text[i+1],0,'');
					}
				}, true);
				
				audio[1].addEventListener("ended", function() 
				{
					i++;
					if(i < text.length)
					{
						playAudio(0,url+text[i+1],0,'');
					}
				}, true);
			}
			else
			{
				alert("Sorry SpeakIt couldn't detect the input language.")
			}
		});
	}
}); 