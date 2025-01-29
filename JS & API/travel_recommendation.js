const searchButton = document.getElementById("search-btn");
var searchList = [];
const resultDiv = document.getElementById("result");
const searchInputArea = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");

function searchDestination() {
    const searchText = document.getElementById("search-input").value.toLowerCase();
    resultDiv.innerHTML = "";

    fetch("travel_recommendation_api.json")
        .then((response) => response.json())
        .then((data) => {
            if (searchText.length == 0) {
                console.log("Please Insert Text");
                resultDiv.classList.replace("hide", "show");
                resultDiv.innerHTML = `<div class="dest-card">
                                            <p>Enter a valid Destination</p>
                                        </p>`;
                return;
            }

            const destination = lookUp(data, searchText);
            console.log(destination);
    
            if (destination.length !== 0) {
                displayResult(destination);
                searchList = [];
            } else {
                console.log("Enter a valid Destination");
                resultDiv.classList.replace("hide", "show");
                resultDiv.innerHTML = `<div class="dest-card">
                                            <p>Destination or Keyword Not Found</p>
                                        </p>`;
                return;
            }
        })
        .catch((e) => {
            console.log("Error:", e);
        });
};

function lookUp(array, input) {
    for (let key in array) {
        var value = array[key];
        if (input === key.toLowerCase() || key.toLowerCase().includes(input) || singularize(key.toLowerCase()) === input) {
            return value;
        } else {
            value.forEach(element => {
                if (element.name.toLowerCase().includes(input)) {
                    searchList.push(element);
                } else if (element.cities) {
                    if (element.cities.some((i) => i.name.toLowerCase().includes(input))) {
                        searchList.push(element.cities.find((item) => item.name.toLowerCase().includes(input)));
                    }
                }
            });
        }
    }
    return searchList;
}

function displayResult(destination) {
    if (destination) {
        resultDiv.innerHTML += `<div class="dest-card" style="background: #01696b;"></div>`;
        
        for (dest of destination) {
            if (dest.cities) {
                dest.cities.forEach((city) => {
                    resultDiv.classList.replace("hide", "show");
                    resultDiv.innerHTML += `<div class="dest-card">
                                                <img src ="${city.imageUrl}" alt="${city.name}"/>
                                                <h3>${city.name}</h3>
                                                <p>${city.description}</p>
                                                <p>Current Time is:${timezoneIdentifier(city.timeZone)}</p>
                                                <button>Visit</button>
                                            </div>`;
                });
                return;
            } else {
                resultDiv.classList.replace("hide", "show");
                resultDiv.innerHTML += `<div class="dest-card">
                                                <img src ="${dest.imageUrl}" alt="${dest.name}"/>
                                                <h3>${dest.name}</h3>
                                                <p>${dest.description}</p>
                                                <p>Current Time is:${timezoneIdentifier(dest.timeZone)}</p>
                                                <button>Visit</button>
                                            </div>`;
            }
        }
    }
}

function clearResult() {
    resultDiv.classList.replace("show", "hide");
    resultDiv.innerHTML = "";
}

function singularize(word) {
    const endings = {
        ves: 'fe',
        ies: 'y',
        i: 'us',
        zes: 'ze',
        ses: 's',
        es: 'e',
        s: ''
    };
    return word.replace(
        new RegExp(`(${Object.keys(endings).join('|')})$`), 
        r => endings[r]
    );
}

function timezoneIdentifier(input) {
    const option = { timeZone: input, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString("en-US", option);
}

searchInputArea.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchDestination();
    }
});

searchButton.addEventListener("click", searchDestination);
clearBtn.addEventListener("click", clearResult);
