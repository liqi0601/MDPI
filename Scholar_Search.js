// ==UserScript==
// @name         Scopus Scholar Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get author's name from Scopus, search on Google Scholar and Google with institution info
// @author       LQ
// @match        https://www.scopus.com/authid/detail.uri?authorId=*
// @updateURL    https://raw.githubusercontent.com/liqi0601/MDPI/refs/heads/main/Scholar_Search.js
// @downloadURL  https://raw.githubusercontent.com/liqi0601/MDPI/refs/heads/main/Scholar_Search.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clean and reorder author name
    function cleanAuthorName(authorName) {
        // Remove commas and reorder the name if there's a comma
        if (authorName.includes(',')) {
            const parts = authorName.split(',').map(part => part.trim());
            return `${parts[1]} ${parts[0]}`; // Switch the order after removing comma
        }
        return authorName;
    }

    // Function to get institution name
    function getInstitution() {
        const institutionElement = document.querySelector('[data-testid="authorInstitution"] span.Typography-module__lVnit');
        if (institutionElement) {
            return institutionElement.textContent;
        }
        return '';
    }

    // Function to create and display the buttons
    function createButtons() {
        // Scholar search button
        var scholarButton = document.createElement('button');
        scholarButton.textContent = 'Scholar';
        scholarButton.style.position = 'fixed';
        scholarButton.style.top = '120px';
        scholarButton.style.left = '47%';
        scholarButton.style.transform = 'translateX(-50%)';
        scholarButton.style.zIndex = '10000';
        scholarButton.style.padding = '10px 20px';
        scholarButton.style.fontSize = '16px';
        scholarButton.style.backgroundColor = '#4CAF50';
        scholarButton.style.color = 'white';
        scholarButton.style.border = 'none';
        scholarButton.style.borderRadius = '5px';
        scholarButton.style.cursor = 'pointer';
        scholarButton.style.marginRight = '10px';

        // Search button
        var searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.style.position = 'fixed';
        searchButton.style.top = '120px';
        searchButton.style.left = '53%';
        searchButton.style.transform = 'translateX(-50%)';
        searchButton.style.zIndex = '10000';
        searchButton.style.padding = '10px 20px';
        searchButton.style.fontSize = '16px';
        searchButton.style.backgroundColor = '#4CAF50';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '5px';
        searchButton.style.cursor = 'pointer';
        searchButton.style.marginLeft = '10px';

        // Scholar button functionality: fetch author name, clean it, and search on Google Scholar
        scholarButton.onclick = function() {
            var authorNameElement = document.querySelector('h1[data-testid="author-profile-name"] strong');
            if (authorNameElement) {
                var authorName = cleanAuthorName(authorNameElement.textContent);
                var scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(authorName)}`;
                window.open(scholarUrl, '_blank');
            } else {
                console.error('Author name not found');
            }
        };

        // Search button functionality: fetch author name and institution, then search on Google
        searchButton.onclick = function() {
            var authorNameElement = document.querySelector('h1[data-testid="author-profile-name"] strong');
            var institution = getInstitution();
            if (authorNameElement && institution) {
                var authorName = cleanAuthorName(authorNameElement.textContent);
                var searchQuery = `${authorName}, ${institution}`; // Add comma between name and institution
                var searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
                window.open(searchUrl, '_blank');
            } else {
                console.error('Author name or institution not found');
            }
        };

        // Append buttons to the document body
        document.body.appendChild(scholarButton);
        document.body.appendChild(searchButton);

        // Log confirmation
        console.log('Scholar and Search buttons created');
    }

    // Wait for the page to load and then create the buttons
    window.addEventListener('load', createButtons);
})();
