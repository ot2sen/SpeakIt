/*
 * SpeakIt GUI
 *
 * This file contains code that displays Grafical User Interface
 *
 * @package		SpeakIt
 * @category	GUI
 * @author		Trajche Petrov a.k.a SkechBoy
 * @link		https://github.com/skechboy/SpeakIt
 */

/*
 * -----------------------------------------------------------------------------
 * Defining main variables 
 * -----------------------------------------------------------------------------
*/
	var prevstate = 0;
	var status = 'pause'; // audio state
	var bg = chrome.extension.getBackgroundPage(); // get background page
	var button = document.getElementById('button');
	var canvas = document.getElementById('volume');
	var error = document.getElementById('error');
	var donate = document.getElementById('donate');
	var replaybtn = document.getElementById("replay");
	var options = JSON.parse(localStorage.getItem("options"));

/*
 * -----------------------------------------------------------------------------
 * Event listeners
 * -----------------------------------------------------------------------------
*/
	canvas.addEventListener('click', function() // Volume adjustment
	{
		volume = calculateVolume(event.clientX,event.clientY);
		drawVolume(volume);
	    bg.setVolume(parseFloat(volume));
	}, false);

	button.addEventListener('click', function() // Audio state
	{
		onClick(false);
	}, false);
	
	replaybtn.addEventListener('click', function() // Audio state
	{
		bg.replayAudio();
	}, false);
	
	error.addEventListener('click', function()
	{
		// goes to Google TTS API and check if human confirmation is required 
		chrome.tabs.create({url: 'http://goo.gl/OOVgp'});
	}, false);
	
	donate.addEventListener('click', function()
	{
		// redirect's to paypal donation page all donations are welcomed :) :)
		chrome.tabs.create({url: 'http://goo.gl/zACwV'});		
	});

/*
 * -----------------------------------------------------------------------------
 * Manipulating onClick button event
 * -----------------------------------------------------------------------------
*/
function onClick(replay) 
{
	var zen = document.getElementById("zen");
	var circle = document.getElementById("circle");
	var playbtn = document.getElementById("play");
	
	if(replay)
	{
		replaybtn.style.display = "block";
		playbtn.style.display = "none";
		status = "replay";
		circle.className = "circle rotate";
		zen.className = "replay";
	}
	else
	{
		playbtn.style.display = "block";
		replaybtn.style.display = "none";
		
		if(status != "play")
		{
			status = "play";
			circle.className = "circle rotate";
			zen.className = "play";
			bg.resumeAudio();
		}
		else 
		{
			circle.className = "circle"
			zen.className = "";
			status = "pause";
			bg.pauseAudio();
		}
	}
};

/*
 * -----------------------------------------------------------------------------
 * Functions for controlling audio
 * -----------------------------------------------------------------------------
*/
function displayProgress(seconds) 
{
	prevstate++;
	progress.style['-webkit-transition-duration'] = seconds+'s';
	deg = 360*prevstate;
	progress.style.webkitTransform = "rotate("+deg+"deg)";
}

/*
 * -----------------------------------------------------------------------------
 * Show error information
 * -----------------------------------------------------------------------------
*/
function showError()
{
	error.style.display = "block";
}

/*
 * -----------------------------------------------------------------------------
 * Function for showing replay button
 * -----------------------------------------------------------------------------
*/
function showReplay()
{
	onClick(true);
}

/*
 * -----------------------------------------------------------------------------
 * Draw volume level in canvas element
 * -----------------------------------------------------------------------------
*/
function drawVolume(volume)
{
	var radius = 58;
	canvas.width = canvas.width; // clear canvas and preppare for new drawing
	var context = canvas.getContext('2d');
	var canvas_size = [canvas.width, canvas.height];
	var center = [canvas_size[0]/2, canvas_size[1]/2];
	
	context.beginPath();
	context.moveTo(center[0], center[1]); // center of the pie
	
	context.arc // draw volume
	(  
		center[0],
		center[1],
		radius,
		0, // 0 sets set the start to be top
		Math.PI * (2 * (volume)),
		false
    );

    context.lineTo(center[0], center[1]); // line back to the center
    context.closePath();
    var rad = context.createRadialGradient(center[0], center[1], 50, center[0], center[1], 60);
    rad.addColorStop(0, '#669933');
    rad.addColorStop(1, '#99CC00');
    context.fillStyle = rad;
    context.fill();
}

/*
 * -----------------------------------------------------------------------------
 * Calculating aduio volume by point coordinates selected by user
 * -----------------------------------------------------------------------------
*/
function calculateVolume(x,y)
{
	x = x-(window.innerWidth/2);
	y = (y-75)*-1;
	
	radius = Math.sqrt((x*x )+(y*y));
	
	if(x > 0 && y >= 0) // detecting angle quadrand
	{
		angle = Math.asin(Math.abs(y)/radius)*(180/Math.PI);		
	}
	else if(x < 0 && y >= 0)
	{
		angle = 180-(Math.asin(Math.abs(y)/radius)*(180/Math.PI));		
	}
	else if(x <= 0 && y < 0)
	{
		angle = 180+(Math.asin(Math.abs(y)/radius)*(180/Math.PI));
	}
	else
	{
		angle = 360-(Math.asin(Math.abs(y)/radius)*(180/Math.PI));
	}
	volume = 1-(angle/360);

	return volume;
}

/*
 * -----------------------------------------------------------------------------
 * Display donations button if it's not disabled from options
 * -----------------------------------------------------------------------------
*/
function showDonations()
{
	if(options == null || !options.donate)
	{
		donate.style.display = "block";		
	}
}

/*
 * -----------------------------------------------------------------------------
 * Initalization on main and background functions
 * -----------------------------------------------------------------------------
*/
	showDonations();
	bg.getPageInfo(); // invoke SpeakIt main function
	chrome.browserAction.setBadgeText({text:''});
	onClick(false);
	drawVolume(0.5);