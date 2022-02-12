<p style="text-align: right">2022-02-12</p>

# WebRTC (Web Real-Time Communication)

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API \
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols \
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity \
https://webrtcglossary.com \
https://webrtchacks.com/not-a-guide-to-sdp-munging

브라우저에서 실시간 영상통화를 WebRTC로 구현하기 위해서는 기본적으로 3개 구성요소가 필요하다.

- MediaStream
- WebSocket for Signaling
- RTCPeerConnection

## MediaDevices, MediaStream and MediaStreamTrack

https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices \
https://developer.mozilla.org/en-US/docs/Web/API/MediaStream \
https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack

MediaDevices의 getUserMedia 메소드를 이용하여 MediaStream을 얻을 수 있다. 참고로 해당 스크립트가 실행되는 호스트명이 localohst인 경우를 제외하고 https로 접속되어야 해당 메소드를 이용할 수 있다.

```js
const constraints = {
  audio: true,
  video: { width: 1280, height: 720 },
};
const stream = await navigator.mediaDevices.getUserMedia(constraints);
video_element.srcObject = stream;
// video_element.onloadedmetadata = function (e) {
//   video_element.play();
// };
```

MediaDevices의 getDisplayMedia 메소드는 화면공유를 위한 화면 MediaStream을 전달한다.

```js
const constraints = {
  video: { width: 1280, height: 720 },
};
const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
video_element.srcObject = stream;
```

MediaStream은 한개 이상의 MediaStreamTrack으로 구성되며 getTracks 메소드로 얻을 수 있다.

```js
let streamTracks = stream.getTracks();
let audioTracks = stream.getAudioTracks();
let videoTracks = stream.getVideoTracks();
console.log({ streamTracks, audioTracks, videoTracks });
```

## WebSocket for Signaling

https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

WebRTC는 기본적으로 P2P 통신방식이지만, 통신연결이 성공적으로 이루어지기 전까지 기본적인 정보를 주고받기 위한 Signal Channel이 필요하다. 이를 위해 일반적으로 WebSocket를 사용한다.

- Information about the media (Offer/Answer and SDP)
- Information about the network connection (ICE candidate)

Unfortunately, WebRTC can’t create connections without some sort of server in the middle. We call this the signal channel or signaling service. It’s any sort of channel of communication to exchange information before setting up a connection, whether by email, post card or a carrier pigeon... it’s up to you.

signal 전달을 위한 webrtc관련 client 측 프로토콜 예시는 아래와 같다.

```js
const socket = new WebSocket(url);
// binaryType property controls the type of binary data being received
// socket.binaryType = "blob"; // default
socket.binaryType = "arraybuffer";
socket.addEventListener("open", (event) => {
  clog("socket.open");
  clog({ event });
});

socket.addEventListener("message", (event) => {
  clog("socket.message");
  clog({ event });
  const { data } = event;
  try {
    clog({ data });
    const jsonData = JSON.parse(data);
    if (jsonData.cmd == "rtc_offer") {
      // offer 수락여부 확인 및 WebRTC 초기화
      init_WebRTC();
      // offer 적용 및 answer 발송
      const { offer, from, to } = jsonData;
      getOffer({ offer, from, to });
    } else if (jsonData.cmd == "rtc_accept") {
      // offer 수락요청에 대한 answer 적용
      const { answer, from, to } = jsonData;
      getAnswer({ answer, from, to });
    } else if (jsonData.cmd == "rtc_candidate") {
      // 상대측 ice candidate 수신 및 적용
      const { candidate, from, to } = jsonData;
      addIceCandidate({ candidate, from, to });
    }
  } catch (error) {
    // clog({ error });
    clog({ error: error.toString() });
  }
});

socket.addEventListener("close", (event) => {
  clog("socket.close");
  clog({ event });
});

socket.addEventListener("error", (event) => {
  clog("socket.error");
  clog({ event });
});
```

signal 전달을 위한 webrtc관련 server (Node.js) 측 프로토콜 예시이다.

