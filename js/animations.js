/*
 * -----------------------------------------------------------------------------
 * Functions for animating SpeakIt icon and displaying number of sentences
 * -----------------------------------------------------------------------------
*/	
var animationFrames = 36;
var animationSpeed = 10; // ms
var icon;
var iconContext;

icon = document.getElementById('canvas');
animationImage = document.getElementById('animation');
iconContext = icon.getContext('2d');

function ease(x)
{
	return (1-Math.sin(Math.PI/2+x*Math.PI))/2;
}

function drawIconAtRotation() 
{
	iconContext.save();
	iconContext.clearRect(0, 0, icon.width, icon.height);
	iconContext.translate(
	Math.ceil(icon.width/2),
	Math.ceil(icon.height/2));
	iconContext.rotate(2*Math.PI*ease(rotation));
	iconContext.drawImage(animationImage,
    -Math.ceil(icon.width/2),
    -Math.ceil(icon.height/2));
	iconContext.restore();

	chrome.browserAction.setIcon({imageData:iconContext.getImageData(0, 0,
	icon.width,icon.height)});
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
	if(number > 0)
	{
		chrome.browserAction.setBadgeText({text:number.toString()});
	}
	else
	{
		chrome.browserAction.setBadgeText({text:''});
	}
}