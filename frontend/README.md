# Deterministic Inference Comparison Frontend

A React application built with TypeScript and Tailwind CSS to compare responses from deterministic and nondeterministic vLLM endpoints.

## Features

- Single-page UI with API Base URL and Prompt inputs
- Calls both endpoints 5 times each for comparison
- Side-by-side display of results
- Clean, modern UI with Tailwind CSS

## Installation

### Local Development

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run development server:
```bash
npm run dev
# or
yarn dev
```

3. Open your browser to `http://localhost:5173`

### Production Build

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

3. Serve the production build:
```bash
npm run serve
# or
yarn serve
```

This will serve the app on port 3000.

## AWS EC2 Deployment Instructions

### Step 1: EC2 Instance Setup

1. Launch an Ubuntu 24.04 EC2 instance
2. SSH into your instance:
```bash
ssh -i your-key.pem ubuntu@<EC2-IP>
```

### Step 2: Install Node.js 20 LTS

```bash
# Update package index
sudo apt update

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### Step 3: Install Yarn (Optional)

```bash
npm install -g yarn
```

### Step 4: Clone and Setup Project

```bash
# Clone your repository
git clone <your-github-repo-url>
cd deterministic-inference/frontend

# Install dependencies
npm install
# or
yarn install

# Build the production version
npm run build
# or
yarn build
```

### Step 5: Install serve (if not already installed)

```bash
npm install -g serve
# or use npx serve (no installation needed)
```

### Step 6: Serve the Application

```bash
# Using npx (recommended)
npx serve -s dist -l 3000

# Or using globally installed serve
serve -s dist -l 3000
```

To run in the background and keep it running after SSH disconnect:

```bash
# Using nohup
nohup npx serve -s dist -l 3000 > serve.log 2>&1 &

# Or using PM2 (recommended for production)
npm install -g pm2
pm2 serve dist 3000 --name "deterministic-inference" --spa
pm2 save
pm2 startup
```

### Step 7: Configure Security Group

In AWS EC2 Console:

1. Go to your EC2 instance → Security Groups
2. Edit inbound rules:
   - **Port 3000**: Type: Custom TCP, Port: 3000, Source: 0.0.0.0/0 (for the React app)
   - **Port 8000**: Type: Custom TCP, Port: 8000, Source: Your IP or 0.0.0.0/0 (for nondeterministic vLLM)
   - **Port 8001**: Type: Custom TCP, Port: 8001, Source: Your IP or 0.0.0.0/0 (for deterministic vLLM)

### Step 8: Access the Application

Open your browser and navigate to:
```
http://<EC2-IP>:3000
```

## Testing vLLM Endpoints

Before using the React UI, verify that your vLLM endpoints are working correctly:

### Test Nondeterministic Endpoint (Port 8000)

```bash
curl -X POST http://<EC2-IP>:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-1.5B-Instruct",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "temperature": 0
  }'
```

### Test Deterministic Endpoint (Port 8001)

```bash
curl -X POST http://<EC2-IP>:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-1.5B-Instruct",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "temperature": 0
  }'
```

## Usage

1. Enter your API Base URL (e.g., `http://54.10.22.15` or `http://<EC2-IP>`)
2. Enter your prompt in the text area
3. Click "Run Test" button
4. The application will:
   - Call the nondeterministic endpoint (port 8000) 5 times
   - Call the deterministic endpoint (port 8001) 5 times
   - Display all results side-by-side for comparison

## Project Structure

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── index.tsx
    ├── App.tsx
    └── App.css
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Notes

- The application uses `temperature: 0` for both endpoints to ensure deterministic behavior
- All 5 calls are made in parallel for faster execution
- Error handling is included for failed requests
- The UI is responsive and works on both desktop and mobile devices


