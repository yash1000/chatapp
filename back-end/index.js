const express = require('express');
const admin = require('firebase-admin')
var firebase = require('firebase-admin');
var key = require('./key')
firebase.initializeApp(key);

const db = admin.firestore();
const bodyparser = require('body-parser');
const app = express();
const firebas = require('firebase');
const Multer = require('multer');
const googleStorage = require('@google-cloud/storage');
firebas.initializeApp(key);
// const storage = googleStorage({projectId: "chatpp-da297",keyFilename: "./key"});
// gcloud.Storage()
// var gcloud = require('gcloud');
// const gcloud = require('google-cloud')
// var gcloud = require('gcloud')({ ... }); var gcs = gcloud.storage();
// var bucket = gcs.bucket('<your-firebase-storage-bucket>');
// const ref = firebase.storage().ref();
const formidable = require('formidable');
const form = formidable({ multiples: true });
// firebas.initializeApp(config);
// var storage = firebase.storage().bucket();
// const {Storage} = require('@google-cloud/storage');
// var storages = firebas.storage().ref;
// let storageRef = firebas.storage().ref();
// var storageRef = storages.bucket('gs://chatpp-da297.appspot.com')
// const storage = new Storage();


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





app.post('/registration', (req, res) => {
  console.log(req.body);
   
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log(fields)
    console.log(files)
    // var storageRef = firebas.storage().ref();
  });
  // });

  // firebas.auth().createUserWithEmailAndPassword(req.body.Emailid, req.body.password).then(data => {

  //   db.collection('users').add(req.body).then(() => {
  //     console.log("oh yeh")
  //     firebas.auth().currentUser.getIdToken().then(function (idToken) {
  //       console.log(idToken)
  //       res.json({
  //         message: "successfully resgisterd"
  //       })
  //     }).catch(function (error) {
  //       console.log(error)
  //     });
  //   }).catch(err => {
  //     console.log("oh no")
  //     console.log(err);
  //   })
  // }).catch(err => {
  //   if (err.message == "The email address is already in use by another account.") {
  //     res.json({
  //       message: "already exist"
  //     })
  //   }
  // })
})