```js
// https://www.npmjs.com/package/ws
// https://github.com/websockets/ws/blob/HEAD/doc/ws.md
const WebSocket = require("ws");
const { clog } = require("./utils");

let ws = { sockets: [] };

function start(props) {
  if (ws.server) return ws.server;
  clog("create WebSocketServer");
  ws.server = new WebSocket.WebSocketServer(props);
  initWSocketServer(ws.server);
  return ws.server;
}

function initWSocketServer(wss) {
  if (!wss) return;
  wss.on("connection", (socket) => {
    clog("wss.connection");
    initWSocket(socket);
  });
  wss.on("close", () => clog("wss.close"));
  wss.on("error", (error) => {
    clog("wss.close");
    clog({ error });
  });
  // wss.clients
}

function initWSocket(socket) {
  ws.sockets.push(socket);
  socket.on("close", (code, reason) => clog("socket.close"));
  socket.on("open", () => clog("socket.open"));
  socket.on("message", (data, isBinary) => {
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.cmd == "rtc_offer") {
        const { cmd, offer, from, to } = jsonData;
        const sckt_to = ws.sockets[to];
        const resp = JSON.stringify({ cmd, offer, from, to });
        sckt_to.send(resp);
      } else if (jsonData.cmd == "rtc_accept") {
        const { cmd, answer, from, to } = jsonData;
        const sckt_to = ws.sockets[to];
        const resp = JSON.stringify({ cmd, answer, from, to });
        sckt_to.send(resp);
      } else if (jsonData.cmd == "rtc_candidate") {
        const { cmd, candidate, from, to } = jsonData;
        const sckt_to = ws.sockets[to];
        const resp = JSON.stringify({ cmd, candidate, from, to });
        sckt_to.send(resp);
      }
    } catch (error) {
      clog({ error });
    }
  });
  socket.on("error", (error) => clog({ error }));
  // socket.terminate()
  // socket.ping()
}
```

## RTCPeerConnection

https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection \
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling

WebRTC의 구현이 계속 진화하고 있으며 각 브라우저마다 다른 코덱 및 기타 미디어 기능에 대한 지원 수준이 다르기 때문에, 코드 작성을 시작하기 전에 Google에서 제공하는 Adapter.js 라이브러리를 사용하는 것을 강력하게 고려해보아야합니다.

```js
const configuration = {
  iceServers: [
    /* ... */
  ],
};
const peerConnection = new RTCPeerConnection(configuration);

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onnegotiationneeded
// This event is fired when a change has occurred which requires session negotiation.
// RTCPeerConnection.addTrack triggers renegotiation by firing a negotiationneeded event.
peerConnection.onnegotiationneeded = async function () {
  clog("peerConnection.onnegotiationneeded");
};

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
// This event is fired when the local ICE agent needs to deliver a message to the other peer through the signaling server.
// When an RTCIceCandidate has been identified and added to the local peer by a call to RTCPeerConnection.setLocalDescription.
peerConnection.onicecandidate = (event) => {
  clog("peerConnection.onicecandidate");
  if (event.candidate) {
    const { candidate } = event;
    const data = JSON.stringify({ cmd: "rtc_candidate", candidate, from, to });
    socket.send(data);
  }
};

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
// This event occurs when a track has been added to the RTCPeerConnection.
// The function receives as input the event object, of type RTCTrackEvent.
peerConnection.ontrack = (event) => {
  clog("peerConnection.ontrack");
  const { streams } = event;
  const stream = streams[0];
  video_element_remote.srcObject = stream;
};

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack
// RTCPeerConnection.addTrack triggers renegotiation by firing a negotiationneeded event.
function addTrack(stream) {
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
}

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription
async function sendOffer() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  const data = JSON.stringify({ cmd: "rtc_offer", offer, from, to });
  socket.send(data);
}

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
async function getOffer(input) {
  const { offer, from, to } = input;
  await peerConnection.setRemoteDescription(offer);
  addTrack(stream);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  const data = JSON.stringify({ cmd: "rtc_accept", answer, from, to });
  socket.send(data);
}

async function getAnswer(input) {
  const { answer, from, to } = input;
  await peerConnection.setRemoteDescription(answer);
}

// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addIceCandidate
async function addIceCandidate(input) {
  const { candidate, from, to } = input;
  await peerConnection.addIceCandidate(candidate);
}
```

- addTrack > onnegotiationneeded
- setLocalDescription > onicecandidate
- setRemoteDescription > ontrack
