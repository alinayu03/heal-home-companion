import React, { useState, useRef, useEffect } from "react";

const CallInterface = () => {
  const [conversation, setConversation] = useState([
    {
      role: "nurse",
      content:
        "Good morning. This is Nurse Sarah calling from Heal Home Companion regarding your knee surgery last week. How are you feeling today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const recognitionRef = useRef(null);
  const [voice, setVoice] = useState(null);

  // Initialize Speech Recognition
  if (
    typeof window !== "undefined" &&
    "webkitSpeechRecognition" in window &&
    !recognitionRef.current
  ) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
  }

  // Get the desired voice when available
  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    const googleUKVoice = voices.find(
      (voice) => voice.name === "Google UK English Female"
    );

    if (googleUKVoice) {
      setVoice(googleUKVoice);
    }

    // Update voices list if needed
    const onVoicesChanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      const updatedGoogleUKVoice = updatedVoices.find(
        (voice) => voice.name === "Google UK English Female"
      );
      if (updatedGoogleUKVoice) {
        setVoice(updatedGoogleUKVoice);
      }
    };

    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Start listening when required
  useEffect(() => {
    const recognition = recognitionRef.current;

    if (listening && recognition) {
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserTranscript(transcript);
        addMessage("user", transcript);
        handleUserResponse(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };
    }
  }, [listening]); // Trigger only when listening is true

  const speak = (text, callback) => {
    if (!voice) {
      alert("Voice not available.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Trigger next question after speech ends
    utterance.onend = () => {
      if (callback) callback(); // Start listening after speech ends
    };

    window.speechSynthesis.speak(utterance);
  };

  const addMessage = (role, content) => {
    setConversation((prev) => [...prev, { role, content }]);
  };

  const handleUserResponse = (response) => {
    const questions = [
      {
        key: "painIntensity",
        question:
          "On a scale of 0 (no pain) to 10 (worst pain), how would you rate your discomfort? Can you describe its quality (sharp, throbbing, etc.)?",
      },
      {
        key: "painOnset",
        question:
          "When did your pain begin or worsen? Has it changed since yesterday?",
      },
      {
        key: "swellingWarmth",
        question:
          "Is there any new swelling or warmth around the surgical site?",
      },
      {
        key: "feverMeasurement",
        question:
          "Have you checked your temperature? What reading did you get and when?",
      },
      {
        key: "weightBearingMobility",
        question:
          "Are you able to bear weight on that leg or bend your knee? If so, how much discomfort do you feel?",
      },
      // {
      //   key: "medicationAdherence",
      //   question:
      //     "Which antibiotics and pain medications are you taking? Are you following the prescribed doses and schedule?",
      // },
      // {
      //   key: "woundAppearance",
      //   question:
      //     "Have you noticed any redness, streaking, or other changes around the incision?",
      // },
      // {
      //   key: "drainageCharacteristics",
      //   question:
      //     "Is there any discharge? What color, amount, consistency, and odor, if any?",
      // },
      // {
      //   key: "systemicSymptoms",
      //   question:
      //     "Aside from the site‑specific issues, have you experienced chills, rigors, fatigue, or loss of appetite?",
      // },
      // {
      //   key: "fluidNutritionIntake",
      //   question:
      //     "How is your appetite? What and how much have you eaten or drunk today?",
      // },
      // {
      //   key: "activityRest",
      //   question:
      //     "Are you keeping the leg elevated and resting as instructed? Any difficulty with your home exercises?",
      // },
      // {
      //   key: "nextStepPlanning",
      //   question:
      //     "Would you like me to contact your surgeon’s office now for further evaluation?",
      // },
    ];
    // Update recovery status with the user's response
    setRecoveryStatus((prevStatus) => ({
      ...prevStatus,
      [questions[questionIndex].key]: response,
    }));

    // Increment the questionIndex to go to the next question
    setQuestionIndex((prevIndex) => prevIndex + 1);

    // Check if there are more questions
    if (questionIndex + 1 < questions.length) {
      const nextQuestion = questions[questionIndex + 1];
      addMessage("nurse", nextQuestion.question);
      speak(nextQuestion.question, () => {
        setListening(true);
      });
    } else {
      saveTranscript();
    }
  };

  const saveTranscript = () => {
    const blob = new Blob([JSON.stringify(conversation)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartConversation = () => {
    setConversation([]);
    setIsAnswering(true);
    setQuestionIndex(0);
    addMessage("nurse", conversation[0].content);
    speak(conversation[0].content, () => {
      setListening(true);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">📞 Call the Nurse</h1>

      {!isAnswering ? (
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
          onClick={handleStartConversation}
        >
          Start the Call
        </button>
      ) : (
        <>
          <div className="overflow-y-auto h-96 mb-6 bg-gray-100 p-4 rounded-lg shadow-lg w-full">
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${message.role === "nurse" ? "bg-blue-200" : "bg-green-200"
                    }`}
                >
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="real-time-transcript">
            <h2 className="text-xl font-semibold">Your Response:</h2>
            <p className="p-4 bg-gray-200 rounded-lg">{userTranscript}</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default CallInterface;
