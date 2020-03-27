const functions = require('firebase-functions');
const firebase = require("firebase");
const express = require('express');
const cors = require('cors')({origin: true});
var app = express();
// Required for side-effects
require("firebase/firestore");
require("firebase/functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


const firebaseConfig = {
  apiKey: "AIzaSyCleBofgyhYWDkI6o9fz1lF_wZnlpIlnuc",
  authDomain: "hq-app-8cc14.firebaseapp.com",
  databaseURL: "https://hq-app-8cc14.firebaseio.com",
  projectId: "hq-app-8cc14",
  storageBucket: "hq-app-8cc14.appspot.com",
  messagingSenderId: "564633742909",
  appId: "1:564633742909:web:d4cf905814484078a70454",
  measurementId: "G-LVC5S42ELF"
};
firebase.initializeApp(firebaseConfig);


app.use(express.urlencoded());
app.use(express.json());
//app.use(cors({ origin: true }));
/*app.post('/register', function(request, response) {
	console.log(request.body);
	getUniqueUserID().then(function(output) {
		var userid = output;
		createUser(userid, "07464", "G", "Bhatia", "sbgurneet@gmail.com", "test", "novice", false);
	});
});*/
exports.checkIfUserUnique = functions.https.onCall((data, context) => {
	return firebase.database().ref('/users/').once("value").then(function(snapshot) {
	    let snapData = snapshot.val();
	    values = Object.values(snapData);
	    var usernames = [];
	    for (var i=0;i<values.length;i++) {
	    	usernames.push(values[i].username);
	    }
	    return !usernames.includes(data.username);
	}).catch(function(error) {
		return error;
	});
});

exports.register = functions.https.onCall((data, context) => {
	getUniqueUserID().then(function(output) {
		var userid = output;
		firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
		.then(function() {
			createUser(data.userid, data.username, data.email, data.phone);
			return firebase.auth().signInWithEmailAndPassword(email, password);
		})
		.catch(function(error) {
			// Handle Errors here.
			return error;
		});

		// response.set('Access-Control-Allow-Origin', '*');
		// response.status(500).send({test: 'Testing functions'});
		// createUser(userid, "07464", "G", "Bhatia", "sbgurneet@gmail.com", "test", "novice", false);
	});
});

function createUser(userid, username, email, phone) {
	firebase.database().ref('users/' + userid).set({
		username: username,
		email: email,
		phone: phone,
		regComplete: false
	});
}

async function getUniqueUserID() {
	var userid = Math.floor(Math.random()*90000) + 10000;

	let userids = await getAllUserIDs();
	while((userids).includes(userid)) {
		console.log('here')
		userid = Math.floor(Math.random()*90000) + 10000;
	}
	return userid;
}

async function getAllUserIDs() {
	var userids = {}
	await firebase.database().ref('/users/').once("value").then(function(snapshot) {
		let values = snapshot.val();
		userids = (values) ? Object.keys(snapshot.val()) : [];
    	//userids = Object.keys(snapshot.val());
	});
	return userids;
}



