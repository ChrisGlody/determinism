import { useState } from "react";
import axios from "axios";

const DeterminismTester = () => {
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("8000");
  const [prompt, setPrompt] = useState("");
  const [numTests, setNumTests] = useState("100");
  const [temperature, setTemperature] = useState("0.0");
  const [topP, setTopP] = useState("1.0");
  const [topK, setTopK] = useState("0");
  const [seed, setSeed] = useState("42");
  const [outputs, setOutputs] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const testDeterminism = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    if (!host.trim() || !port.trim()) {
      alert("Please fill in both Host and Port");
      return;
    }

    const numTestsValue = parseInt(numTests);
    if (isNaN(numTestsValue) || numTestsValue < 1 || numTestsValue > 1000) {
      alert("Number of tests must be between 1 and 1000");
      return;
    }

    setLoading(true);
    setOutputs([]);
    setSummary("");

    try {
      const allOutputs: string[] = [];

      // Construct URL from host and port
      const baseUrl = host.startsWith("http://") || host.startsWith("https://")
        ? `${host}:${port}`
        : `http://${host}:${port}`;
      const url = `${baseUrl}/generate`;

      // Parse parameters with defaults
      const temperatureValue = parseFloat(temperature) || 0.0;
      const topPValue = parseFloat(topP) || 1.0;
      const topKValue = parseInt(topK) || 0;
      const seedValue = parseInt(seed) || 42;

      for (let i = 0; i < numTestsValue; i++) {
        const response = await axios.post(url, {
          prompts: [prompt],
          temperature: temperatureValue,
          top_p: topPValue,
          top_k: topKValue,
          seed: seedValue,
        });
        allOutputs.push(response.data.outputs[0]);
      }

      setOutputs(allOutputs);

      // Check if all outputs are identical
      const deterministic = allOutputs.every((o) => o === allOutputs[0]);
      setSummary(
        deterministic
          ? "✅ Deterministic: All outputs are identical."
          : "⚠️ Non-deterministic: Outputs differ."
      );
    } catch (error) {
      console.error(error);
      setSummary("❌ Error while generating outputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Determinism Tester
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="host"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Host
                </label>
                <input
                  id="host"
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="localhost"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="port"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Port
                </label>
                <input
                  id="port"
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="8000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Endpoint URL:</p>
              <p className="text-sm font-mono text-gray-700">
                {host.trim() && port.trim()
                  ? `${
                      host.startsWith("http://") || host.startsWith("https://")
                        ? `${host}:${port}`
                        : `http://${host}:${port}`
                    }/generate`
                  : "Enter host and port"}
              </p>
            </div>
            <div>
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prompt
              </label>
              <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Test Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="numTests"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Number of Tests
                  </label>
                  <input
                    id="numTests"
                    type="number"
                    min="1"
                    max="1000"
                    value={numTests}
                    onChange={(e) => setNumTests(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="seed"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Seed
                  </label>
                  <input
                    id="seed"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="42"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Sampling Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="temperature"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Temperature
                  </label>
                  <input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="topP"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Top P
                  </label>
                  <input
                    id="topP"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={topP}
                    onChange={(e) => setTopP(e.target.value)}
                    placeholder="1.0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="topK"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Top K
                  </label>
                  <input
                    id="topK"
                    type="number"
                    min="0"
                    value={topK}
                    onChange={(e) => setTopK(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={testDeterminism}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? `Testing... (${outputs.length}/${numTests})`
                : `Run ${numTests} Tests`}
            </button>
          </div>
        </div>

        {summary && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <p
              className={`text-lg font-medium ${
                summary.includes("✅")
                  ? "text-green-600"
                  : summary.includes("⚠️")
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {summary}
            </p>
          </div>
        )}

        {outputs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Outputs ({outputs.length} results)
            </h2>
            <div
              className="space-y-2 max-h-[600px] overflow-y-auto"
              style={{ maxHeight: "600px" }}
            >
              {outputs.map((o, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-md p-3 bg-gray-50"
                >
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Output #{idx + 1}:
                  </div>
                  <pre className="text-sm text-gray-800 font-mono bg-white p-2 rounded border border-gray-200 whitespace-pre-wrap break-words">
                    {o}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeterminismTester;

