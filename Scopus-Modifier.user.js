// ==UserScript==
// @name         Scopus-Modifier
// @version      1.4
// @icon64       https://cdn.elsevier.io/verona/includes/favicons/favicon-96x96.png
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
    var paramsToRemove = ['&origin=peoplefinder', '&origin=resultsAnalyzer&zone=authorName', '&origin=recordpage', '&origin=recordPage'];

    // Get the current URL
    var currentURL = window.location.href;
    var newURL = currentURL;

    // Check if the URL starts with "https://www2.scopus.com/authid/detail.uri?authorId="
    if (currentURL.startsWith('https://www2.scopus.com/authid/detail.uri?authorId=')) {
        // Replace "www2" with "www"
        newURL = newURL.replace('www2.scopus.com', 'www.scopus.com');
    }

    // Check if the URL contains 'origin=resultslist' and 'authorId='
    if (currentURL.includes('origin=resultslist') && currentURL.includes('authorId=')) {
        const urlParams = new URLSearchParams(currentURL.split('?')[1]);
        const authorId = urlParams.get('authorId');
        if (authorId) {
            newURL = `https://www.scopus.com/authid/detail.uri?authorId=${authorId}`;
            window.location.href = newURL;
            return; // Stop further execution as we are navigating to the new URL
        }
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

    // Function to create and display the buttons and email container
    function createButtonAndContainers() {
        var detailButton = document.createElement('button');
        detailButton.textContent = 'Details';
        detailButton.style.position = 'fixed';
        detailButton.style.top = '10px';
        detailButton.style.left = '50%';
        detailButton.style.transform = 'translateX(-50%)';
        detailButton.style.zIndex = '10000';
        detailButton.style.padding = '10px 20px';
        detailButton.style.fontSize = '16px';
        detailButton.style.backgroundColor = '#4CAF50';
        detailButton.style.color = 'white';
        detailButton.style.border = 'none';
        detailButton.style.borderRadius = '5px';
        detailButton.style.cursor = 'pointer';

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

        var emailText = document.createElement('span');

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

        detailButton.onclick = function(event) {
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

        scholarButton.onclick = function() {
            var apiUrl = currentURL.replace('https://www.scopus.com/authid/detail.uri?authorId=', 'https://www.scopus.com/api/authors/');
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    var fullName = data.preferredName.full;
                    var nameParts = fullName.split(', ');
                    var reversedName = `${nameParts[1]} ${nameParts[0]}`;
                    var scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(reversedName)}`;
                    window.open(scholarUrl, '_blank');
                })
                .catch(error => {
                    console.error('Error fetching author data:', error);
                });
        };

        searchButton.onclick = function() {
            var apiUrl = currentURL.replace('https://www.scopus.com/authid/detail.uri?authorId=', 'https://www.scopus.com/api/authors/');
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    var fullName = data.preferredName.full;
                    var institution = data.latestAffiliatedInstitution.name;
                    var nameParts = fullName.split(', ');
                    var reversedName = `${nameParts[1]} ${nameParts[0]}`;
                    var searchUrl = `https://www.google.com/search?q=${encodeURIComponent(reversedName + ', ' + institution)}`;
                    window.open(searchUrl, '_blank');
                })
                .catch(error => {
                    console.error('Error fetching author data:', error);
                });
        };

        document.body.appendChild(detailButton);
        document.body.appendChild(scholarButton);
        document.body.appendChild(searchButton);
        document.body.appendChild(emailContainer);
        emailContainer.appendChild(emailText);
        emailContainer.appendChild(copyHint);

        // Log to console to confirm button creation
        console.log('Detail button, Scholar button, Search button, email container, and copy hint created');

        // Fetch the email address
        var apiUrl = currentURL.replace('https://www.scopus.com/authid/detail.uri?authorId=', 'https://www.scopus.com/api/authors/');
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                var email = data.emailAddress ? data.emailAddress : 'null';
                emailText.textContent = `${email}`;
            })
            .catch(error => {
                emailText.textContent = 'Error fetching email';
                console.error('Error:', error);
            });
    }

    // Ensure the buttons and email container are created after the page is fully loaded
    window.addEventListener('load', createButtonAndContainers);
})();
