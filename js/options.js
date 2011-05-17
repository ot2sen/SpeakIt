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
		donate : document.getElementById("donate").checked,
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
	var options = JSON.parse(localStorage.getItem("options"));
	document.getElementById("donate").checked = options.donate;
}