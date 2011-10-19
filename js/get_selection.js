/*
 * SpeakIt GUI
 *
 * This file contains code that displays Grafical User Interface
 *
 * @package		SpeakIt
 * @category	GUI
 * @author		Trajche Petrov a.k.a SkechBoy
 * @link		https://github.com/skechboy/SpeakIt
 
 * -----------------------------------------------------------------------------
 *  Get selected text don't work on iframes and some ssl encrypted pages
 *  depends' on level of encryption of page certificate...
 *  Sorry for that but again is Google's fault, damn Chrome is the safest
 *  browser ever build :) 
 * -----------------------------------------------------------------------------
*/
chrome.extension.sendRequest({"text": window.getSelection().toString()});