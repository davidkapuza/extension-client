import { createWS, createWSState } from "@solid-primitives/websocket";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { createEffect, createSignal, onMount } from "solid-js";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

function App() {
  let stream: MediaStream;
  let recorder: RecordRTC;

  const [text, setText] = createSignal<string>("");

  const ws = createWS("ws://localhost:3000");
  const state = createWSState(ws);
  const states = ["Connecting", "Connected", "Disconnecting", "Disconnected"];

  createEffect(() => {
    if (!ws) return;
    ws.onmessage = (event) => {
      setText(event.data);
    };
  });

  function handleDataAvailable(event: Blob) {
    if (event.size > 0) {
      console.log("blob", event);
      blobToBase64(event).then((b64) => {
        ws.send(b64);
      });
    }
  }

  async function enableMicrophone() {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new RecordRTC(stream, {
      type: "audio",
      recorderType: StereoAudioRecorder,
      mimeType: "audio/wav",
      timeSlice: 500,
      desiredSampRate: 16000,
      numberOfAudioChannels: 1,
      ondataavailable: handleDataAvailable,
    });
  }
  async function disableMicrophone() {
    stream.getTracks().forEach((track) => track.stop());
  }
  async function startRecording() {
    recorder.startRecording();
  }

  async function stopRecording() {
    ws.send("stop");
    recorder.stopRecording();
  }

  return (
    <div>
      <p>Connection: {states[state()]}</p>
      <button class="btn" onClick={enableMicrophone}>
        enableMicrophone
      </button>
      <button class="btn" onClick={disableMicrophone}>
        disableMicrophone
      </button>
      <button class="btn" onClick={startRecording}>
        startRecording
      </button>
      <button class="btn" onClick={stopRecording}>
        stopRecording
      </button>
      <textarea class="textarea textarea-bordered">{text()}</textarea>
    </div>
  );
}

export default App;
