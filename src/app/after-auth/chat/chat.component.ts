import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { ApiCalls } from '../../services/apicalls.service';
import * as io from 'socket.io-client';
import { DomSanitizer } from '@angular/platform-browser';
declare const $: any;
import { SocketServiceService } from '../../services/socket-service.service';
// import { simple}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [NgbModalConfig, NgbModal]
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
  closeResult: string;
  grouparray = [];
  selectedFileforgroup: File;
  grouproomid: any;

  // tslint:disable-next-line:max-line-length
  constructor( private api: ApiCalls, private modalService: NgbModal , private sanitizer: DomSanitizer, private socketurl: SocketServiceService) {}
  ngOnInit() {

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
    this.api.getgroup(this.objectofid).subscribe((res: any) => {
      console.log('res of group');
      console.log(res);

      for (const group of res) {
        const newdata = {
          uid: group.uid,
          name: group.groupname,
          image: group.filename,
          groupid: group.uid
        };
        this.datas.push(newdata);
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

    socket.on('group', (data) => {
      console.log('iiiiiiiii');
      console.log(data);
      const newdata = {
        uid: data.uid,
        name: data.groupname,
        image: data.filename,
        groupid: data.uid
      };
      this.datas.push(newdata);
    });


    socket.on('read message', (data) => {
      for (const message of this.newmessagearray) {
        if (message.room === data) {
          message.status = 'read';
        }
      }
    });
    setTimeout(() => {

      console.log(this.datas);
      for (const a of this.datas) {
      console.log(a.groupid);
      }
    }, 2000);

  }

  /**
   * on click of sidebase component open of that friend
   * @param id change component id of user(friend)
   * @param name name of the friend
   * @param image image of the friend
   */

  changecomponent(id, name, image, groupid) {
    // console.log(id);
    // console.log(name);
    // console.log(image);
    // console.log(groupid);
    const socket = io('http://localhost:8000');

    /**
     * message settinges
     */
    this.grouproomid = groupid;
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
      if (groupid === undefined) {
      socket.emit('new', { me: this.localdata.uid, to: id });
      socket.on('room is', (data) => {
        console.log('room is');
        console.log(data);
        const obj = {
          room: data,
        };
        this.api.getmessages(obj).subscribe((res: any) => {
          for (const message of res) {
            this.newmessagearray.push(message);
          }
        });
      });
    } else {
      console.log('group');
      socket.emit('groupid', { grouproom: groupid});
      socket.on('room is', (data) => {
        console.log('room is');
        console.log(data);
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
    }

    /**
     * room for the user for chat
     */
    socket.on('room is', (data) => {
      console.log('room is');
      console.log(data);
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
    socket.on('group message', (data) => {
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
      if (this.grouproomid === undefined) {
      socket.emit('new', { me: this.localdata.uid, to: this.messagesendid });
      socket.on('room is', (data) => {
        console.log('room is');
        console.log(data);
        socket.emit(data, {
          room: data,
          message: text.value,
          sendbyuid: this.localdata.uid,
          sendby: this.localdata.displayName,
          internationaldate: milisecond,
          date: `${h}:${m}:${s}`,
          to: this.messagesendid,
          type: 'text'
        });
      });
    } else {
      // socket.emit('new', { me: this.localdata.uid, to: this.messagesendid });
      socket.emit('groupid', { grouproom: this.grouproomid});
      socket.on('room is', (data) => {
        console.log('room is');
        console.log(data);
        socket.emit(data, {
          room: data,
          message: text.value,
          sendbyuid: this.localdata.uid,
          sendby: this.localdata.displayName,
          internationaldate: milisecond,
          date: `${h}:${m}:${s}`,
          to: this.messagesendid,
          type: 'text'
        });
      });
    }
    }
    if (this.videoobject.length !== 0 && this.videoobject.length !== null) {
      console.log(this.videoobject);
      console.log('fd');
      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const response = this.videoobject.filter((n) => n.room === this.currentroom);
      console.log(response);
      for (const file of response) {
        console.log(file);
        this.fd.append('files[]', file.newfile, file.newfile.name);
    }
      this.fd.append('room', this.currentroom);
      this.fd.append('sendbyuid', this.localdata.uid);
      this.fd.append('sendby', this.localdata.displayName);
      this.fd.append('date', `${h}:${m}:${s}`);
      this.fd.append('to', this.messagesendid);
      console.log(this.fd);
      this.api.files(this.fd).subscribe((res) => {
        console.log(res);

      });
      const newarray = this.videoobject.filter((n) => n.room !== this.currentroom);
      console.log(newarray);
      this.videoobject = newarray;
      console.log(this.videoobject);
      const newarrayforvideo = this.arrayforvideo.filter((n) => n.room !== this.currentroom);
      console.log(newarrayforvideo);
      this.arrayforvideo = newarrayforvideo;
      const newarrayforimage = this.arrayforimage.filter((n) => n.room !== this.currentroom);
      console.log(newarrayforimage);
      this.arrayforimage = newarrayforimage;
    } else {
      console.log('please enter some files');
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
          const newfileobject = event.target.files[0] as File;
          const object = {
            newfile: newfileobject,
            room: this.currentroom,
          };
          this.videoobject.push(object);
          console.log('room of video');
          console.log(this.videoobject);
          console.log(this.videoobject);
          const file = event.target.files[0] as File;
          const b = URL.createObjectURL(file);
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(event.target.files[0] as File)
          );
          console.log(sanitizedUrl);
          console.log('yes');
          const objectofvideourl = {
            url: sanitizedUrl,
            room: this.currentroom,
          };
          this.arrayforvideo.push(objectofvideourl);
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
            const objectofimage = {
              img: e.target.result,
              room: this.currentroom,
            };
            this.arrayforimage.push(objectofimage);
            // console.log('in length 0')
            const newfileobject = event.target.files[0] as File;
            const object = {
              newfile: newfileobject,
              room: this.currentroom,
            };
            this.videoobject.push(object);

          } else {
            const getFruit = this.arrayforimage.findIndex(
              (ab) => ab === e.target.result
            );
            if (getFruit === -1) {
              const objectofimage = {
                img: e.target.result,
                room: this.currentroom,
              };
              this.arrayforimage.push(objectofimage);
              const newfileobject = event.target.files[0] as File;
              const object = {
                newfile: newfileobject,
                room: this.currentroom,
              };
              this.videoobject.push(object);
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
  open(content) {
    this.modalService.open(content);
  }
  chacked(id, value) {
    console.log(id);
    console.log(value);
    console.log(value.target.checked);
    // console.log(value.value);
    if (value.target.checked === true) {
      this.grouparray.push(id);
    } else if (value.target.checked === false) {
      const a = this.grouparray.findIndex(ab => ab === id);
      this.grouparray.splice(a, 1);
    }
    console.log(this.grouparray);
  }
  // tslint:disable-next-line:member-ordering
  groupformdata = new FormData();
  createFormDataforgroupimage(event) {
    this.selectedFileforgroup = event.target.files[0] as File;
    }
    closeandsenddata(a) {
      this.groupformdata.append('uploadfile', this.selectedFileforgroup, this.selectedFileforgroup.name);
      this.groupformdata.append('groupname', a.value);
      this.groupformdata.append('adminname', this.localdata.displayName);
      this.grouparray.push(this.localdata.uid);
      for (const abc of this.grouparray) {
      this.groupformdata.append('members[]', abc);
      }
      this.groupformdata.append('adminid', this.localdata.uid);
      this.api.groupdetail(this.groupformdata).subscribe(res => {
        console.log('ioioioio');
      });

      this.modalService.dismissAll();
    }
}
