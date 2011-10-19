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
		rate = document.getElementById("rate"),
		test = document.getElementById("test"),
		rateps = document.getElementById("rateps"),
		pitch = document.getElementById("pitch"),
		voice = document.getElementById("voice"),
		bg = chrome.extension.getBackgroundPage(),	
		paypal = document.getElementById("paypal"),
		donate = document.getElementById("donate"),
		volume = document.getElementById("volume"),
		context = document.getElementById("context"),
		words = document.getElementById("words"),
		voices = document.getElementById("lang_voices"),
		hotkeys = document.getElementById("hotkeys"),
		enqueue = document.getElementById("enqueue"),
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

	test.addEventListener('click', function() //test listener
	{
		chrome.tts.speak
		(
			document.getElementById("testtext").value,
			{
				voiceName: voice.value,
				enqueue: Boolean(enqueue.checked),
		        rate: parseFloat(rate.value),
				pitch: parseFloat(pitch.value),
				volume: parseFloat(volume.value/100)
			}
		);
	});

	paypal.addEventListener('click', function()
	{
		// redirect's to paypal donation page all donations are welcomed :) :)
		chrome.tabs.create({url: 'http://goo.gl/zACwV'});		
	});

	voice.addEventListener('change', function()
	{
		// Show additional options
		if(this.value != 'SpeakIt!')
		{
			document.getElementById("moreoptions").style.display = 'block';				
		}
		else
		{
			document.getElementById("moreoptions").style.display = 'none';				
		}
	});
	
	voices.addEventListener('click', function()
	{
		// redirect's to Chrome Webstore for new TTS engines
		chrome.tabs.create({url: 'http://goo.gl/dU9tB'});		
	});

	hotkeys.addEventListener("keydown", keyDown, false); // keyboard shortcuts
	
	volume.addEventListener('change', function() // display volume level
	{
		percents.innerHTML = parseInt(this.value)+' %';
	}, false);
	
	rate.addEventListener('change', function() // display rate
	{
		rateps.innerHTML = 'x'+parseFloat(this.value).toFixed(2);
		words.innerHTML = Math.round(this.value*200);
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
		rate :  rate.value,
		voice :  voice.value,
		pitch :  pitch.value,
		enqueue :  enqueue.checked,
		donate :  donate.checked,
		speechinput : speechinput.checked,
		context: context.checked,
		hotkeys: hotkey,
		volume : parseFloat(volume.value/100)
	}
	localStorage.setItem("options", JSON.stringify(options));
	
	bg.setVolume(parseFloat(volume.value/100));
	var tip = document.getElementById('tip');
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
	enqueue.checked = options.enqueue;
	hotkey_value = getHotkeys(options.hotkeys);
	hotkeys.value = hotkey_value;
	hotkey = options.hotkeys;
	
	rate.value = options.rate;
	pitch.value = options.pitch;
	volume.value = parseInt(options.volume*100);
	percents.innerHTML = volume.value+' %';
	rateps.innerHTML = 'x'+rate.value
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

/*
 * -----------------------------------------------------------------------------
 * Load extension localized messages and descriptions
 * -----------------------------------------------------------------------------
*/
function setLocales()
{
	locales = document.getElementsByClassName('locale');
	locales = Array.prototype.slice.call(locales);
	
	for(i=0;locales.length;i++)
	{
		if(locales[i] === undefined) break; //Fix 4 Uncaught error
		locales[i].innerHTML = chrome.i18n.getMessage(locales[i].id);		
	}
}

/*
 * -----------------------------------------------------------------------------
 * Get avalible TTS engines
 * -----------------------------------------------------------------------------
*/
function getVoices()
{
	var voice = document.getElementById('voice');
	var voiceArray = [];
	chrome.tts.getVoices(function(va)
	{
		voiceArray = va;
		for (var i = 0; i < voiceArray.length; i++)
		{
			var opt = document.createElement('option');
			var name = voiceArray[i].voiceName;
			
			if (name == options.voice)
			{
				opt.setAttribute('selected', '');
			}
			opt.setAttribute('value', name);
			opt.innerText = voiceArray[i].voiceName;
			voice.appendChild(opt);
		}
		if(options.voice != 'SpeakIt!')
		{
			document.getElementById("moreoptions").style.display = 'block';	
		}
	});
}

/*
 * -----------------------------------------------------------------------------
 * Init main options variables and methods
 * -----------------------------------------------------------------------------
*/
(function(){
	getVoices();
	setLocales();
})();