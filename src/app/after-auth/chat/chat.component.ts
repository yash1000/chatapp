import { Component, OnInit } from '@angular/core';
import { ApiCalls } from '../../services/apicalls.service';
import * as io from 'socket.io-client';
import { DomSanitizer } from '@angular/platform-browser';
import { clearScreenDown } from 'readline';
declare const $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  localdata: any;
  objectofid: any;
  datas = [];
  onlineusers: any;
  chatname: any;
  arrayforimage = [];
  arrayforvideo = [];
  room: any;
  videoobject = [];
  imageobject = [];
  messagesendid: any;
  arrayofmessage = [];
  newmessagearray = [];
  chatroom = [];
  currentroom: any;
  typing: any;
  img: any;
  deliveredornot: any;
  notdelivered = [];
  newname: any;
  selectedFile: File;
  localUrl: any;
  abcd: any;

  constructor(private api: ApiCalls, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // console.log(this.arrayforimage.length);
    /**
     * access to local user data
     */
    this.localdata = JSON.parse(localStorage.getItem('accessToken'));
    console.log(this.localdata.uid);
    this.objectofid = {
      id: this.localdata.uid,
    };

    /**
     * api for get friend list for sidebar
     * @param this.objectofid is user id for database search
     */
    this.api.getfriends(this.objectofid).subscribe((res: any) => {
      console.log(res);
      // tslint:disable-next-line:quotemark
      if (res === "sorry you don't have friends") {
        console.log(this.datas);
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.length; i++) {
          this.datas.push(res[i]);
        }
      }
    });

    /**
     * socket connection for online user , message state change , typing
     */
    const socket = io('http://localhost:8000');
    socket.emit('startconnnection', { connencted: this.localdata.uid });
    socket.on('online users', (data) => {
      console.log(data.online);
      console.log(data.online.length);
      const a = data.online.length;
      this.onlineusers = data.online;
      for (const message of this.newmessagearray) {
        if (message.status === 'not delivered') {
          const getFruit = this.onlineusers.findIndex(
            (ab) => ab.user === message.to
          );
          if (getFruit !== -1) {
            message.status = 'delivered';
            this.notdelivered.push(message);
          }
        }
      }
      if (this.notdelivered.length !== 0) {
        this.api
          .messagestatechange(this.notdelivered)
          .subscribe((res: any) => {});
      }
    });

    socket.on('totyping', (data) => {
      this.typing = data.string;
      this.newname = data.from;
    });
    socket.on('stoptyping', (data) => {
      this.typing = data.string;
      this.newname = data.from;
    });

    socket.on('read message', (data) => {
      for (const message of this.newmessagearray) {
        if (message.room === data) {
          message.status = 'read';
        }
      }
    });
  }

  /**
   * on click of sidebase component open of that friend
   * @param id change component id of user(friend)
   * @param name name of the friend
   * @param image image of the friend
   */
  changecomponent(id, name, image) {
    const socket = io('http://localhost:8000');

    /**
     * message settinges
     */
    this.messagesendid = id;
    this.chatname = name;
    this.img = image;
    const a = this.localdata.uid + id;
    const b = id + this.localdata.uid;
    const c = this.chatroom.includes(a);
    const d = this.chatroom.includes(b);
    if (this.chatroom.includes(a) || this.chatroom.includes(b)) {
      if (c === true) {
        console.log(`room is ${a}`);
        this.currentroom = a;
        console.log(this.currentroom);
        socket.emit('user with room', {
          roomis: this.currentroom,
          useris: this.localdata.uid,
        });

        setTimeout(() => {
          for (const abc of this.newmessagearray) {
            if (
              abc.to === this.localdata.uid &&
              abc.room === this.currentroom &&
              abc.status === 'delivered'
            ) {
              console.log(abc);
              if (abc.room === a) {
                abc.status = 'read';
                socket.emit('messageroomis', abc);
              }
            }
          }
        }, 2000);
      } else {
        console.log(`room is ${b}`);
        this.currentroom = b;
        console.log(this.currentroom);
        socket.emit('user with room', {
          roomis: this.currentroom,
          useris: this.localdata.uid,
        });

        setTimeout(() => {
          for (const abc of this.newmessagearray) {
            if (
              abc.to === this.localdata.uid &&
              abc.room === this.currentroom &&
              abc.status === 'delivered'
            ) {
              console.log(abc);
              if (abc.room === b) {
                abc.status = 'read';
                socket.emit('messageroomis', abc);
              }
            }
          }
        }, 2000);
      }
      console.log('already includes');
    } else {
      socket.emit('new', { me: this.localdata.uid, to: id });
      socket.on('room is', (data) => {
        const obj = {
          room: data,
        };
        this.api.getmessages(obj).subscribe((res: any) => {
          for (const message of res) {
            this.newmessagearray.push(message);
          }
        });
      });
    }

    /**
     * room for the user for chat
     */
    socket.on('room is', (data) => {
      this.chatroom.push(data);
      this.currentroom = data;
      console.log(this.currentroom);
      console.log(this.newmessagearray);

      console.log(this.currentroom);
      socket.emit('user with room', {
        roomis: this.currentroom,
        useris: this.localdata.uid,
      });

      /**
       * under construction the message read or not functionality
       */

      setTimeout(() => {
        for (const abc of this.newmessagearray) {
          // console.log(this.localdata.)
          if (
            abc.to === this.localdata.uid &&
            abc.room === this.currentroom &&
            abc.status === 'delivered'
          ) {
            console.log(abc);
            if (abc.room === data) {
              abc.status = 'read';
              socket.emit('messageroomis', abc);
            }
          }
        }
      }, 2000);
    });

    socket.on('welcome message', (data) => {
      console.log(data);
      this.newmessagearray.push(data);
      console.log(this.newmessagearray);
    });
  }

  /**
   * add the date to message
   * @param text text of the message
   */
  messagesend(text) {
    if (text.value === '' || text.value === null) {
    } else {
      const milisecond = Date.now();
      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const socket = io('http://localhost:8000');
      socket.emit('new', { me: this.localdata.uid, to: this.messagesendid });
      socket.on('room is', (data) => {
        socket.emit(data, {
          room: data,
          message: text.value,
          sendbyuid: this.localdata.uid,
          sendby: this.localdata.displayName,
          internationaldate: milisecond,
          date: `${h}:${m}:${s}`,
          to: this.messagesendid,
        });
      });
    }
    if (this.videoobject.length !== 0) {
      console.log(this.videoobject);
      console.log('fd');
      for (const file of this.videoobject) {
        console.log(file);
        this.fd.append('files[]', file, file.name);
    }
      console.log(this.fd);
      this.api.files(this.fd).subscribe((res) => {
        console.log(res);
      });
    }
  }

  /**
   * typing function
   * @param e if user is typing that is on keydown
   */
  myFunction(e) {
    const socket = io('http://localhost:8000');
    if (e.value !== '') {
      socket.emit('typing', { me: this.localdata.uid, to: this.messagesendid });
    } else {
      socket.emit('stop typing', {
        me: this.localdata.uid,
        to: this.messagesendid,
      });
    }
  }
  // tslint:disable-next-line:member-ordering
  fd = new FormData();
  createFormData(event) {
    this.selectedFile = event.target.files[0] as File;
    const fileName = this.selectedFile.name;
    const allowedextensions = new Array('mp4', 'mpg', 'mp2', 'webm');
    const allowedextensionsforimage = new Array('jpg', 'jpeg', 'png');
    const fileextension = fileName.split('.').pop().toLowerCase();
    console.log(fileextension);
    for (const a of allowedextensions) {
      if (a === fileextension) {
        console.log('file is video');
        const onefile = event.target.files[0] as File;
        console.log(this.videoobject);
        const getFruit = this.videoobject.findIndex(
          (ab) => ab.name === onefile.name
        );
        console.log(getFruit);
        if (getFruit !== -1) {
          console.log('already exist');
        } else {
          const newfile = event.target.files[0] as File;
          this.videoobject.push(newfile);
          console.log(this.videoobject);
          const file = event.target.files[0] as File;
          const b = URL.createObjectURL(file);
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(event.target.files[0] as File)
          );
          console.log(sanitizedUrl);
          console.log('yes');
          this.arrayforvideo.push(sanitizedUrl);
          console.log('array');
          console.log(this.arrayforvideo);
          this.abcd = sanitizedUrl;
          console.log('b');
          console.log(sanitizedUrl);
          console.log(typeof b);
        }
      } else {
      }
    }
    for (const b of allowedextensionsforimage) {
      if (b === fileextension) {
        console.log('file is image');
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.localUrl = e.target.result;
          console.log(this.localUrl);
          if (this.arrayforimage.length === 0) {
            this.arrayforimage.push(e.target.result);
            // console.log('in length 0')
            const newfile = event.target.files[0] as File;
            this.videoobject.push(newfile);

          } else {
            const getFruit = this.arrayforimage.findIndex(
              (ab) => ab === e.target.result
            );
            if (getFruit === -1) {
              this.arrayforimage.push(e.target.result);
              const newfile = event.target.files[0] as File;
              this.videoobject.push(newfile);
              console.log(this.videoobject);
            } else {
              console.log('already exist');
            }
          }
        };
        reader.readAsDataURL(event.target.files[0]);
        console.log(this.arrayforimage.length);
        console.log(this.arrayforimage);
      } else {
      }
    }

  }
  rmeoveimage(a) {
    const abc = this.arrayforimage.findIndex((ab) => ab === a);
    if (abc !== -1) {
      const b = this.arrayforimage.find((ab) => ab === a);
      this.arrayforimage.splice(abc, 1);
    }
    console.log(this.arrayforimage);
  }
  removevideo(ab) {
    console.log(ab);
    const abc = this.arrayforvideo.findIndex((array) => array === ab);
    console.log(abc);
    if (abc !== -1) {
      const b = this.arrayforvideo.find((array) => array === ab);
      console.log(b);
      this.arrayforvideo.splice(abc, 1);
    }
    console.log(this.arrayforvideo);
  }
}
