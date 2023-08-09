import { Observable, Subject, Unsubscribable } from 'rxjs'
import { Callback } from '../types';

// start / stop / isPlaying / pause / reset

export type Cells = number[]

export interface EngineConfiguration {
  maxGenerations?: number;
  size: number;
  lifespan: number;
  generate: (cells: Cells) => Cells;
}

export interface Generation {
  cells: Cells
  meta: {
    size: number
    generation: number
  }
}

export class Engine {
  private generations = 0

  private $timeline: Subject<Generation> = new Subject<Generation>();
  private currentState: Cells = [];
  private stopFn = () => { };

  constructor(
    private readonly configuration: EngineConfiguration
  ) {
    this.currentState = Array
      .from({ length: configuration.size })
      .map(() => {
        return Math.random()
      }) as number[]
  }

  get shouldStop() {
    return this.generations < (this.configuration.maxGenerations ?? -1);
  }

  private nextGeneration() {
    this.generations++;
    this.currentState = this.configuration.generate(this.currentState)

    this.$timeline.next({
      cells: [...this.currentState],
      meta: {
        generation: this.configuration.size,
        size: this.configuration.size,
      }
    });
  }

  start(): Observable<Generation> {
    this.nextGeneration()
    const interval = setInterval(() => {
      if (this.shouldStop) this.nextGeneration()
      else this.$timeline.complete()
    }, this.configuration.lifespan)

    this.stop() // stop existing loop
    this.stopFn = () => clearTimeout(interval);

    return this.$timeline.asObservable()
  }

  stop() {
    this.stopFn?.()
  }
}
