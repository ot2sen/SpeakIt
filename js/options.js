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
		hotkeys = document.getElementById("hotkeys"),
		donate = document.getElementById("donate"),
		context = document.getElementById("context"),
		speechinput = document.getElementById("speechinput");
		

/*
 * -----------------------------------------------------------------------------
 * Show info that chrome restart is required
 * -----------------------------------------------------------------------------
*/
	context.addEventListener('click', function()
	{
		document.getElementById("contx_info").style.display = "block";
	});
	
	hotkeys.addEventListener("keydown", keyDown, false);
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
		hotkeys: hotkey
	}
	localStorage.setItem("options", JSON.stringify(options));
	
	var tip = document.getElementById('tip');
	tip.innerHTML = "Your settings were successfully saved."
	tip.style.display = "block";
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
}

function getHotkeys(keys)
{
	return keys.substr(0,keys.lastIndexOf('+')+2)+CharCode(keys.substr(keys.lastIndexOf('+')+2,2));	
}

function CharCode(code)
{
	return String.fromCharCode(code).toLowerCase();		
}
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