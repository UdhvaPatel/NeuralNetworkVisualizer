import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NeuralNetwork, generateDataset, trainEpoch, computeDecisionBoundary, ActivationFn, DatasetType, TrainingMetrics } from '@/lib/neural-network';
import DecisionBoundary from '@/components/DecisionBoundary';
import NetworkVisualizer from '@/components/NetworkVisualizer';
import MetricsChart from '@/components/MetricsChart';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Square, RotateCcw, Plus, Minus, Brain, Zap, Github, BookOpen } from 'lucide-react';

const DATASETS: { value: DatasetType; label: string; icon: string }[] = [
  { value: 'circles', label: 'Circles', icon: '◎' },
  { value: 'xor', label: 'XOR', icon: '⊕' },
  { value: 'spiral', label: 'Spiral', icon: '🌀' },
  { value: 'gaussian', label: 'Gaussian', icon: '◐' },
];

const ACTIVATIONS: ActivationFn[] = ['relu', 'sigmoid', 'tanh'];

const InfoHint: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="More information"
      >
        (i)
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" className="font-mono text-xs max-w-xs">
      {text}
    </TooltipContent>
  </Tooltip>
);

const Playground: React.FC = () => {
  const [datasetType, setDatasetType] = useState<DatasetType>('spiral');
  const [activation, setActivation] = useState<ActivationFn>('relu');
  const [hiddenLayers, setHiddenLayers] = useState([6, 4]);
  const [learningRate, setLearningRate] = useState(0.03);
  const [isTraining, setIsTraining] = useState(false);
  const [metricsHistory, setMetricsHistory] = useState<TrainingMetrics[]>([]);
  const [grid, setGrid] = useState<number[][]>([]);
  const [epoch, setEpoch] = useState(0);

  const nnRef = useRef<NeuralNetwork | null>(null);
  const dataRef = useRef(generateDataset(datasetType));
  const trainingRef = useRef(false);

  const layerSizes = [2, ...hiddenLayers, 1];

  const initNetwork = useCallback(() => {
    nnRef.current = new NeuralNetwork(layerSizes, activation);
    const boundary = computeDecisionBoundary(nnRef.current);
    setGrid(boundary);
    setMetricsHistory([]);
    setEpoch(0);
  }, [JSON.stringify(layerSizes), activation]);

  const regenerateData = useCallback(() => {
    dataRef.current = generateDataset(datasetType);
    initNetwork();
  }, [datasetType, initNetwork]);

  useEffect(() => {
    regenerateData();
  }, [regenerateData]);

  const trainStep = useCallback(() => {
    if (!nnRef.current || !trainingRef.current) return;
    
    const { points, labels } = dataRef.current;
    const metrics = trainEpoch(nnRef.current, points, labels, learningRate);
    const boundary = computeDecisionBoundary(nnRef.current);
    
    setEpoch(prev => {
      const newEpoch = prev + 1;
      setMetricsHistory(h => [...h, { epoch: newEpoch, ...metrics }]);
      return newEpoch;
    });
    setGrid(boundary);

    if (trainingRef.current) {
      requestAnimationFrame(trainStep);
    }
  }, [learningRate]);

  const toggleTraining = useCallback(() => {
    if (isTraining) {
      trainingRef.current = false;
      setIsTraining(false);
    } else {
      if (!nnRef.current) initNetwork();
      trainingRef.current = true;
      setIsTraining(true);
      requestAnimationFrame(trainStep);
    }
  }, [isTraining, trainStep, initNetwork]);

  const reset = useCallback(() => {
    trainingRef.current = false;
    setIsTraining(false);
    regenerateData();
  }, [regenerateData]);

  const addLayer = () => {
    if (hiddenLayers.length < 5) {
      trainingRef.current = false;
      setIsTraining(false);
      setHiddenLayers([...hiddenLayers, 4]);
    }
  };

  const removeLayer = () => {
    if (hiddenLayers.length > 1) {
      trainingRef.current = false;
      setIsTraining(false);
      setHiddenLayers(hiddenLayers.slice(0, -1));
    }
  };

  const updateNeurons = (layerIdx: number, delta: number) => {
    const newLayers = [...hiddenLayers];
    newLayers[layerIdx] = Math.max(1, Math.min(10, newLayers[layerIdx] + delta));
    trainingRef.current = false;
    setIsTraining(false);
    setHiddenLayers(newLayers);
  };

  const { points, labels } = dataRef.current;

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-xl font-bold font-mono neon-text tracking-tight">
                Neural Playground
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Interactive Neural Network Visualizer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
              Epoch: <span className="neon-text">{epoch}</span>
            </span> */}
            <a
              href="https://udhvapatel.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Portfolio
            </a>
            <a
              href="https://github.com/UdhvaPatel/ingenuity-ai-forge.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Panel — Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Dataset */}
            <div className="glass-panel p-4 space-y-3">
              <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Dataset
                <InfoHint text="A dataset is the set of input points and class labels used to train the network." />
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {DATASETS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => { setDatasetType(d.value); }}
                    className={`px-3 py-2 rounded-md font-mono text-xs transition-all border ${
                      datasetType === d.value
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <span className="text-base mr-1">{d.icon}</span>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activation */}
            <div className="glass-panel p-4 space-y-3">
              <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                Activation
                <InfoHint text="Activation controls how each neuron transforms its input before passing it forward." />
              </h2>
              <Select value={activation} onValueChange={(v) => { setActivation(v as ActivationFn); }}>
                <SelectTrigger className="font-mono text-sm bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVATIONS.map(a => (
                    <SelectItem key={a} value={a} className="font-mono">{a.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Learning Rate */}
            <div className="glass-panel p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  Learning Rate
                  <InfoHint text="Learning rate sets how large each training update step is." />
                </h2>
                <span className="font-mono text-xs neon-text">{learningRate.toFixed(3)}</span>
              </div>
              <Slider
                value={[learningRate]}
                onValueChange={([v]) => setLearningRate(v)}
                min={0.001}
                max={0.1}
                step={0.001}
                className="cursor-pointer"
              />
            </div>

            {/* Architecture */}
            <div className="glass-panel p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  Layers
                  <InfoHint text="Layers are groups of neurons; deeper networks can learn more complex patterns." />
                </h2>
                <div className="flex gap-1">
                  <button onClick={removeLayer} className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button onClick={addLayer} className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {hiddenLayers.map((neurons, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">Layer {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateNeurons(i, -1)}
                        className="w-5 h-5 rounded bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
                      >−</button>
                      <span className="font-mono text-sm neon-text w-6 text-center">{neurons}</span>
                      <button
                        onClick={() => updateNeurons(i, 1)}
                        className="w-5 h-5 rounded bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                onClick={toggleTraining}
                className={`flex-1 font-mono text-sm gap-2 ${
                  isTraining
                    ? 'bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30'
                    : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                }`}
                variant="outline"
              >
                {isTraining ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTraining ? 'Stop' : 'Train'}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="font-mono text-sm border-border text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Center — Decision Boundary */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Decision Boundary
                  <span className="ml-1 inline-flex align-middle">
                    <InfoHint text="The decision boundary is the line or region that separates predicted classes." />
                  </span>
                </h2>
                <div className="flex gap-3 font-mono text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Class 0
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary" /> Class 1
                  </span>
                </div>
              </div>
              <DecisionBoundary
                grid={grid}
                points={points}
                labels={labels}
              />
              <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
              Epoch: <span className="neon-text">{epoch}</span>
              <span className="ml-1 inline-flex align-middle">
                <InfoHint text="An epoch is one full pass through the training dataset." />
              </span>
            </span>
            </div>
            
          </div>

          {/* Right Panel — Network & Metrics */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-4 space-y-3">
              <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Network Architecture
                <span className="ml-1 inline-flex align-middle">
                  <InfoHint text="Network architecture is the structure of layers and neuron counts in the model." />
                </span>
              </h2>
              <NetworkVisualizer layerSizes={layerSizes} activationFn={activation} isTraining={isTraining} />
              <div className="flex justify-center gap-4 font-mono text-xs text-muted-foreground">
                <span>{layerSizes.length} layers</span>
                <span>·</span>
                <span>{layerSizes.reduce((a, b) => a + b, 0)} neurons</span>
                <span>·</span>
                <span>
                  {layerSizes.slice(0, -1).reduce((acc, s, i) => acc + s * layerSizes[i + 1], 0)} params
                </span>
              </div>
            </div>

            <div className="glass-panel p-4 space-y-3">
              <h2 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Training Metrics
                <span className="ml-1 inline-flex align-middle">
                  <InfoHint text="Training metrics like loss and accuracy show how well the model is learning." />
                </span>
              </h2>
              <MetricsChart history={metricsHistory} />
            </div>

            {/* Info Card */}
            <div className="glass-panel p-4 space-y-2 border-primary/10">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="font-mono text-xs font-semibold text-foreground">How it works</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This neural network runs entirely in your browser. It uses 
                <span className="text-primary"> feedforward propagation</span> and 
                <span className="text-secondary"> backpropagation</span> with 
                stochastic gradient descent.
              </p>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-primary/80 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Learn these concepts
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            Visualize How AI Thinks...
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Neural Playground © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Playground;
