# Deterministic Inference Backend

FastAPI backend server for deterministic inference using vLLM with batch-invariant operations.

## Installation

### 1. Create and Activate Virtual Environment

```bash
source vllm-env/bin/activate
```

### 2. Clone vLLM Repository

```bash
cd ~
git clone https://github.com/vllm-project/vllm.git
```

### 3. Install vLLM (Nightly Build)

```bash
pip install -U vllm --extra-index-url https://wheels.vllm.ai/nightly
```

### 4. Install vLLM from Source (with Precompiled Wheels)

```bash
cd ~/vllm
export VLLM_USE_PRECOMPILED=1
pip install -e .
```

### 5. Install Batch Invariant Ops Package

Install the batch-invariant operations package from the repository:

```bash
cd batch_invariant_ops
pip install -e .
cd ..
```

### 6. Install Additional Dependencies

```bash
pip install fastapi uvicorn
```

## Running the Server

```bash
python main.py
```

The server will start on `http://0.0.0.0:8000`

## API Endpoints

### POST `/generate`

Generate text using the configured vLLM model.

**Request Body:**

```json
{
  "prompts": ["Your prompt here"],
  "temperature": 0.0,
  "top_p": 1.0,
  "top_k": 0,
  "seed": 42,
  "max_tokens": 200
}
```

**Response:**

```json
{
  "outputs": ["Generated text output"]
}
```

## Configuration

- **Model**: Qwen/Qwen2.5-1.5B-Instruct
- **Attention Backend**: FLEX_ATTENTION
- **Batch Invariant Mode**: Enabled

## Notes

- The server uses batch-invariant operations for deterministic inference
- CORS is enabled for frontend integration
- Default port: 8000
