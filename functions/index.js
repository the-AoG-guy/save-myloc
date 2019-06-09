'use strict';

const {
  dialogflow,
  Permission,
  Suggestions,
  SimpleResponse,
  BasicCard,
  Button,
  Image,
} = require('actions-on-google');

const functions = require('firebase-functions');

const app = dialogflow({debug: true});

const myoption = [
  'Alright! Would you like to name your location? ',
  'Nice. Now please provide a name for this location? ',
  'Awesome! Now is there any particular name you want to give to your location? ',
  'Great! Now what do you want to name your location as? ',
];

const myoption2 = [
  'Here are some of your saved locations given down below.',
  'These are some of the saved locations in the suggestions.',
  'Some of the saved locations are down below in the suggestions.',
];

const myoption3 = [
  'Now what can I do for you?',
  'Want me to help you with something else?',
  'Anything else I can help you with?',
];

const myoption4 = [
  'Location saved real quick.',
  'Location saved in a flash.',
  'And it is saved, just like that.',
  'Saved. Real quick? I know right!',
];

const myoption5 = [
  'This feature is still under development. It might be pushed to release in my future versions. Thank You.',
  'Sorry! But my developers are too lazy playing games that they decided that they might put this in the next release. For now I\'ll just save your locations. Thanks for understanding.',
  'Hey there, this feature just might be available to you in the next update. Stay tuned to get it real quick. Thanks.',
  'Are you a beta tester? If so, you\'ll be the first one to test this feature if this rolls out. For now please be patient and stay tuned. Thanks.',
];

// Constant for image URLs
const HOME = 'https://image.ibb.co/eHDKez/home.png';
const WORK = 'https://image.ibb.co/iwaAme/work.png';
const SCHOOL = 'https://image.ibb.co/b55Xzz/school.png';
const COLLEGE = 'https://image.ibb.co/jX2Czz/college.png';
const GROCERY = 'https://image.ibb.co/hUM5Kz/grocery.png';
const BUSSTOP = 'https://image.ibb.co/iiEQKz/busstop.png';
const SECRETBASE = 'https://image.ibb.co/cFJVme/Secret_Base.png';
const BAE = 'https://image.ibb.co/fWJkKz/Bae_s_House.png';
const UNTITLED = [
  'https://image.ibb.co/kOykKz/1.png',
  'https://image.ibb.co/kVqnXK/2.png',
];

// Constant for quotes
const QHOME = 'A man travels the world over in search of what he needs and returns home to find it.';
const QWORK = 'There\'s no such thing as an overnight success. Unless there is a really long night of 20 years.';
const QSCHOOL = 'A child educated only at school is an uneducated child.';
const QCOLLEGE = 'Do not be afraid to ask for help. Nobody gets through college on their own.';
const QGROCERY = 'Your diet is a bank account. Good food choices are good investments.';
const QBUSSTOP = 'Lots of people want to ride with you in the limo, but what you want is someone who will take the bus with you when the limo breaks down.';
const QSECRETBASE = 'If we weren\'t developers, we\'d be secret agents.';
const QBAE = 'The word describes someone who comes "before anyone else". In Danish, it means poop.';
const QUNTITLED = 'Unnammed locations are the best. No strings attached. Memory locations might be.';

app.intent('delete', (conv) => {
   conv.user.storage = {};
   conv.close('I have cleared all of your saved locations, so that now, we can start fresh !');
 });
 
app.intent('untitled', (conv) => {
	if(!conv.user.storage.untitled) {
		conv.user.storage.untitled = 0;
	}
	var y = conv.user.storage.untitled;
	y=y+1;
	conv.user.storage.untitled = y; 
	var text3 = "MyLoc".concat(" ",y);
	if(conv.user.storage.placename) {
		conv.user.storage.placename.push(text3);
	}
	else {
		conv.user.storage.placename = [];
		conv.user.storage.placename.push(text3);
	}
	const factArr = myoption4;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
	conv.close(randomFact);
 });
 
app.intent('new-eggs', (conv) => {
	const factArr = myoption5;
	const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
	conv.close(randomFact);
});
 
 app.intent('asap-name', (conv,{tempname}) => {
	conv.data.temp = tempname; 
	conv.ask(new Permission({
    context: 'Certainly, but for that ',
    permissions: 'DEVICE_PRECISE_LOCATION'
  }));
}); 