var arrayforconnected = [];
io.on('connection', function (socket) {

  socket.on('id', (data) => {
    console.log(data);
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.id);
    if (getFruit !== -1) {
      arrayforconnected.splice(getFruit, 1);
      console.log(arrayforconnected)
      io.emit('online users', {
        online: arrayforconnected
      })
    }
  })
  socket.on('disconnect', function(data){
    console.log(data);
    socket.disconnect();
    console.log(arrayforconnected)
});
    // socket.on('create', function(room) {
    //   socket.join(room);
    //   console.log(room)
    //   io.sockets.in(room).emit('chat message', "asasas");
    //   socket.on(room, data => {
    //     console.log("000000000000000000000")
    //     console.log(data)
    //     socket.to(room).emit('new data',`data is ${data.message};
    //     send from ${data.from}
    //     send to ${room}`);
    //     // socket.on('new datas',data => {
    //     //   console.log(data)
          
    //     // });
    //   });
  
  
    // });
    socket.on('typing', (data) => {
      console.log(data);
      const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.to);
      if (getFruit !== -1) {
        var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
        console.log(getname);
        io.sockets.connected[getname.socketid].emit("totyping", 'typing');
      }
    })
    socket.on('stop typing', (data) => {
      console.log(data);
      const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.to);
      if (getFruit !== -1) {
        var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
        console.log(getname);
        io.sockets.connected[getname.socketid].emit("stoptyping", 'stop typing');
      }
    })
  socket.on('new', (data) => {
    // const availableRooms = [];
    // console.log(data)
    // console.log(io.sockets.adapter.rooms)
    // const rooms = io.sockets.adapter.rooms;
    // if (rooms) {
    //   for (var roomr in rooms) {
    //     if (!rooms[roomr].hasOwnProperty(roomr)) {
    //       availableRooms.push(roomr);
    //     }
    //   }
    // }
    // for (var i = 0; i < availableRooms.length; i++) {
    //   console.log(availableRooms[i])
    // }
    // var a = data.to + data.me;


    var ntotal = 0;
    var mtotal = 0;
    for (let i = 0; i < data.to.length; i++) {
      var str = data.to;
      ntotal += str.charCodeAt(i);
    }
    for (let i = 0; i < data.me.length; i++) {
      var str = data.me;
      mtotal += str.charCodeAt(i);
    }
    if (ntotal < mtotal) {
      console.log("yes")
      const room = data.me + data.to;
      socket.join(room);
      socket.emit('room is', room);
      console.log(`joined ${room}`)
      socket.on(room, data => {
        io.sockets.in(room).emit('welcome message', data);
        db.collection('chat').doc(room).collection('message').add(data).then(() => {console.log("addes")})
      });
    } else if (mtotal < ntotal) {
      const room = data.to + data.me;
      socket.join(room);
      socket.emit('room is', room);
      console.log(`joined ${room}`)

      socket.on(room, data => {
        io.sockets.in(room).emit('welcome message', data);
        db.collection('chat').doc(room).collection('message').add(data).then(() => {console.log("addes")})
      });
    }

    // var b =data.me+data.to;
    // var c =availableRooms.includes(a);
    // var d =availableRooms.includes(b)
    // if(c || d){
    //   console.log("YES");
    //   console.log(c);
    //   if(c === true){
    //     console.log("in c")
    //     const e = availableRooms.find(d => d === a)
    //     console.log("============")
    //     console.log(e);
    //     socket.join(e);
    //     socket.emit('room is', e);
    //     console.log(`joined ${e}`)
    //     // io.sockets.in(e).emit('chat message', "asasas");
    //     socket.on(e, data => {
    //       console.log(data);
    //       io.sockets.in(e).emit('welcome message', data);
    //     });
    //   }
    //   if(d === true){
    //     console.log("in d")
    //     const f = availableRooms.find(d => d === b)
    //     console.log("++++++++")
    //     console.log(f);
    //     socket.join(f);
    //     socket.emit('room is', f);
    //     console.log(`joined ${f}`)
    //     // io.sockets.in(f).emit('chat message', "asasas");
    //     socket.on(f, data => {
    //       console.log(data);
    //       io.sockets.in(f).emit('welcome message', data);
    //       db.collection('chat').add(data).then(() => {console.log("added")})
    //     });
    //   }

    // } else {
    //   const room = data.me+data.to;

    //   // var n = room.search(data.me);
    //   // var m = room.search(data.to);
    //   // if(n !== -1 || m !== -1){
    //     socket.join(room);
    //     socket.emit('room is', room);
    //     console.log(`joined ${room}`)
    //     // io.sockets.in(room).emit('chat message', "asasas");
    //   // }
    //   socket.on(room, data => {
    //     console.log("ppppppppppppp")
    //     console.log(data);
    //     io.sockets.in(room).emit('welcome message', data);
    //     db.collection('chat').add(data).then(() => {console.log("added")})
    //   });
    // }

    // socket.on('new datas',data => {
    //   console.log(data)

    // });
  })

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
    const nsp = io.of('/chat');
    nsp.on('connection', function(socket){
      console.log("op")
      console.log(arrayforconnected);
      nsp.emit('online users', {
        online:arrayforconnected
      });
    });
    
  })
  socket.on('chat', function (data) {
    console.log(data);
    console.log(data.to)
    console.log("----------------------")
    console.log(arrayforconnected)
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.to);
    if (getFruit !== -1) {
      var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.to);
      console.log(getname);
      io.sockets.connected[getname.socketid].emit("hello", data.message);
    } else {
      console.log("user is offline")
    }
  })

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
      console.log("oh hllo")
      console.log(getname);
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
          id: data.from,
          name: datas.data().displayName,
          email: datas.data().Emailid
        }
        console.log(newarray)
        console.log(getname)
        io.sockets.connected[getname.socketid].emit("accept message", newarray);
      }).catch(err => {
        console.log(err)
      });

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
  })

  socket.on('acceptrequest', function (data) {
    console.log(data);
    console.log(data);
    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
    const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
    db.collection("users")
      .doc(data.to)
      .update({
        "reciveRequest": arrayRemove(data.from),
        "friendList": arrayUnion(data.from)
      }).catch(err => {
        console.log(err)
      });
    db.collection("users")
      .doc(data.from)
      .update({
        "sendRequest": arrayRemove(data.to),
        "friendList": arrayUnion(data.to)
      }).catch(err => {
        console.log(err)
      });
    db.collection('users').doc(data.from).get().then(datass => {
      const newdata = {
        uid: datass.id,
        name: datass.data().displayName,
        email: datass.data().Emailid
      }
      console.log(data.from)
      const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.from);
      if (getFruit !== -1) {
        var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.from);
   
        io.sockets.connected[getname.socketid].emit("newfriend", newdata);
      }
    })
  })


  socket.on('buttonshow', function (data) {
    console.log(data);
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === data.from);
    if (getFruit !== -1) {
      var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === data.from);
           console.log(getname)
           console.log(data.from);
      io.sockets.connected[getname.socketid].emit("newbutton", data.to);
      console.log("emitted")
    }
  })
});

app.post('/reject', (req, res) => {
  console.log(req.body)
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
  db.collection("users")
    .doc(req.body.to)
    .update({
      "reciveRequest": arrayRemove(req.body.from),
    }).catch(err => {
      console.log(err)
    });
  db.collection("users")
    .doc(req.body.from)
    .update({
      "sendRequest": arrayRemove(req.body.to),
    }).catch(err => {
      console.log(err)
    });
})


app.post('/sendrequest', (req, res) => {
  console.log(req.body);
})


