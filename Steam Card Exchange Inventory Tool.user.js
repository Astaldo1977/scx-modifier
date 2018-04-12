// ==UserScript==
// @name         Steam Card Exchange Inventory helper
// @namespace    https://www.steamgifts.com/user/astaldo
// @version      0.0.2
// @description  Only show the good hits
// @author       astaldo
// @match        https://www.steamcardexchange.net/bestSets
// @grant        GM_xmlhttpRequest
// @connect      self
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @updateURL    https://raw.githubusercontent.com/Astaldo1977/scx-modifier/master/Steam%20Card%20Exchange%20Inventory%20Tool.user.js
// @downloadURL  https://raw.githubusercontent.com/Astaldo1977/scx-modifier/master/Steam%20Card%20Exchange%20Inventory%20Tool.user.js
// ==/UserScript==


// item[3][2] marketable?
//    0 = Non-Marketable
//    1 = Last card price games
//    2 = Normal price games

function parseData(responseData){
    document.documentElement.innerHTML = '<table border="1" id="overview"><TH>Name</TH><TH>card price</TH><TH># of cards</TH></table>';
    var jsonData = jQuery.parseJSON(responseData).data;

    jsonData = jQuery.grep(jsonData, function( item ) {
        //martketable?
        if (item[3][2] != 2 ) return false;

        //setsAvailable > 1
        if (item[3][1] < item[3][0]) return false;

        //cardPrice = <6
        if(item[1] > 6) return false;

        //cardsInSet = item[3][0];
        if(item[3][0]> 6) return false;

        return true;
    });
    jsonData.sort(
        function(item1, item2){
            //cardPrice
            if(item1[1] != item2[1])
                return item1[1] - item2[1];
            //cardsInSet
            if(item1[3][0] != item2[3][0])
                return item1[3][0] - item2[3][0];

            //name
            return item1[0][1] - item2[0][1];
        });

    $.each(jsonData, function( index, item) {
        var tableRow = document.createElement('tr');
        var tdName = document.createElement('td');
        var linkName = document.createElement('a');
        var tdCardPrice = document.createElement('td');
        var tdCardsInSet = document.createElement('td');

        linkName.href = "https://www.steamcardexchange.net/index.php?inventorygame-appid-" + item[0][0];
        linkName.innerText = item[0][1];
        tdCardPrice.innerText = item[1];
        tdCardsInSet.innerText = item[3][0];

        tdName.append(linkName);
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