app.intent('asap-name - yes', (conv, params, permissionGranted) => {
  const {location} = conv.device;
  var myplacename = conv.data.temp;  
  if (permissionGranted) {
	if(!conv.user.storage.count) {
		conv.user.storage.count = 0;
	}
	var x = conv.user.storage.count;
	x=x+1;
	conv.user.storage.count = x;
  	const { latitude, longitude } = location.coordinates;
	if(conv.user.storage.lat) {
		conv.user.storage.lat.push(latitude);
		if(conv.user.storage.lon) {
		conv.user.storage.lon.push(longitude);
		}
	}
	else {
		conv.user.storage.lon = [];
		conv.user.storage.lon.push(longitude);
		conv.user.storage.lat = [];
		conv.user.storage.lat.push(latitude);		
	}
	if(conv.user.storage.placename) {
		conv.user.storage.placename.push(myplacename);
	}
	else {
		conv.user.storage.placename = [];
		conv.user.storage.placename.push(myplacename);
	}
	conv.ask(`And just like that, I have saved this location as ${myplacename}.`);
	const factArrb = myoption3;
    const factIndexb = Math.floor(Math.random() * factArrb.length);
    const randomFactb = factArrb[factIndexb];
	conv.ask(randomFactb);
    conv.ask(new Suggestions(['View Saved Locations', 'Nothing for now']));  
	}
	else {
		conv.ask(`Sorry I just can't work without location permission, hope you understand it too. `);
		conv.close(`Until next time !`);
	}
});

 app.intent('asap-no-name', (conv) => {
	conv.ask(new Permission({
    context: 'Certainly, but for that ',
    permissions: 'DEVICE_PRECISE_LOCATION'
  }));
});
 
app.intent('asap-no-name - yes', (conv, params, permissionGranted) => {
  const {location} = conv.device;
  if (permissionGranted) {
	if(!conv.user.storage.count) {
		conv.user.storage.count = 0;
	}
	var x = conv.user.storage.count;
	x=x+1;
	conv.user.storage.count = x;
	if(!conv.user.storage.untitled) {
		conv.user.storage.untitled = 0;
	}
	var y = conv.user.storage.untitled;
	y=y+1;
	conv.user.storage.untitled = y;
	var text3 = "MyLoc".concat(" ",y);
  	const { latitude, longitude } = location.coordinates;
	if(conv.user.storage.lat) {
		conv.user.storage.lat.push(latitude);
		if(conv.user.storage.lon) {
		conv.user.storage.lon.push(longitude);
		}
	}
	else {
		conv.user.storage.lon = [];
		conv.user.storage.lon.push(longitude);
		conv.user.storage.lat = [];
		conv.user.storage.lat.push(latitude);		
	}
	if(conv.user.storage.placename) {
		conv.user.storage.placename.push(text3);
	}
	else {
		conv.user.storage.placename = [];
		conv.user.storage.placename.push(text3);
	}
	const factArr = myoption4;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
	conv.ask(randomFact);
	const factArrb = myoption3;
    const factIndexb = Math.floor(Math.random() * factArrb.length);
    const randomFactb = factArrb[factIndexb];
	conv.ask(randomFactb);
    conv.ask(new Suggestions(['View Saved Locations', 'Nothing for now']));  
	}
	else {
		conv.ask(`Sorry I just can't work without location permission, hope you understand it too. `);
		conv.close(`Until next time !`);
	}
});

app.intent('Default Welcome Intent - saveloc', (conv) => {
   conv.ask(new Permission({
    context: 'Ok then, but for that ',
    permissions: 'DEVICE_PRECISE_LOCATION'
  }));
 });
 
app.intent('Default Welcome Intent - saveloc - yes', (conv, params, permissionGranted) => {
  const {location} = conv.device;
  if (permissionGranted) {
	if(!conv.user.storage.count) {
		conv.user.storage.count = 0;
	}
	var x = conv.user.storage.count;
	x=x+1;
	conv.user.storage.count = x;
  	const { latitude, longitude } = location.coordinates;
	if(conv.user.storage.lat) {
		conv.user.storage.lat.push(latitude);
		if(conv.user.storage.lon) {
		conv.user.storage.lon.push(longitude);
		}
	}
	else {
		conv.user.storage.lon = [];
		conv.user.storage.lon.push(longitude);
		conv.user.storage.lat = [];
		conv.user.storage.lat.push(latitude);		
	}
	const factArr = myoption;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
	conv.ask(randomFact);
	conv.ask(new SimpleResponse({
    speech: 'You can choose from amongst the suggestions, name your own, or just say I\'ll name it later to save the location without a name.',
    text: 'Here are some suggestions.',
  }));
	conv.ask(new Suggestions(['Home', 'Work', 'School', 'College', 'Grocery Store', 'Bus Stop', 'Bae\'s House', 'I\'ll name it later' ]));
	}
	else {
		conv.ask(`Sorry I just can't work without location permission, hope you understand it too. `);
		conv.close(`Until next time !`);
	}
});

