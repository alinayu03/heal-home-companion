import React, { useState } from 'react';

const CallInterface = () => {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const callNurse = async () => {
    setLoading(true);
    setReply('');

    try {
      const res = await fetch('/api/ask-nurse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      console.error(err);
      setReply('Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">📞 Call the Nurse</h1>

      <textarea
        className="w-full max-w-lg p-4 border rounded-lg mb-4"
        rows={4}
        placeholder="What's your question?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors mb-8"
        onClick={callNurse}
        disabled={loading}
      >
        {loading ? 'Calling...' : 'Call Nurse'}
      </button>

      {reply && (
        <div className="w-full max-w-lg p-4 border rounded-lg bg-gray-50">
          <h2 className="font-semibold mb-2">Nurse's Reply:</h2>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
};

export default CallInterface;
