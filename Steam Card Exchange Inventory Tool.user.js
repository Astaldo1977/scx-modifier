// ==UserScript==
// @name         Steam Card Exchange Inventory Helper
// @namespace    https://www.steamgifts.com/user/astaldo
// @version      0.0.1
// @description  Only show the good hits
// @author       astaldo
// @match        https://www.steamcardexchange.net/astaldo
// @grant        GM_xmlhttpRequest
// @connect      self
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @updateURL    https://raw.githubusercontent.com/Astaldo1977/scx-modifier/master/Steam%20Card%20Exchange%20Inventory%20Tool.user.js
// @downloadURL  https://raw.githubusercontent.com/Astaldo1977/scx-modifier/master/Steam%20Card%20Exchange%20Inventory%20Tool.user.js
// ==/UserScript==

function parseData(responseData){
    document.documentElement.innerHTML = '<table border="0" id="overview"></table>';
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
        var tableRow = document.createElement('tr');
        var tdName = document.createElement('td');
        var tdCardPrice = document.createElement('td');
        var tdCardsInSet = document.createElement('td');

        tdName.innerText =item[0][1];
        tdCardPrice.innerText =item[1];
        tdCardsInSet.innerText = item[3][0];

        tableRow.append(tdName);
        tableRow.append(tdCardPrice);
        tableRow.append(tdCardsInSet);
        $('#overview').append(tableRow);
    });
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
