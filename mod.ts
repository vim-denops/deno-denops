export interface Denops {
  command(expr: string): Promise<void>;
}