app.post('/getrequests', (req, res) => {
  console.log(req.body.id)
  var response = [];
  db.collection("users").doc(req.body.id).get().then(data => {
    console.log(data.data())
    console.log(data.data().reciveRequest);
    const recivedrequest = data.data().reciveRequest
    const recivedrequestlength = data.data().reciveRequest.length

    for (let i = 0; i < recivedrequest.length; i++) {
      db.collection("users").doc(recivedrequest[i]).get().then(data => {
        var newobj = {
          id: recivedrequest[i],
          name: data.data().displayName,
          email: data.data().Emailid,
        }
        response.push(newobj);
        if (response.length == recivedrequestlength) {
          console.log(response)
          res.send(response)
        }
      });
    }
  }).catch(err => {
    console.log(err)
  });
})



app.post('/login', (req, res) => {
  console.log(req.body.Emailid);
  firebas.auth().signInWithEmailAndPassword(req.body.Emailid, req.body.password).then((result) => {
    console.log(result.user.uid)
    result.user.getIdToken().then(token => {
      console.log(token)
      db.collection("users").where("Emailid", "==", req.body.Emailid)
        .get()
        .then(function (querySnapshot) {
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
        }).catch(err => {
          console.log(err)
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

app.post('/allusers', (req, res) => {
  console.log(req.body)
  db.collection('users').doc(req.body.uid).get().then(datas => {
    console.log(datas.data().friendList);
    var a = datas.data().friendList.length;
    console.log(a);
    db.collection('users').get().then(data => {
      let screms = [];
          data.forEach(doc => {
              screms.push({
                id: doc.id,
                displayName: doc.data().displayName,
                Emailid: doc.data().Emailid,
              });
          })
          const response = screms.filter(n => !datas.data().friendList.some(n2 => n.id === n2));
          console.log("on")
          console.log(response)
          res.send(response);
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
})



app.post('/getrequestlist', (req, res) => {
  console.log(req.body.uid);
  db.collection('users').doc(req.body.uid).get().then(data => {
    console.log(data.data());
    res.json(data.data().sendRequest);
  }).catch(err => console.log(err))
})


var arrayoffriend = [];
app.post('/getfriends', (req, res) => {
  console.log(req.body);
  db.collection('users').doc(req.body.id).get().then(data => {
    console.log(data.data().friendList.length);
    var newcount = data.data().friendList.length;
    if(newcount===0) {
      res.json("sorry you don't have friends");
    }else{
    for (let i = 0; i < newcount; i++) {
      db.collection('users').doc(data.data().friendList[i]).get().then(data => {
        const newdata = {
          uid: data.id,
          name: data.data().displayName,
          email: data.data().Emailid
        }
        arrayoffriend.push(newdata);
        if (arrayoffriend.length == newcount) {
          console.log(arrayoffriend);
          res.send(arrayoffriend);
        }
      })
    }
  }
    arrayoffriend = [];
  }).catch(err => {
    console.log(err)
  })
});




app.post('/removefriend', (req, res) => {
  console.log(req.body)
  
  var ntotal = 0;
  var mtotal = 0;
  for (let i = 0; i < req.body.from.length; i++) {
    var str = req.body.from;
    ntotal += str.charCodeAt(i);
  }
  for (let i = 0; i < req.body.local.length; i++) {
    var str = req.body.local;
    mtotal += str.charCodeAt(i);
  }
  if (ntotal < mtotal) {
const room =req.body.local+req.body.from;
console.log('room is'+ room);
db.collection('chat').doc(room).collection('message').listDocuments().then((data) => {
  data.map((data) => {
    data.delete();
  })
  console.log("deleted")
})
  }
  else{
    const room1 = req.body.from+req.body.local;
    console.log('room1 is'+room1);
    db.collection('chat').doc(room1).collection('message').listDocuments().then((data) => {
      data.map((data) => {
        data.delete();
      })
      console.log("deleted")
    })
  }
 const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
  db.collection("users")
    .doc(req.body.local)
    .update({
      "friendList": arrayRemove(req.body.from),
    }).catch(err => {
      console.log(err)
    });
  db.collection("users")
    .doc(req.body.from)
    .update({
      "friendList": arrayRemove(req.body.local),
    }).catch(err => {
      console.log(err)
    });
    const getFruit = arrayforconnected.findIndex(arrayforconnected => arrayforconnected.user === req.body.from);
    if (getFruit !== -1) {
      var getname = arrayforconnected.find(arrayforconnected => arrayforconnected.user === req.body.from);
           console.log(getname)
           console.log(req.body.from);
           db.collection('users').doc(req.body.from).get().then(datas => {
             console.log("ooooooooooooo")
             console.log(datas.data())
             const newobj = {
               id:req.body.from,
               displayName:datas.data().displayName,
               Emailid:datas.data().Emailid
             }
             io.sockets.connected[getname.socketid].emit("userafterremove", newobj);
             console.log("emitted")
           })
    }
})
//  arrayofmessage = [];
app.post('/getmessages',(req,res) => {
  const arrayofmessage = [];
  console.log(req.body);
  db.collection('chat').doc(req.body.room).collection('message').orderBy('date').get().then((data) => {
    data.forEach(doc => {
      console.log(doc.data());
      arrayofmessage.push(doc.data())
    })
    res.send(arrayofmessage);

  })
  
})





http.listen(8000, () => console.log('serverstarte on : 8000'));
