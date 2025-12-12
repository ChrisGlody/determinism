import { useState } from "react";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

interface Result {
  index: number;
  response: string;
  error?: string;
}

function ComparisonPage() {
  const [apiBaseUrl, setApiBaseUrl] = useState("http://54.10.22.15");
  const [prompt, setPrompt] = useState("");
  const [isDeterministic, setIsDeterministic] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const callEndpoint = async (
    url: string,
    requestBody: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const runTest = async () => {
    if (!apiBaseUrl.trim() || !prompt.trim()) {
      alert("Please fill in both API Base URL and Prompt");
      return;
    }

    setLoading(true);
    setResults([]);

    const requestBody: ChatCompletionRequest = {
      model: "Qwen/Qwen2.5-1.5B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    };

    // Use port 8001 for deterministic, port 8000 for non-deterministic
    const port = isDeterministic ? 8001 : 8000;
    const url = `${apiBaseUrl}:${port}/v1/chat/completions`;

    // Call the selected endpoint 5 times
    const promises = Array.from({ length: 5 }, async (_, index) => {
      try {
        const response = await callEndpoint(url, requestBody);
        return {
          index: index + 1,
          response:
            response.choices[0]?.message?.content || "No response content",
        } as Result;
      } catch (error) {
        return {
          index: index + 1,
          response: "",
          error: error instanceof Error ? error.message : "Unknown error",
        } as Result;
      }
    });

    // Execute all calls
    const testResults = await Promise.all(promises);
    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Deterministic Inference Comparison
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="apiUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                API Base URL
              </label>
              <input
                id="apiUrl"
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="http://54.10.22.15"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
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
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  Deterministic Mode
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {isDeterministic ? "Port 8001" : "Port 8000"}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeterministic}
                  onChange={(e) => setIsDeterministic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button
              onClick={runTest}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Running Test..." : "Run Test"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Calling endpoint...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              {isDeterministic ? "Deterministic" : "Non-Deterministic"} vLLM
              Results (Port {isDeterministic ? 8001 : 8000})
            </h2>
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.index}
                  className="border border-gray-200 rounded-md p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Result #{result.index}
                    </span>
                  </div>
                  {result.error ? (
                    <div className="text-red-600 text-sm font-mono bg-red-50 p-2 rounded">
                      Error: {result.error}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-800 font-mono bg-white p-3 rounded border border-gray-200 whitespace-pre-wrap break-words">
                      {result.response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonPage;

