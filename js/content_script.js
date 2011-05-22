/*
 * -----------------------------------------------------------------------------
 *  Get selected text don't work on iframes
 * -----------------------------------------------------------------------------
*/	
var selected = {"text": window.getSelection().toString()};
chrome.extension.sendRequest(selected); // Sendback the selected text