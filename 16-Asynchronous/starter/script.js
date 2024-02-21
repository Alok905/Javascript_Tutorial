'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const url = 'https://restcountries.com/v3.1/name/portugal';

function getCountryData(country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    const html = `
    <article class="country">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${
              Object.values(data.languages)[0]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.values(data.currencies)[0].name
            }</p>
          </div>
        </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
}

// getCountryData('portugal');
// getCountryData('usa');
// getCountryData('germany');

/////////////////////////////
////// Chaining of request
/////////////////////////////

function renderCountry(data, className) {
  const html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${
              Object.values(data.languages)[0]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.values(data.currencies)[0].name
            }</p>
          </div>
        </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

function getCountryAndNeighbour(country) {
  // AJAX call 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);

    // Render country 1
    renderCountry(data);

    // Get neighbout country
    const neighbour = data.borders?.[0];

    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      renderCountry(data2, 'neighbour');
    });
  });
}

// getCountryAndNeighbour('portugal');
// getCountryData('usa');
// getCountryData('germany');

//////////////////////////////////
/////////// Promise //////////////
//////////////////////////////////
function getCountryData2(country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      console.log(response);

      // if we return any promise from this callback function then only we can write another then method that receive the current return value of this function
      return response.json();
    })
    .then(function (data) {
      renderCountry(data[0]);
    });
}

// getCountryData2('portugal');

// Chaining of Promise to view the neighbouring countries
function getJSON(url, errMessage = 'Something went wrong') {
  return fetch(url).then(
    response => {
      if (!response.ok) throw new Error(`Country not found ${response.status}`);

      return response.json();
    }
    //   err => alert(err)
  );
}

function getCountryAndNeighbour2(country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(
      response => {
        if (!response.ok)
          throw new Error(`Country not found ${response.status}`);
        return response.json();
      }
      //   err => alert(err)
    )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0]?.borders?.[0];
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => {
      if (!response.ok) throw new Error(`Country not found ${response.status}`);
      return response.json();
    })
    // .then(response => response.json(), err => alert(err))
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => alert(err)) // It's the better way of error handling
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

// organized
function getCountryAndNeighbourOrganized(country) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country not found!'
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error('No neighbour found!');

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found!'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => alert(err))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

btn.addEventListener('click', function () {
  getCountryAndNeighbourOrganized('portugal');
});

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

function whereAmI(lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?json=1`)
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      const { city, country } = data;
      console.log(`You are in ${city}, ${country}`);
      return fetch(`https://restcountries.com/v3.1/name/${country}`);
    })
    .then(response => {
      if (!response.ok) throw new Error(`Country not found ${response.status}`);
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0]?.borders?.[0];
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => {
      if (!response.ok) throw new Error(`Country not found ${response.status}`);
      return response.json();
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => console.error(err));
}
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

/////////////////////////////////////////////////
//////////////// EVENT LOOP /////////////////////
/////////////////////////////////////////////////

// console.log('test start');
// setTimeout(() => console.log('0 second timer'), 0);
// Promise.resolve('Resolved promise 1').then(res => console.log(res));
// console.log('test end');

// Promise.resolve('Resolved promise 2').then(res => {
//   for (let i = 0; i < 1000000000; i++);
//   console.log(res);
// });

/////////////////////////////////////////////////
/////////////// Building Promise ////////////////
/////////////////////////////////////////////////

// const lotteryPromise = new Promise(function (resolve, reject) {
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve('Won the lottery');
//     } else {
//       reject(new Error('Sorry, Losed the lottery!'));
//     }
//   }, 2000);
// });
// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));
// new Promise(
//   function (resolve) {},
//   function (reject) {}
// );

// Promisifying setTimeout
// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// wait(2)
//   .then(() => {
//     console.log(`I waited for 2 seconds.`);
//     return wait(1);
//   })
//   .then(() => {
//     console.log(`I waited for 3 seconds.`);
//     return wait(1);
//   })
//   .then(() => {
//     console.log(`I waited for 4 seconds.`);
//     return wait(1);
//   })
//   .then(() => {
//     console.log(`I waited for 5 seconds.`);
//     return wait(1);
//   })
//   .then(res => console.log('I waited for 6 second.'));

