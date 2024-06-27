// ==UserScript==
// @name         Scopus-Modifier
// @namespace    http://leif.qi/scopus
// @version      2.0.2
// @description  Modifies Scopus URLs to remove specific parameters
// @author       Leif Assistant
// @match        https://www.scopus.com/authid/detail.uri?*
// @match        https://www2.scopus.com/authid/detail.uri?*
// @updateURL    https://raw.githubusercontent.com/liqi0601/MDPI/main/Scopus-Modifier.user.js
// @downloadURL  https://raw.githubusercontent.com/liqi0601/MDPI/main/Scopus-Modifier.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // List of parameters to remove
    var paramsToRemove = ['&origin=peoplefinder', '&origin=resultsAnalyzer&zone=authorName', '&origin=recordpage'];

    // Get the current URL
    var currentURL = window.location.href;
    var newURL = currentURL;

    // Check if the URL starts with "https://www2.scopus.com/authid/detail.uri?authorId="
    if (currentURL.startsWith('https://www2.scopus.com/authid/detail.uri?authorId=')) {
        // Replace "www2" with "www"
        newURL = newURL.replace('www2.scopus.com', 'www.scopus.com');
    }

    // Check if the URL starts with "https://www.scopus.com/authid/detail.uri?"
    if (newURL.startsWith('https://www.scopus.com/authid/detail.uri?')) {
        // Loop through the list of parameters to remove
        paramsToRemove.forEach(function(param) {
            // Check if the URL contains the current parameter
            if (newURL.includes(param)) {
                // Remove the current parameter from the URL
                newURL = newURL.replace(param, '');
            }
        });

        // If the URL was modified, navigate to the new URL
        if (newURL !== currentURL) {
            window.location.href = newURL;
        }
    }

    // Function to create and display the button, email container, and h-index container
    function createButtonAndContainers() {
        var button = document.createElement('button');
        button.textContent = 'Details';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.zIndex = '10000';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        var emailContainer = document.createElement('div');
        emailContainer.style.position = 'fixed';
        emailContainer.style.top = '50px';
        emailContainer.style.left = '50%';
        emailContainer.style.transform = 'translateX(-50%)';
        emailContainer.style.zIndex = '10000';
        emailContainer.style.padding = '10px 20px';
        emailContainer.style.fontSize = '16px';
        emailContainer.style.backgroundColor = '#f0f0f0';
        emailContainer.style.color = '#333';
        emailContainer.style.border = '1px solid #ccc';
        emailContainer.style.borderRadius = '5px';
        emailContainer.style.maxWidth = '300px';
        emailContainer.style.textAlign = 'center';

        var hindexContainer = document.createElement('div');
        hindexContainer.style.position = 'fixed';
        hindexContainer.style.top = '120px';
        hindexContainer.style.left = '50%';
        hindexContainer.style.transform = 'translateX(-50%)';
        hindexContainer.style.zIndex = '10000';
        hindexContainer.style.padding = '10px 20px';
        hindexContainer.style.fontSize = '16px';
        hindexContainer.style.backgroundColor = '#f0f0f0';
        hindexContainer.style.color = '#333';
        hindexContainer.style.border = '1px solid #ccc';
        hindexContainer.style.borderRadius = '5px';
        hindexContainer.style.maxWidth = '300px';
        hindexContainer.style.textAlign = 'center';

        var emailText = document.createElement('span');
        var hindexText = document.createElement('span');

        var copyHint = document.createElement('div');
        copyHint.textContent = 'Click to copy';
        copyHint.style.display = 'none';
        copyHint.style.fontSize = '12px';
        copyHint.style.color = '#555';

        emailContainer.onmouseover = function() {
            copyHint.style.display = 'block';
        };

        emailContainer.onmouseout = function() {
            copyHint.style.display = 'none';
        };

        emailContainer.onclick = function() {
            var email = emailText.textContent;
            if (email !== 'null' && email !== 'Error fetching email') {
                navigator.clipboard.writeText(email).then(function() {
                    copyHint.textContent = 'Copied!';
                    setTimeout(function() {
                        copyHint.textContent = 'Click to copy';
                    }, 2000);
                }, function(err) {
                    console.error('Error copying text: ', err);
                });
            } else {
                copyHint.textContent = 'No valid email to copy';
                setTimeout(function() {
                    copyHint.textContent = 'Click to copy';
                }, 2000);
            }
        };

        button.onclick = function(event) {
            var newUrlForButton = currentURL.replace('https://www.scopus.com/authid/detail.uri?authorId=', 'https://www.scopus.com/api/authors/');
            if (event.ctrlKey) {
                // Ctrl+click opens in a new tab
                event.preventDefault(); // Prevent default button behavior
                window.open(newUrlForButton, '_blank');
            } else {
                // Regular click opens in the current tab
                window.location.href = newUrlForButton;
            }
        };


        document.body.appendChild(button);
        document.body.appendChild(emailContainer);
        document.body.appendChild(hindexContainer);
        emailContainer.appendChild(emailText);
        emailContainer.appendChild(copyHint);
        hindexContainer.appendChild(hindexText);

        // Log to console to confirm button creation
        console.log('Details button, email container, h-index container, and copy hint created');

        // Fetch the email address and h-index
        var apiUrl = currentURL.replace('https://www.scopus.com/authid/detail.uri?authorId=', 'https://www.scopus.com/api/authors/');
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                var email = data.emailAddress ? data.emailAddress : 'null';
                var hindex = data.hindex ? data.hindex : 'null';
                emailText.textContent = `${email}`;
                hindexText.textContent = `h-index: ${hindex}`;
            })
            .catch(error => {
                emailText.textContent = 'Error fetching email';
                hindexText.textContent = 'Error fetching h-index';
                console.error('Error:', error);
            });
    }

    // Ensure the button and email container are created after the page is fully loaded
    window.addEventListener('load', createButtonAndContainers);
})();