app.intent('Default Welcome Intent - saveloc - yes - name', (conv, {any}) => {
	if(conv.user.storage.placename) {
		conv.user.storage.placename.push(any);
	}
	else {
		conv.user.storage.placename = [];
		conv.user.storage.placename.push(any);
	}
	conv.ask(`The name of the place is saved as ${any}.`);
	const factArrb = myoption3;
    const factIndexb = Math.floor(Math.random() * factArrb.length);
    const randomFactb = factArrb[factIndexb];
	conv.ask(randomFactb);
    conv.ask(new Suggestions(['View Saved Locations', 'Nothing for now']));  
 });
 
 app.intent('viewloc', (conv) => {
	if(!conv.user.storage.count) {
		conv.ask("Sorry but you haven't saved any locations yet!");
		conv.close("To use this feature, invoke me again and get started.");
	}
	else {
		const factArra = myoption2;
		const factIndexa = Math.floor(Math.random() * factArra.length);
		const randomFacta = factArra[factIndexa];
		conv.ask(randomFacta);
		conv.ask("You can select one or say out your saved location to see it in detailed view.");
		var pqr = conv.user.storage.placename;
		var k = conv.user.storage.count;
		for( let i = 0; i < k; i++) {
			conv.ask(new Suggestions(`${pqr[i]}`));
		}
	}
});
 
app.intent('viewloc - custom', (conv, {search}) => {
	var myarr = conv.user.storage.placename;
	var mylat = conv.user.storage.lat;
	var mylon = conv.user.storage.lon;
	var a = conv.user.storage.placename.indexOf(search);
    if (search.toLowerCase().includes("home") == true ) {
		var mytext = QHOME;
		var myimg = HOME;
	}
	else if (search.toLowerCase().includes("work") == true ) {
		var mytext = QWORK;
		var myimg = WORK;
	}
	else if (search.toLowerCase().includes("school") == true ) {
		var mytext = QSCHOOL;
		var myimg = SCHOOL;
	}
	else if (search.toLowerCase().includes("college") == true ) {
		var mytext = QCOLLEGE;
		var myimg = COLLEGE;
	}
	else if (search.toLowerCase().includes("grocery") == true ) {
		var mytext = QGROCERY;
		var myimg = GROCERY;
	}
	else if (search.toLowerCase().includes("bus") == true ) {
		var mytext = QBUSSTOP;
		var myimg = BUSSTOP;
	}
	else if (search.toLowerCase().includes("secret") == true ) {
		var mytext = QSECRETBASE;
		var myimg = SECRETBASE;
	}
	else if (search.toLowerCase().includes("bae") == true ) {
		var mytext = QBAE;
		var myimg = BAE;
	}
	else if (search.toLowerCase().includes("house") == true ) {
		var mytext = QHOME;
		var myimg = HOME;
	}
	else if (search.toLowerCase().includes("myloc") == true ) {
		var mytext = QUNTITLED;
		var findurl = UNTITLED;
		var urlIndex = Math.floor(Math.random() * findurl.length);
		var myimg = findurl[urlIndex];
	}
	else {
		var mytext = `This is the saved location that you named ${search}.`;
		var findurl = UNTITLED;
		var urlIndex = Math.floor(Math.random() * findurl.length);
		var myimg = findurl[urlIndex];
	}
	if (a == -1) {
		conv.close(`Sorry! But you haven't saved ${search} yet.`);
	}
	else {
		var pqr = myarr[a];
		var lat1 = mylat[a];
		var lon1 = mylon[a];
		conv.ask(new SimpleResponse({
			speech: `This card will directly point to ${search} on Google Maps. Please press the button named ${search} on the card to redirect to Maps.`,
			text: `This card will directly point to ${search} on Google Maps.`,
		}));
		conv.ask(new BasicCard({
			text: `${mytext}`, 
			title: `${pqr}`,
			buttons: new Button({
				title: `${pqr}`,
				url: `https://maps.google.com/?q=${lat1},${lon1}`,
			}),
			image: new Image({
				url: myimg,
				alt: 'Click button to view on GMaps.',
			}),
			display: 'WHITE',
		}));
		var k = conv.user.storage.count;
		if(k != 1) {
		conv.ask(new SimpleResponse({
			speech: 'View another one? Or you can say, Nothing For Now, to close the action.',
			text: 'View another one?',
		}));
		for( let i = 0; i < a; i++) {
			conv.ask(new Suggestions(`${myarr[i]}`));
		}
		for( let i = a+1; i < k; i++) {
			conv.ask(new Suggestions(`${myarr[i]}`));
		}
		conv.ask(new Suggestions('Nothing For Now'));
		}
		else {
			conv.close("There are no more of the locations that you saved. So, I'm gonna go ahead and bid adieu. Have a good day !");
		}		
	}
	
});
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
