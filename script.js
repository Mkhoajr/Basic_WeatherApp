const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

form.addEventListener('submit', e => {
    e.preventDefault();
    const apiKey = "5568fa66d2f5e81907d5b2013986c0fe";
    const inputVal = input.value;

    // Prevent Duplicate Requests
    //1 
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
    if (listItemsArray.length > 0) {
        //2 
        const filteredArray = listItemsArray.filter(el => {
        let content = "";
        //athens,gr 
        if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal 
        if (inputVal.split(",")[1].length > 2) {
            input.value = inputVal.split(",")[0];
            content = el.querySelector(".city-name span").textContent.toLowerCase();
        } // else Valid country
        else {
            content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
        } else {
        //athens 
        content = el.querySelector(".city-name span").textContent.toLowerCase();
        }
        return content == inputVal.toLowerCase();
        });
  
        //3 
        if (filteredArray.length > 0) {
        msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
        } ...otherwise be more specific by providing the country code as well 😉`;
        form.reset();
        input.focus();
        return list;
        } 
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => response.json())
    // Get API's data respond 
    .then(data => {
        // do stuff with the data 
        console.log(data);

        const { main, name, sys, weather } = data;
        /* Similar to
        const main = data.main;
        const name = data.name; ...*/
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
        
        const li = document.createElement('li');
        li.classList.add("city");
        const markup = ` 
        <h2 class="city-name" data-name="${name},${sys.country}"> 
        <span>${name}</span> 
        <sup>${sys.country}</sup> 
        </h2> 
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup> 
        </div> 
        <figure> 
        <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
        <figcaption>${weather[0]["description"]}</figcaption> 
        </figure> 
        `;
        li.innerHTML = markup;
        list.appendChild(li);
    })
    .catch(() => {
        msg.textContent = "Please search for a valid city !!! 😩";
    });
    msg.textContent = '';
    form.reset();
    input.focus();
});
