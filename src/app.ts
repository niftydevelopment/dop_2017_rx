/* 
 * Varför använda reaktiv programmering / Rx.js?
 * > Strikt funktionellt utan sidoeffekter.
 * > Arbeta med strömmar av data unviker effektif callback hell.
 * > Promise kan man bara använda en gång, stömmar strömmar :)
 * > Deklerativ programmering vs imperativ :)
*/

import * as $ from 'jquery';
import { Observable } from 'rxjs/Rx';

//skapa grundströmmar.
let clickStream = Observable.fromEvent($('#refreshBtn').get(0), 'click');
let pageLoadStream = Observable.fromEvent(window, 'load');
let scrollStream = Observable.fromEvent(window, 'scroll');

//Definiera om vad vi är intresserade av på grundströmmarna.
let reloadStream = clickStream.buffer(clickStream.throttleTime(250))
  .filter(e => {
    return e.length > 1;
  });

scrollStream = scrollStream.map(e => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    return true;
  }
  return false;
}).distinctUntilChanged()
  .filter(e => {
    return e;
  });

/* Merga ihop strömmarna */
let fetchDataStream = reloadStream.merge(pageLoadStream).merge(scrollStream).map((e) => {
  var randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset;
}).flatMap(requestUrl => { //meta stream
  return Observable.fromPromise($.ajax({ url: requestUrl }));
});


//Rendera
reloadStream.subscribe((e) => {
  $('#content').empty();
});

let subscription = fetchDataStream.catch((error, caught) => {
  $('#content').html('Woop! Något gick fel');
  return caught;
}).subscribe((users: Array<any>) => {
  var x = users.slice(0, 15).forEach(u => {
    console.log(u.avatar_url);

    $('#content').append($('<img>').attr('src', u.avatar_url));
    $('#content').append(u.login + '<br>');
  });
});