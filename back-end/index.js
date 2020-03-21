const express = require('express');
const admin = require('firebase-admin')
var firebase = require('firebase-admin');
var key = require('./key')
firebase.initializeApp(key);
const db = admin.firestore();
const bodyparser = require('body-parser');
const app = express();
const firebas = require('firebase');
var config = {
  apiKey: "AIzaSyDjCZoHVr6BMiQMS-uO9U5fN6gcp0mPWqM",
  authDomain: "chatpp-da297.firebaseapp.com",
  databaseURL: "https://chatpp-da297.firebaseio.com",
  projectId: "chatpp-da297",
  storageBucket: "chatpp-da297.appspot.com",
  messagingSenderId: "956935763818",
  appId: "1:956935763818:web:ae9d71ac0e67ebb3ab9713",
  measurementId: "G-KKVNKKNV10"
};
firebas.initializeApp(config);
app.use(bodyparser.json());
const cors = require('cors');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyparser.urlencoded({
  extended: true
}))

// io.on('connection', function (socket) {
//   console.log('user connected');
//   // socket.emit('test','some data');
//   console.log(socket)
// });
var arrayforconnected = [];
io.on('connection', function (socket) {


  socket.on('startconnnection', function (data) {
    var user = data.connencted;
    var useronlineobjectwithsocketid = {
      socketid: socket.id,
      user: user
    }
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === user);
    if (getFruit !== -1) {
      arrayforconnected.splice(getFruit, 1);
      arrayforconnected.push(useronlineobjectwithsocketid);
    } else {
      arrayforconnected.push(useronlineobjectwithsocketid);

    }
    console.log(arrayforconnected)
    io.emit('online users', {
      online: arrayforconnected
    })

  })
  socket.on('chat', function (data) {
    console.log(data);
    console.log(data.to)
    console.log("----------------------")
    console.log(arrayforconnected)
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.to);
    if(getFruit !== -1){
    var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
    // console.log("--------------")
    console.log(getname);
    io.sockets.connected[getname.socketid].emit("hello",data.message);
    }else{
      console.log("user is offline")
    }
  })


  
  // socket.on('my other event', function (data) {
  //   console.log(data);
  //   console.log(data)
  //   if (!data.my == '') {
  //     socket.emit('first', {
  //       server: 'hello'
  //     });
  //   }
  // });

});

// var chat = io
//   .of('/chat')
// .on('connection', function (socket) {
// socket.emit('a message', {
//     that: 'only'
//   , '/chat': 'will get'
// });
// chat.emit('a message', {
//     everyone: 'in'
//   , '/chat': 'will get'
// });
// chat.on('chat', function(data){
//   console.log(data);
// })
// });
// io.on('createdmessage',()=>{
//   console.log("ll")
// })
// var news = io
//   .of('/news')
//   .on('connection', function (socket) {
//     socket.emit('item', { news: 'item' });
//   });


app.post('/login', (req, res) => {
  console.log(req.body.Emailid);
  firebas.auth().signInWithEmailAndPassword(req.body.Emailid, req.body.password).then((result) => {
    // console.log(result.credential.toJSON())
    // var a =result.credential.toJSON()
    // console.log(a)
    console.log(result.user.uid)
    result.user.getIdToken().then(token => {
      console.log(token)
      // totalresponse={
      //   uid:result.user.uid,
      //   token:token
      // }
      // res.json(totalresponse)
      // console.log(result.user.providerData)
      db.collection("users").where("Emailid", "==", req.body.Emailid)
        .get()
        .then(function (querySnapshot) {
          //  var a=  querySnapshot.docs.map(d=>d={Emailid:req.body.Emailid});
          //  console.log("in")
          var b = querySnapshot.docs.find(d => d = {
            Emailid: req.body.Emailid
          });
          var c = b.data()
          console.log(c.displayName)
          querySnapshot.forEach((data=>{
            console.log(data.id)
            const newid=data.id;
            totalresponse = {
              uid: newid,
              token: token,
              displayName: c.displayName
            }
          }))
          
       
          res.json(totalresponse)
          console.log(result.user.providerData)
        });
    })
  }).catch(err => {
    if (err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
      res.send({
        message: "there is no user like this"
      });
    }
  });
})

app.post('/registration', (req, res) => {
  console.log(req.body);
  firebas.auth().createUserWithEmailAndPassword(req.body.Emailid, req.body.password).then(data => {

    db.collection('users').add(req.body).then(() => {
      console.log("oh yeh")
      firebas.auth().currentUser.getIdToken().then(function (idToken) {
        console.log(idToken)
        res.json({
          message: "successfully resgisterd"
        })
      }).catch(function (error) {
        console.log(error)
      });
    }).catch(err => {
      console.log("oh no")
      console.log(err);
    })
  }).catch(err => {
    if (err.message == "The email address is already in use by another account.") {
      res.json({
        message: "already exist"
      })
    }
  })
})

app.get('/allusers', (req, res) => {
  db.collection('users').get().then(data => {
      let screms = [];
      data.forEach(doc => {
          screms.push({
              id: doc.id,
              displayName: doc.data().displayName,
              Emailid: doc.data().Emailid,
          });
      });
      res.send(screms);
  }).catch(err => console.log(err))
})



http.listen(8000, () => console.log('serverstarte on : 8000'));
