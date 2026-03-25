# Neural Playground (Neural Network Visualizer)

Interactive neural network playground that trains a small feedforward network in your browser and visualizes its decision boundary and training metrics.

## What you can do
- Choose a dataset: `Circles`, `XOR`, `Spiral`, `Gaussian`
- Pick an activation function: `ReLU`, `Sigmoid`, `Tanh`
- Change the network architecture: number of hidden layers and neurons per layer
- Adjust learning rate and run training (or stop) to see results update in real time
- Reset to regenerate a dataset and re-initialize the network

## How it works
- The neural network engine lives in `src/lib/neural-network.ts` and is implemented in pure TypeScript (no external ML libraries).
- Training uses feedforward propagation + backpropagation with a simple SGD-style weight update performed inside `trainEpoch`.
- The decision boundary is computed by evaluating the network on a grid (`computeDecisionBoundary`) and is rendered alongside the training points.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS (UI components included in `src/components/ui`)
- Charts via `recharts`

## Getting Started
### Prerequisites
- Node.js (LTS recommended)

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```
Then open `http://localhost:8080`.

            


