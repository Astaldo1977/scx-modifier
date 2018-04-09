// ==UserScript==
// @name         Steam Card Exchange Inventory Tool
// @namespace    https://www.steamgifts.com/user/astaldo
// @version      0.0.1
// @description  Only show the good hits
// @author       astaldo
// @match        https://www.steamcardexchange.net/astaldo
// @grant        GM_xmlhttpRequest
// @connect      self
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @updateURL    https://raw.githubusercontent.com/Astaldo1977/scx-modifierd/master/Steam%20Card%20Exchange%20Inventory%20Tool.user.js
// @downloadURL  https://raw.githubusercontent.com/Astaldo1977/scx-modifier/master/Steam%20Card%20Exchange%20Inventory%20Tool.user.js
// ==/UserScript==

function parseData(responseData){
    var jsonData = jQuery.parseJSON(responseData).data;

    jsonData = jQuery.grep(jsonData, function( item ) {
        //setsAvailable > 1
        if (item[3][2] <= 1 ) return false;

        //cardPrice = <6
        if(item[1] > 6) return false;

        var cardsInSet = item[3][0];
        if(item[3][0]> 6) return false;

        return true;
    });
    $.each(jsonData, function( index, item) {
        console.log(item[0][1]);
    });
}
function parseSingleElement(item){
    console.log(item);
    var setsAvailable = item[3][2];
    if(setsAvailable <= 1) return;

    var cardPrice = item[1];
    if(cardPrice > 6) return;

    var cardsInSet = item[3][0];
    if(cardsInSet > 6) return;

    var name = item[0][1];
    console.log(name);
}
var errorFunction = function(response) {
    console.log("Error details: ", response.status, response.responseText);
};
(function() {
    'use strict';
    GM_xmlhttpRequest({
        "method": "GET",
        "url": "https://www.steamcardexchange.net/api/request.php?GetInventory",
        "onload": function(response) {
            if(response.status == 200){
                parseData(response.responseText);
            }
        },
        "onabort": errorFunction,
        "onerror": errorFunction,
        "ontimeout": errorFunction
    });
})();
