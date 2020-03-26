const express = require('express');
const admin = require('firebase-admin')
var firebase = require('firebase-admin');
var key = require('./key')
firebase.initializeApp(key);
const db = admin.firestore();
const bodyparser = require('body-parser');
const app = express();
const firebas = require('firebase');

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
    if (getFruit !== -1) {
      var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
      // console.log("--------------")
      console.log(getname);
      io.sockets.connected[getname.socketid].emit("hello", data.message);
    } else {
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
  // var sockets = io
  // .of('/request');
  // sockets.on('connection', function (socket) {
  //   // console.log("connected")
  socket.on('request', function (data) {
    console.log(data);




    const button = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.from);
    if (button !== -1) {
      var newname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.from);
      console.log("--------------")
      console.log(newname);
      var newdata = "success"
      io.sockets.connected[newname.socketid].emit("buttondisable", newdata);
    } else {
      console.log("user is offline");
    }













    console.log(arrayforconnected)
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.to);
    if (getFruit !== -1) {
      var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
      // console.log("--------------")
      console.log(getname);
      console.log("--------------------")
      // io.sockets.connected[getname.socketid].emit("accept message",data.message);

      // db.collection("users").where("to", "==", req.body.to)
      // console.log(getname.from)
        const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
        db.collection("users")
          .doc(data.from)
          .update({
            "sendRequest": arrayUnion(data.to)
          });
        db.collection("users")
          .doc(data.to)
          .update({
            "reciveRequest": arrayUnion(data.from)
          });


console.log(data.from)
        db.collection('users').doc(data.from).get().then(datas => {
          console.log(datas.data());
          const newarray = {
            id:data.from,
            name: datas.data().displayName,
            email: datas.data().Emailid
          }
          console.log(newarray)
          io.sockets.connected[getname.socketid].emit("accept message", newarray);
        })

    } else {
      console.log("user is offline")      
      const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
      db.collection("users")
      .doc(data.from)
      .update({
        "sendRequest": arrayUnion(data.to)
      });
    db.collection("users")
      .doc(data.to)
      .update({
        "reciveRequest": arrayUnion(data.from)
      });

    }
    //     const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.to);
    //     if(getFruit !== -1){
    //     var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
    //     // console.log("--------------")
    //     console.log(getname.socketid);
    //     io.sockets.connected[getname.socketid].emit("friend request",data.message);
    //     }else{
    //       console.log("user is offline")
    //     }





  })
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

app.post('/sendrequest', (req, res) => {
  console.log(req.body);

  // db.collection("friendrequest").where("to", "==", req.body.to)
  // .get()
  // .then(function (querySnapshot) {
  //   // console.log(querySnapshot.docs);

  //   querySnapshot.forEach(data=>{
  //     if(data.exists){
  //     console.log(data.data())
  //   }else{
  //     console.log("aaaa")
  //   }
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })

  // var requests1=[];
  // db.collection('friendrequest').get().then((data) => {

  // data.forEach((data=>{
  //   console.log(data.data())
  //   // requests1.push(data.data())
  // // console.log("llllllllllllll")
  // // console.log(requests1)
  //   // for(i=0;i<=requests1.length;i++){
  //   //   if(requests1.to==req.body.to && requests1.from==req.body.from){
  //   //     console.log("yes")
  //   //     }else{
  //   //       console.log("no")
  //   //     }
  //   // }

  //   // if(data.data().to==req.body.to && data.data().from==req.body.from){
  //   //   console.log("yes")
  //   // }else{
  //   //   console.log("no")
  //   //   db.collection('friendrequest').add(req.body).then(() => {});
  //   // }
  // }))
  // });




})

app.post('/getrequests', (req, res) => {
  console.log(req.body.id)
  var response = [];
  db.collection("users").doc(req.body.id).get().then(data => {
    console.log(data.data().reciveRequest);
    const recivedrequest = data.data().reciveRequest

    for (let i = 0; i < recivedrequest.length; i++) {
      console.log(recivedrequest[i]);
      db.collection("users").doc(recivedrequest[i]).get().then(data => {
        var newobj = {
          id:recivedrequest[i],
          name: data.data().displayName,
          email: data.data().Emailid,
        }
        // console.log(newobj)
        // console.log(data)
        response.push(newobj);
        // console.log(response)
        if (i == recivedrequest.length - 1) {
          // res.json(response)
          console.log(response)
          res.send(response)
        }
        // res.json(newobj)
        // console.log(response)
      });

      // console.log(response)
    }
    // console.log("-----------")
    // console.log(response)
  });
  //   db.collection('friendrequest').get().then((data) => {
  //     // console.log(data.docs.);
  //     console.log(data.docs)
  //     // var a=  data.docs.find(d=>d={to:req.body.id});
  //     // var b = data.docs.find(d => d = {from:req.body.id});
  //     // var c =b.data();
  //     // console.log(c);
  //     // console.log(a)
  //     data.forEach((data=>{
  //       console.log(data.data())
  //       if(data.data().to==req.body.id){
  //         console.log("yes")
  //         requests1.push(data.data());
  //       }
  //       else{
  //         console.log("no")
  //       }
  //     }))
  //     res.json(requests1);
  //     // .then(function (querySnapshot) {
  //     //   //  var a=  querySnapshot.docs.map(d=>d={Emailid:req.body.Emailid});
  //     //   //  console.log("in")
  //     //   var b = querySnapshot.docs.find(d => d = {
  //     //     Emailid: req.body.Emailid
  //     //   });
  //     //   var c = b.data()
  //     //   console.log(c.displayName)











  //   })
  //   // db.collection("users").where("Emailid", "==", req.body.Emailid)
})


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
           console.log(c)
          querySnapshot.forEach((data => {
            console.log(data.id)
            const newid = data.id;
            totalresponse = {
              uid: newid,
              token: token,
              displayName: c.displayName,
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

app.post('/getrequestlist', (req, res) => {
  console.log(req.body.uid);
  db.collection('users').doc(req.body.uid).get().then(data => {
  //   let screms = [];
  console.log(data.data());
  res.json(data.data().sendRequest);
  //   data.forEach(doc => {
  //     screms.push({
  //       id: doc.id,
  //       displayName: doc.data().displayName,
  //       Emailid: doc.data().Emailid,
  //     });
  //   });
  //   res.send(screms);
  }).catch(err => console.log(err))
})

http.listen(8000, () => console.log('serverstarte on : 8000'));
