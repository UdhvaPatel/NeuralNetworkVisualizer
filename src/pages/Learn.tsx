import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Learn: React.FC = () => {
  return (
    <div className="min-h-screen grid-bg">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-mono neon-text tracking-tight">
              Neural Playground Guide
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Detailed explanations of the key machine learning concepts used in this app
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playground
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">How to read this page</h2>
          <p className="text-sm text-muted-foreground">
            Each topic has: what it is, why it matters in this playground, common behavior you may observe,
            and one simple example so the idea feels practical.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Activation Functions</h2>
          <p className="text-sm text-muted-foreground">
            Activation functions decide how strongly a neuron should respond after computing a weighted sum.
            Without them, stacked layers would collapse into something equivalent to a single linear model.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="text-foreground font-medium">ReLU:</span> Outputs 0 for negative values and x for positive values. Fast, sparse, and common in hidden layers.
            </li>
            <li>
              <span className="text-foreground font-medium">Sigmoid:</span> Maps values to 0..1. Great for output probabilities in binary classification.
            </li>
            <li>
              <span className="text-foreground font-medium">Tanh:</span> Maps values to -1..1 and is zero-centered, often smoother than sigmoid in hidden layers.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> If a neuron pre-activation is -2, ReLU gives 0, Sigmoid gives about 0.12, and Tanh gives about -0.96.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Layers</h2>
          <p className="text-sm text-muted-foreground">
            A neural network is made of layers of neurons: input layer, one or more hidden layers, and an output layer.
            More layers/neurons can model more complex patterns, but also increase training complexity.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> A model with architecture [2, 4, 1] reads 2 inputs (x, y), transforms them through 4 hidden neurons, then outputs 1 probability.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Learning Rate</h2>
          <p className="text-sm text-muted-foreground">
            The learning rate controls how big each weight update is during training.
            Too high can make training unstable; too low can make learning very slow.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> If a weight gradient is 0.5, with learning rate 0.1 the update is 0.05; with 0.001 it is only 0.0005.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Datasets in this App</h2>
          <p className="text-sm text-muted-foreground">
            Different datasets test different abilities of the model. Linearly separable data is easy; curved or intertwined classes are harder.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="text-foreground font-medium">Circles:</span> One class inside another circle; needs non-linear separation.
            </li>
            <li>
              <span className="text-foreground font-medium">XOR:</span> Classic non-linear problem where diagonal quadrants belong to the same class.
            </li>
            <li>
              <span className="text-foreground font-medium">Spiral:</span> Intertwined classes, harder dataset that tests model flexibility.
            </li>
            <li>
              <span className="text-foreground font-medium">Gaussian:</span> Two noisy clusters around different centers.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> A straight line can often separate Gaussian clusters, but cannot separate circles well.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Network Architecture</h2>
          <p className="text-sm text-muted-foreground">
            Network architecture is the structure of the model, such as [2, 6, 4, 1]:
            2 input neurons, two hidden layers (6 and 4 neurons), and 1 output neuron.
            Architecture strongly affects what patterns the model can learn.
          </p>
          <p className="text-sm text-muted-foreground">
            In this app, changing architecture changes both capacity (what it can represent) and optimization behavior (how easily it trains).
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> [2, 2, 1] might struggle on Spiral, while [2, 8, 8, 1] usually fits it better.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Decision Boundary</h2>
          <p className="text-sm text-muted-foreground">
            The decision boundary is the separation line/region between predicted classes.
            In the visualizer, it updates as the model learns and shows how the network splits the input space.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> If points on the left are class 0 and right are class 1, the boundary could be a vertical line near x = 0.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Epoch</h2>
          <p className="text-sm text-muted-foreground">
            One epoch means the model has trained on the full dataset once.
            More epochs usually improve learning until performance plateaus or starts overfitting.
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> With 200 samples, after 10 epochs the model has processed 2,000 training examples in total.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Training Metrics</h2>
          <p className="text-sm text-muted-foreground">
            Metrics summarize whether training is improving.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="text-foreground font-medium">Loss:</span> Measures prediction error during optimization. Lower is generally better.
            </li>
            <li>
              <span className="text-foreground font-medium">Accuracy:</span> Percentage of correct predictions. Higher is generally better.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Simple example:</span> If loss drops from 0.90 to 0.25 and accuracy rises from 55% to 93%, the model is learning useful patterns.
          </p>
        </section>

        <section className="glass-panel p-4 space-y-2">
          <h2 className="font-mono text-sm font-semibold text-foreground">Practical tuning tips</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Start with ReLU and a moderate learning rate (for example 0.01 to 0.03).</li>
            <li>If training is noisy or unstable, lower learning rate first.</li>
            <li>If boundary stays too simple, add neurons/layers gradually.</li>
            <li>If accuracy is already high and stable, extra complexity may not be needed.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Learn;
