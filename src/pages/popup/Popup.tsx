import "@src/styles/index.css";
import { Copy, Mic, MicOff } from "lucide-solid";
import { For, Show, createEffect, createSignal } from "solid-js";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const loremWordsArray =
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde magnam similique rem optio sequi dicta accusamus voluptatem non, eos, impedit quidem recusandae earum inventore iusto dolore fugit ipsam autem nemo minus officiis quibusdam. Ea sed accusamus et quo totam numquam.".split(
    " "
  );

function generateRandomSentence() {
  const sentenceLength = Math.floor(Math.random() * 12) + 4; // Random length between 4 and 16
  const sentence = [];

  for (let i = 0; i < sentenceLength; i++) {
    const randomIndex = Math.floor(Math.random() * loremWordsArray.length);
    sentence.push(loremWordsArray[randomIndex]);
  }

  return sentence.join(" ");
}

const initialMessages = [];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Timer = { h: string; m: string; s: string };

const initialTimer = {
  h: "00",
  m: "00",
  s: "00",
};

function toDecimal(ms: number): string {
  return Math.floor(ms).toString().padStart(2, "0");
}

const Popup = () => {
  const [messages, setMessages] = createSignal<string[]>(initialMessages);
  const [isRecording, setIsRecording] = createSignal<boolean>(false);
  const [isMutted, setIsMutted] = createSignal<boolean>(false);
  const [isCopied, setIsCopied] = createSignal<boolean>(false);
  const [time, setTime] = createSignal<Timer>(initialTimer);

  let timeout,
    messagesTimeout,
    startTime = 0,
    bottom: HTMLDivElement;

  createEffect(() => {
    if (isRecording()) {
      startTime = Date.now();
      (function timer() {
        setTime({
          h: toDecimal(((Date.now() - startTime) / HOUR) % 24),
          m: toDecimal(((Date.now() - startTime) / MINUTE) % 60),
          s: toDecimal(((Date.now() - startTime) / SECOND) % 60),
        });
        timeout = setTimeout(timer, 1000);
      })();
    } else {
      if (timeout) clearTimeout(timeout);
    }
  });

  createEffect(() => {
    if (isRecording()) {
      (function addMessage() {
        setMessages((prev) => [...prev, generateRandomSentence()]);
        bottom.scrollIntoView({ behavior: "smooth" });
        messagesTimeout = setTimeout(addMessage, getRandomInt(1000, 4000));
      })();
    } else {
      if (messagesTimeout) clearTimeout(messagesTimeout);
    }
  });

  const toggleRecording = () => {
    setIsRecording(!isRecording());
  };

  const toggleMutted = () => {
    setIsMutted(!isMutted());
  };
  
  createEffect(() => {
    if (isCopied()) {
      setTimeout(() => setIsCopied(false), 500)
    }
  })

  const handleMessagesCopy = () => {
    setIsCopied(true)
    navigator.clipboard.writeText(messages().join(" "))
  };

  return (
    <div class="flex h-full relative flex-col items-center p-6">
      <div class="fixed top-0 left-0 right-0 flex flex-col items-center bg-base-to-transparent p-6 z-10">
        <header class="w-full">
          <span class="text-2xl leading-none">🎙️</span>
        </header>
        <div class="w-full text-start pt-3 font-light">
          <span class="countdown">
            <span style={{ "--value": time().m }} />:
            <span style={{ "--value": time().s }} />
          </span>
        </div>
        <div class="outline outline-1 outline-secondary outline-offset-12 rounded-full w-24 min-h-24 flex ">
          <button
            classList={{
              "hover:scale-95 text-xs font-light m-auto transition-size duration-500 ease-in-out":
                true,
              "w-20 h-20 btn btn-circle btn-accent shadow-btn text-white":
                !isRecording(),
              "w-6 h-6 animate-pulse": isRecording(),
            }}
            onClick={toggleRecording}
          >
            {isRecording() ? (
              <div class="w-full h-full rounded shadow-xl shadow-accent bg-accent" />
            ) : (
              <Mic />
            )}
          </button>
        </div>
        <div class="pt-8 text-neutral">
          <div class="tooltip" data-tip={isCopied() ? "Copied 🎉" : "Copy"}>
            <button disabled={messages().length === 0 || isCopied()} onClick={handleMessagesCopy} class="btn btn-outline border-secondary btn-circle btn-sm mr-2">
              <Copy class="h-3.5" />
            </button>
          </div>
          <div class="tooltip" data-tip={isMutted() ? "Unmute" : "Mute"}>
            <button disabled={!isRecording()} onClick={toggleMutted} classList={{"btn btn-outline border-secondary btn-circle btn-sm": true, "btn-active": isMutted()}}>
              <MicOff class="h-3.5" />
            </button>
          </div>
        </div>
        <Show
          when={isRecording() || messages().length > 0}
        >
          <h1 class="py-5 w-full text-start">Transcription:</h1>
        </Show>
      </div>

      <div class="flex flex-col w-full mt-[270px] pb-10">
        <For each={messages()}>
          {(message) => (
            <div class="chat chat-start">
              <div class="chat-bubble chat-bubble-secondary min-h-0">
                {message}
              </div>
            </div>
          )}
        </For>
        <div ref={bottom} />
      </div>
      <div class="fixed bottom-0 w-full bg-transparent-to-base h-6" />
    </div>
  );
};

export default Popup;