// --------------------------------
// Promise.resolve('abc').then(x => console.log(x));
// Promise.reject('abc').catch(x => console.error(x));

// function func1(input) {
//   return new Promise(function (resolve, reject) {
//     if (input === 'resolved') {
//       resolve('resolved');
//     } else {
//       reject('rejected');
//     }
//   });
// }
// var promise = new Promise(function (resolve, reject) {
//   resolve(
//     fetch(
//       `https://geocode.xyz/${22.576224500000002},${88.44618074999998}?json=1`
//     )
//   );

//   // fetch(`https://geocode.xyz/${22.576224500000002},${88.44618074999998}?json=1`)
//   //   .then(resolve)
//   //   .catch(reject);
// });
// promise
//   .then(function (result) {
//     console.log(result); // "resolved"
//   })
// //   .catch(function (error) {
//     console.log(error); // "rejected"
//   });
//--------------------------
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

// function getPosition() {
//   return new Promise((resolve, reject) =>
//     navigator.geolocation.getCurrentPosition(resolve, reject)
//   );
// }

// function whereAmIPromise() {
//   getPosition()
//     .then(res => {
//       const { latitude: lat, longitude: lng } = res.coords;
//       return fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       const { city, country } = data;
//       if (!city || !country)
//         throw new Error(`Couldn't fetch the restcountries data.`);
//       console.log(`You are in ${city}, ${country}`);
//       return fetch(`https://restcountries.com/v3.1/name/${country}`);
//     })
//     .then(response => {
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0]?.borders?.[0] || data[1]?.borders?.[1];
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(response => {
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => console.error(err));
// }
// whereAmIPromise();

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

const imgContainer = document.querySelector('.images');

// function createImage(imgPath) {
//   return new Promise((resolve, reject) => {
//     const image = document.createElement('img');
//     image.setAttribute('src', imgPath);
//     image.addEventListener('load', () => {
//       imgContainer.append(image);
//       resolve(image);
//     });
//     // image.addEventListener('error', reject);
//     image.addEventListener('error', () => reject(new Error('File not found')));
//   });
// }
// createImage('./img/img-1.jpg')
//   .then(data => console.log(data))
//   .catch(err => console.log(err));

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
/**
 * Inside the promise constructor, we are passing a function which is of type
 *
 * function(resolve, reject) {}
 *
 * so here the function we passed is a higher order function that receives 2 functions. so the Promise constructor got it's HOF and then it calls it by passing 2 arguments (which are 2 functions i.e. resolve function and reject function)
 *
 * So, basically the resolve function and reject function should be defined inside the Promise class and we just call then inside our function (which is HOF)
 */

// async function divide(a, b) {
//   try {
//     if (b == 0) throw new Error('Infinite value');

//     return a / b;
//   } catch (error) {
//     console.log(error);

//     // reject promise
//     throw error;
//   }
// }

// const res = divide(4, 0);
// console.log(res);
// res.then(result => console.log(result));

/*
const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
    ]);

    const [data1, data2, data3] = data;
    console.log(data1, data2, data3);
  } catch (error) {}
};
get3Countries('portugal', 'canada', 'tanzania');

*/

function createImage(imgPath) {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.setAttribute('src', imgPath);
    image.classList.add('paralell');
    image.addEventListener('load', () => {
      imgContainer.append(image);
      resolve(image);
    });
    // image.addEventListener('error', reject);
    image.addEventListener('error', () => reject(new Error('File not found')));
  });
}

async function loadAll(imageArr) {
  const imgs = imageArr.map(async imgPath => await createImage(imgPath));
  // const imgs = imageArr.map(imgPath => createImage(imgPath));
  const imgsEl = await Promise.all(imgs);
  console.log(imgsEl);
}

const testData = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

loadAll(testData);
