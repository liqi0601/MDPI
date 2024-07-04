// ==UserScript==
// @name         Scopus-Modifier
// @version      1.4
// @icon64       https://cdn.elsevier.io/verona/includes/favicons/favicon-96x96.png
// @description  Modifies Scopus URLs to remove specific parameters and add functionality
// @author       Leif Assistant
// @match        https://www.scopus.com/authid/detail.uri?*
// @match        https://www2.scopus.com/authid/detail.uri?*
// @updateURL    https://raw.githubusercontent.com/liqi0601/MDPI/main/Scopus-Modifier.user.js
// @downloadURL  https://raw.githubusercontent.com/liqi0601/MDPI/main/Scopus-Modifier.user.js
// ==/UserScript==

(function() {
    'use strict';

    // List of parameters to remove
    const paramsToRemove = ['&origin=peoplefinder', '&origin=resultsAnalyzer&zone=authorName', '&origin=recordpage'];

    // Get the current URL
    let currentURL = window.location.href;

    // Replace "www2" with "www" if necessary
    if (currentURL.includes('www2.scopus.com')) {
        currentURL = currentURL.replace('www2.scopus.com', 'www.scopus.com');
    }

    // Remove specified parameters from the URL
    let newURL = currentURL;
    if (newURL.startsWith('https://www.scopus.com/authid/detail.uri?')) {
        paramsToRemove.forEach(param => {
            if (newURL.includes(param)) {
                newURL = newURL.replace(param, '');
            }
        });

        // If the URL was modified, navigate to the new URL
        if (newURL !== currentURL) {
            window.location.href = newURL;
        }
    }

    // Check if the URL contains 'origin=resultslist' and 'authorId='
    if (currentURL.includes('origin=resultslist') && currentURL.includes('authorId=')) {
        const urlParams = new URLSearchParams(currentURL.split('?')[1]);
        const authorId = urlParams.get('authorId');
        if (authorId) {
            const newURL = `https://www.scopus.com/authid/detail.uri?authorId=${authorId}`;
            window.location.href = newURL;
            return; // Stop further execution as we are navigating to the new URL
        }
    }

    // Function to create and display the button, email container, and h-index container
    function createButtonAndContainers() {
        // Create button
        const button = document.createElement('button');
        button.textContent = 'Details';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        // Create email container
        const emailContainer = document.createElement('div');
        emailContainer.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            max-width: 300px;
            text-align: center;
        `;

        // Create h-index container
        const hindexContainer = document.createElement('div');
        hindexContainer.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            max-width: 300px;
            text-align: center;
        `;

        // Create email and h-index text elements
        const emailText = document.createElement('span');
        const hindexText = document.createElement('span');

        // Create copy hint
        const copyHint = document.createElement('div');
        copyHint.textContent = 'Click to copy';
        copyHint.style.cssText = `
            display: none;
            font-size: 12px;
            color: #555;
        `;

        // Email container mouse events
        emailContainer.onmouseover = () => {
            copyHint.style.display = 'block';
        };
        emailContainer.onmouseout = () => {
            copyHint.style.display = 'none';
        };

        // Email container click event
        emailContainer.onclick = () => {
            const email = emailText.textContent;
            if (email !== 'null' && email !== 'Error fetching email') {
                navigator.clipboard.writeText(email).then(() => {
                    copyHint.textContent = 'Copied!';
                    setTimeout(() => {
                        copyHint.textContent = 'Click to copy';
                    }, 2000);
                }).catch(err => {
                    console.error('Error copying text: ', err);
                });
            } else {
                copyHint.textContent = 'No valid email to copy';
                setTimeout(() => {
                    copyHint.textContent = 'Click to copy';
                }, 2000);
            }
        };

        // Button click event
        button.onclick = (event) => {
            const apiUrl = currentURL.replace('https://www.scopus.com/authid/detail.uri?authorId=', 'https://www.scopus.com/api/authors/');
            if (event.ctrlKey) {
                event.preventDefault();
                window.open(apiUrl, '_blank');
            } else {
                window.location.href = apiUrl;
            }
        };

        // Append elements to the document body
        document.body.appendChild(button);
        document.body.appendChild(emailContainer);
        document.body.appendChild(hindexContainer);
        emailContainer.appendChild(emailText);
        emailContainer.appendChild(copyHint);
        hindexContainer.appendChild(hindexText);

        // Log to console to confirm button creation
        console.log('Details button, email container, h-index container, and copy hint created');

        // Fetch the email address and h-index
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                emailText.textContent = data.emailAddress ? data.emailAddress : 'null';
                hindexText.textContent = `h-index: ${data.hindex ? data.hindex : 'null'}`;
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
