

import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from vllm import LLM, SamplingParams
from batch_invariant_ops import enable_batch_invariant_mode
import uvicorn

# Enable batch-invariant mode
enable_batch_invariant_mode()

# Set FLEX attention backend
os.environ["VLLM_ATTENTION_BACKEND"] = "FLEX_ATTENTION"

app = FastAPI()

# CORS for frontend
origins = [
    "http://localhost:5173",  # React dev server
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM model
model = LLM("Qwen/Qwen2.5-1.5B-Instruct")

@app.post("/generate")
async def generate_text(req: Request):
    data = await req.json()
    prompts = data.get("prompts", [])

    # Sampling params (without seed for non-deterministic output)
    sampling_params = SamplingParams(
        temperature=data.get("temperature", 0.7),
        top_p=data.get("top_p", 0.9),
        top_k=data.get("top_k", 40),
        # max_output_tokens instead of `max_tokens` for vLLM 1.5+
        max_tokens=data.get("max_tokens", 200)
    )

    outputs = model.generate(prompts, sampling_params=sampling_params)
    texts = [o.outputs[0].text for o in outputs]
    return {"outputs": texts}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)