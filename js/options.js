/*
 * SpeakIt Options
 *
 * This file contains user options funcrions
 *
 * @package		SpeakIt
 * @category	Options
 * @author		Trajche Petrov a.k.a SkechBoy
 * @link		https://github.com/skechboy/SpeakIt
 */
	var hotkey = "",
		bg = chrome.extension.getBackgroundPage(),
		paypal = document.getElementById("paypal"),
		donate = document.getElementById("donate"),
		volume = document.getElementById("volume"),
		context = document.getElementById("context"),
		hotkeys = document.getElementById("hotkeys"),
		percents = document.getElementById("percents"),
		speechinput = document.getElementById("speechinput");
		

/*
 * -----------------------------------------------------------------------------
 * Event listeners
 * -----------------------------------------------------------------------------
*/
	context.addEventListener('click', function() //show that restart is requred
	{
		toggle("contx_info");
	});
	
	donate.addEventListener('click', function() // togle paypal info
	{
		toggle("paypalinfo");
	});

	paypal.addEventListener('click', function()
	{
		// redirect's to paypal donation page all donations are welcomed :) :)
		chrome.tabs.create({url: 'http://goo.gl/zACwV'});		
	});

	hotkeys.addEventListener("keydown", keyDown, false); // keyboard shortcuts
	
	volume.addEventListener('change', function() // display volume level
	{
		percents.innerHTML = parseInt(this.value)+' %';
	}, false);
/*
 * -----------------------------------------------------------------------------
 * Check if Local Storage is avalible
 * -----------------------------------------------------------------------------
*/
function checkLocalStorage()
{
	if (window.localStorage == null) 
	{
		alert("LocalStorage must be enabled for changing options.");
		return false;
	}
	return true;
}

/*
 * -----------------------------------------------------------------------------
 * Save user defined options
 * -----------------------------------------------------------------------------
*/
function save_options()
{
	
	if(!checkLocalStorage()) return;

	localStorage.clear();

  	var options =
	{
		donate :  donate.checked,
		speechinput : speechinput.checked,
		context: context.checked,
		hotkeys: hotkey,
		volume : parseFloat(volume.value/100)
	}
	localStorage.setItem("options", JSON.stringify(options));
	
	bg.setVolume(parseFloat(volume.value/100));
	var tip = document.getElementById('tip');
	tip.innerHTML = "Your settings were successfully saved."
	tip.style.display = "block";
	setTimeout("toggle(\"tip\")",3000);
}

/*
 * -----------------------------------------------------------------------------
 * Get user defined options
 * -----------------------------------------------------------------------------
*/
function restore_options()
{
	options = JSON.parse(localStorage.getItem("options"));
	donate.checked = options.donate;
	speechinput.checked = options.speechinput;
	context.checked = options.context;
	hotkey_value = getHotkeys(options.hotkeys);
	hotkeys.value = hotkey_value;
	hotkey = options.hotkeys;
	volume.value = parseInt(options.volume*100);
	percents.innerHTML = volume.value+' %';
	if(!options.donate)
	{
		document.getElementById("paypalinfo").style.display = "block";
	}
}

/*
 * -----------------------------------------------------------------------------
 * Get user defined keyboard shortcut
 * -----------------------------------------------------------------------------
*/
function getHotkeys(keys)
{
	return keys.substr(0,keys.lastIndexOf('+')+2)+CharCode(keys.substr(keys.lastIndexOf('+')+2,2));	
}

/*
 * -----------------------------------------------------------------------------
 * Convert's char code to char
 * -----------------------------------------------------------------------------
*/
function CharCode(code)
{
	return String.fromCharCode(code).toLowerCase();		
}

/*
 * -----------------------------------------------------------------------------
 * Save user defined options
 * -----------------------------------------------------------------------------
*/
function keyDown(e)
{
	out = "";
	if(e.ctrlKey) out += "ctrl + ";
	if(e.shiftKey) out += "shift + ";
	if(e.altKey) out += "alt + ";
	if(e.metaKey) out += "meta + ";

	code = e.keyCode;
	code = code == 16 ||code == 17 ||code == 18?null:code;
	e.target.value = out + CharCode(code);
	hotkey = out + code;
	e.preventDefault();
	return false;
}

/*
 * -----------------------------------------------------------------------------
 * Togle's specified div element
 * -----------------------------------------------------------------------------
*/
function toggle(id)
{
       var elem = document.getElementById(id);
       if(elem.style.display == 'block')
          elem.style.display = 'none';
       else
          elem.style.display = 'block';
}