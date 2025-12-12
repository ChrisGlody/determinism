# Deterministic Inference Project

A full-stack application for testing and comparing deterministic vs non-deterministic LLM inference using vLLM with batch-invariant operations.

## Overview

This project provides a web interface and backend API for testing deterministic inference capabilities in vLLM. It includes:

- **Frontend**: React + TypeScript application with two testing interfaces
- **Backend**: FastAPI server with vLLM integration and batch-invariant operations
- **Batch Invariant Ops**: Custom Triton kernels for deterministic operations

## Project Structure

```
deterministic-inference/
├── frontend/          # React + TypeScript frontend application
│   ├── src/
│   │   ├── pages/    # ComparisonPage and DeterminismTester
│   │   └── components/ # Navigation component
│   └── package.json
├── backend/          # FastAPI backend server
│   ├── main.py       # Main FastAPI application
│   ├── batch_invariant_ops/  # Batch-invariant operations package
│   └── README.md     # Backend setup instructions
└── README.md         # This file
```

## Features

### Frontend Pages

1. **Comparison Page** (`/`)
   - Toggle between deterministic (port 8001) and non-deterministic (port 8000) modes
   - Run 5 tests per endpoint
   - Compare results side-by-side
   - Uses OpenAI-compatible `/v1/chat/completions` endpoint

2. **Determinism Tester** (`/determinism-tester`)
   - Configurable host and port
   - Run up to 1000 tests
   - Customizable sampling parameters (temperature, top_p, top_k, seed)
   - Uses `/generate` endpoint
   - Shows deterministic vs non-deterministic results

### Backend

- FastAPI server with vLLM integration
- Batch-invariant operations for deterministic inference
- Support for multiple endpoints:
  - `/v1/chat/completions` - OpenAI-compatible endpoint
  - `/generate` - Custom generation endpoint

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 20 LTS
- CUDA-capable GPU (for vLLM)
- Git

### Backend Setup

See [backend/README.md](backend/README.md) for detailed instructions.

**Quick steps:**

```bash
cd backend

# 1. Create virtual environment
python -m venv vllm-env
source vllm-env/bin/activate

# 2. Clone vLLM
cd ~
git clone https://github.com/vllm-project/vllm.git

# 3. Install vLLM from source
cd ~/vllm
export VLLM_USE_PRECOMPILED=1
pip install -e .

# 4. Install batch-invariant ops
cd <project-root>/backend/batch_invariant_ops
pip install -e .

# 5. Install backend dependencies
pip install fastapi uvicorn

# 6. Run backend server
cd <project-root>/backend
python main.py
```

The backend will start on `http://0.0.0.0:8000`

### Frontend Setup

See [frontend/README.md](frontend/README.md) for detailed instructions.

**Quick steps:**

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. **Start the backend server** (see Backend Setup above)
2. **Start the frontend** (see Frontend Setup above)
3. **Open your browser** to `http://localhost:5173`
4. **Navigate between pages**:
   - Comparison Page: Test deterministic vs non-deterministic endpoints
   - Determinism Tester: Run extensive determinism tests with custom parameters

## API Endpoints

### POST `/generate`

Generate text with custom sampling parameters.

**Request:**
```json
{
  "prompts": ["Your prompt here"],
  "temperature": 0.0,
  "top_p": 1.0,
  "top_k": 0,
  "seed": 42
}
```

**Response:**
```json
{
  "outputs": ["Generated text output"]
}
```

### POST `/v1/chat/completions`

OpenAI-compatible chat completions endpoint.

**Request:**
```json
{
  "model": "Qwen/Qwen2.5-1.5B-Instruct",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Response text"
    }
  }]
}
```

## Configuration

### Backend

- **Model**: Qwen/Qwen2.5-1.5B-Instruct
- **Attention Backend**: FLEX_ATTENTION
- **Batch Invariant Mode**: Enabled
- **Default Port**: 8000

### Frontend

- **Development Port**: 5173 (Vite)
- **Production Port**: 3000 (when served)

## Deployment

### AWS EC2 Deployment

See [frontend/README.md](frontend/README.md) for detailed EC2 deployment instructions.

**Quick overview:**

1. Launch Ubuntu 24.04 EC2 instance
2. Install Node.js 20 LTS
3. Clone repository
4. Build frontend: `npm run build`
5. Serve: `npx serve -s dist -l 3000`
6. Configure security groups (ports 3000, 8000, 8001)

## Testing

### Test Backend Endpoints

```bash
# Test /generate endpoint
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": ["Hello, how are you?"],
    "temperature": 0.0,
    "top_p": 1.0,
    "top_k": 0,
    "seed": 42
  }'

# Test /v1/chat/completions endpoint
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-1.5B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0
  }'
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Axios

### Backend
- FastAPI
- vLLM
- Python 3.8+
- Batch Invariant Ops (Triton kernels)
- Uvicorn

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See individual component licenses:
- Backend: See `backend/LICENSE`
- Batch Invariant Ops: See `backend/batch_invariant_ops/LICENSE`

## References

- [vLLM Documentation](https://docs.vllm.ai/)
- [Batch Invariant Operations Blog Post](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Support

For issues and questions:
- Check the individual README files in `frontend/` and `backend/` directories
- Review the API documentation above
- Check backend logs for debugging

