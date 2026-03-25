// Pure TypeScript Neural Network Engine — no external ML libraries
// Implements feedforward network with backpropagation

export type ActivationFn = 'relu' | 'sigmoid' | 'tanh';
export type DatasetType = 'circles' | 'xor' | 'spiral' | 'gaussian';

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
}

interface Layer {
  weights: number[][];   // [inputSize][outputSize]
  biases: number[];      // [outputSize]
  // Cached during forward pass for backprop
  inputs?: number[];
  outputs?: number[];
  preActivation?: number[];
}

export class NeuralNetwork {
  layers: Layer[] = [];
  activationFn: ActivationFn;

  constructor(layerSizes: number[], activation: ActivationFn = 'relu') {
    this.activationFn = activation;
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const inSize = layerSizes[i];
      const outSize = layerSizes[i + 1];
      // Xavier initialization
      const scale = Math.sqrt(2 / (inSize + outSize));
      const weights: number[][] = [];
      for (let j = 0; j < inSize; j++) {
        weights.push(Array.from({ length: outSize }, () => (Math.random() * 2 - 1) * scale));
      }
      const biases = new Array(outSize).fill(0);
      this.layers.push({ weights, biases });
    }
  }

  private activate(x: number): number {
    switch (this.activationFn) {
      case 'relu': return Math.max(0, x);
      case 'sigmoid': return 1 / (1 + Math.exp(-Math.min(Math.max(x, -500), 500)));
      case 'tanh': return Math.tanh(x);
    }
  }

  private activateDerivative(x: number): number {
    switch (this.activationFn) {
      case 'relu': return x > 0 ? 1 : 0;
      case 'sigmoid': { const s = this.activate(x); return s * (1 - s); }
      case 'tanh': { const t = Math.tanh(x); return 1 - t * t; }
    }
  }

  forward(input: number[]): number {
    let current = input;
    for (let l = 0; l < this.layers.length; l++) {
      const layer = this.layers[l];
      layer.inputs = current;
      const next: number[] = [];
      const pre: number[] = [];
      for (let j = 0; j < layer.biases.length; j++) {
        let sum = layer.biases[j];
        for (let i = 0; i < current.length; i++) {
          sum += current[i] * layer.weights[i][j];
        }
        pre.push(sum);
        // Last layer: sigmoid for binary classification
        next.push(l === this.layers.length - 1 ? 1 / (1 + Math.exp(-Math.min(Math.max(sum, -500), 500))) : this.activate(sum));
      }
      layer.preActivation = pre;
      layer.outputs = next;
      current = next;
    }
    return current[0];
  }

  backward(target: number, lr: number): number {
    const lastLayer = this.layers[this.layers.length - 1];
    const output = lastLayer.outputs![0];
    const loss = -(target * Math.log(output + 1e-10) + (1 - target) * Math.log(1 - output + 1e-10));

    // Output layer gradient (sigmoid + BCE)
    let deltas: number[][] = [];
    const outputDelta = [output - target];
    deltas.push(outputDelta);

    // Hidden layers
    for (let l = this.layers.length - 2; l >= 0; l--) {
      const layer = this.layers[l];
      const nextLayer = this.layers[l + 1];
      const nextDelta = deltas[deltas.length - 1];
      const delta: number[] = [];
      for (let i = 0; i < layer.biases.length; i++) {
        let err = 0;
        for (let j = 0; j < nextDelta.length; j++) {
          err += nextDelta[j] * nextLayer.weights[i][j];
        }
        delta.push(err * this.activateDerivative(layer.preActivation![i]));
      }
      deltas.push(delta);
    }
    deltas.reverse();

    // Update weights
    for (let l = 0; l < this.layers.length; l++) {
      const layer = this.layers[l];
      const delta = deltas[l];
      const inputs = layer.inputs!;
      for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < delta.length; j++) {
          layer.weights[i][j] -= lr * delta[j] * inputs[i];
        }
      }
      for (let j = 0; j < delta.length; j++) {
        layer.biases[j] -= lr * delta[j];
      }
    }
    return loss;
  }

  getLayerSizes(): number[] {
    if (this.layers.length === 0) return [];
    const sizes = [this.layers[0].weights.length];
    for (const l of this.layers) sizes.push(l.biases.length);
    return sizes;
  }

  getWeights(): { weights: number[][][]; biases: number[][] } {
    return {
      weights: this.layers.map(l => l.weights.map(r => [...r])),
      biases: this.layers.map(l => [...l.biases]),
    };
  }
}

// Dataset generators
export function generateDataset(type: DatasetType, n = 200): { points: number[][]; labels: number[] } {
  const points: number[][] = [];
  const labels: number[] = [];

  switch (type) {
    case 'circles': {
      for (let i = 0; i < n; i++) {
        const r = i < n / 2 ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4;
        const angle = Math.random() * Math.PI * 2;
        points.push([r * Math.cos(angle), r * Math.sin(angle)]);
        labels.push(i < n / 2 ? 0 : 1);
      }
      break;
    }
    case 'xor': {
      for (let i = 0; i < n; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        points.push([x + (Math.random() - 0.5) * 0.2, y + (Math.random() - 0.5) * 0.2]);
        labels.push((x > 0) !== (y > 0) ? 1 : 0);
      }
      break;
    }
    case 'spiral': {
      const halfN = Math.floor(n / 2);
      for (let cls = 0; cls < 2; cls++) {
        for (let i = 0; i < halfN; i++) {
          const r = (i / halfN) * 0.8 + 0.1;
          const t = (i / halfN) * Math.PI * 2.5 + cls * Math.PI + (Math.random() - 0.5) * 0.3;
          points.push([r * Math.cos(t), r * Math.sin(t)]);
          labels.push(cls);
        }
      }
      break;
    }
    case 'gaussian': {
      for (let i = 0; i < n; i++) {
        const cls = i < n / 2 ? 0 : 1;
        const cx = cls === 0 ? -0.4 : 0.4;
        const cy = cls === 0 ? -0.4 : 0.4;
        points.push([cx + (Math.random() - 0.5) * 0.6, cy + (Math.random() - 0.5) * 0.6]);
        labels.push(cls);
      }
      break;
    }
  }
  return { points, labels };
}

export function trainEpoch(
  nn: NeuralNetwork,
  points: number[][],
  labels: number[],
  lr: number
): { loss: number; accuracy: number } {
  // Shuffle
  const indices = Array.from({ length: points.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  let totalLoss = 0;
  let correct = 0;
  for (const idx of indices) {
    const output = nn.forward(points[idx]);
    totalLoss += nn.backward(labels[idx], lr);
    if ((output >= 0.5 ? 1 : 0) === labels[idx]) correct++;
  }
  return { loss: totalLoss / points.length, accuracy: correct / points.length };
}

export function computeDecisionBoundary(
  nn: NeuralNetwork,
  resolution = 40,
  range = 1.2
): number[][] {
  const grid: number[][] = [];
  for (let i = 0; i < resolution; i++) {
    const row: number[] = [];
    for (let j = 0; j < resolution; j++) {
      const x = (j / (resolution - 1)) * 2 * range - range;
      const y = (i / (resolution - 1)) * 2 * range - range;
      row.push(nn.forward([x, y]));
    }
    grid.push(row);
  }
  return grid;
}
