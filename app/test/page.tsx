"use client";

import { useEffect, useRef, useState } from "react";

const jokes = [
  { setup: "Why don't programmers like nature?", punchline: "It has too many bugs!" },
  { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear!" },
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field!" },
  { setup: "What do you call a fake noodle?", punchline: "An impasta!" },
  { setup: "Why did the cookie go to the doctor?", punchline: "Because it was feeling crumbly!" },
  { setup: "What do you call a dinosaur that crashes his car?", punchline: "Tyrannosaurus wrecks!" },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack up!" },
  { setup: "What do you call a sleeping bull?", punchline: "A bulldozer!" },
  { setup: "Why did the math book look so sad?", punchline: "Because it had too many problems!" },
  { setup: "What do you call a can opener that doesn't work?", punchline: "A can't opener!" }
];

const getRandomJoke = () => {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  return {
    success: true,
    message: "Here's a joke for you!",
    setup: joke.setup,
    punchline: joke.punchline
  };
};

export default function TestPage() {
  interface JokeResult {
    success: boolean;
    message: string;
    setup: string;
    punchline: string;
  }

  type JokeFunction = () => JokeResult;
  const [status, setStatus] = useState("Ready to start");
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Function registry
  const functionRegistry = useRef<Record<string, JokeFunction>>({
    tell_joke: getRandomJoke
  });

  const startSession = async () => {
    try {
      // 1. Get microphone access
      setStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // 2. Get ephemeral token
      setStatus("Getting session token...");
      const tokenResponse = await fetch("/api/rtc-test", {
        method: "POST",
      });
      if (!tokenResponse.ok) throw new Error("Failed to get token");
      const tokenData = await tokenResponse.json();
      const ephemeralToken = tokenData.client_secret.value;

      // 3. Setup WebRTC
      setStatus("Setting up connection...");
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Setup audio playback
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      
      // Handle incoming audio
      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];
      };

      // Setup data channel
      const dataChannel = pc.createDataChannel("response");
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        console.log("Data channel opened");
        // Send initial session config
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            tools: [{
              type: "function",
              name: "tell_joke",
              description: "Tells a random joke",
              parameters: {
                type: "object",
                properties: {},
                required: []
              }
            }],
            tool_choice: "auto",
            input_audio_transcription: {
              model: "whisper-1",
            },
          },
        };
        dataChannel.send(JSON.stringify(sessionUpdate));
      };

      // Handle incoming messages
      dataChannel.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log("Received message:", msg);

          // Handle transcriptions
          if (msg.type === "conversation.item.input_audio_transcription") {
            setTranscript(msg.transcript || msg.text || "Processing...");
          }
          // Handle final transcriptions
          else if (msg.type === "conversation.item.input_audio_transcription.completed") {
            setTranscript(msg.transcript);
          }
          // Handle assistant responses
          else if (msg.type === "response.audio_transcript.delta") {
            setTranscript(prev => prev + msg.delta);
          }
          // Handle function calls
          else if (msg.type === "response.function_call_arguments.done") {
            console.log("Function call received:", msg);
            const fn = functionRegistry.current[msg.name];
            if (fn) {
              const result = fn();
              console.log("Function result:", result);

              // Send function result
              const response = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: msg.call_id,
                  output: JSON.stringify(result)
                }
              };
              dataChannel.send(JSON.stringify(response));

              // Request AI response
              const responseCreate = {
                type: "response.create"
              };
              dataChannel.send(JSON.stringify(responseCreate));
            }
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      };

      // Add audio track
      pc.addTrack(stream.getTracks()[0]);

      // Create and set local description
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to OpenAI
      setStatus("Connecting to OpenAI...");
      const response = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralToken}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!response.ok) throw new Error("Failed to connect to OpenAI");

      // Set remote description
      const answerSdp = await response.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsActive(true);
      setStatus("Connected! Start speaking...");
    } catch (error: unknown) {
      console.error("Error:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      stopSession();
    }
  };

  const stopSession = () => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    setIsActive(false);
    setStatus("Ready to start");
    setTranscript("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">WebRTC Voice Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <p className="font-semibold">Status: {status}</p>
        </div>

        <div className="p-4 border rounded min-h-[100px]">
          <p className="font-semibold mb-2">Transcript:</p>
          <p>{transcript || "No transcript yet..."}</p>
        </div>

        <button
          onClick={() => isActive ? stopSession() : startSession()}
          className={`px-4 py-2 rounded ${
            isActive 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isActive ? "Stop" : "Start"}
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p>Instructions:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Click Start to begin a session</li>
          <li>Allow microphone access when prompted</li>
          <li>Start speaking - your words will appear in the transcript</li>
          <li>The assistant will respond through your speakers</li>
          <li>Click Stop when finished</li>
        </ol>
      </div>
    </div>
  );
}
