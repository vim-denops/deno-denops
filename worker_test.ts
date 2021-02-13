import { assert, assertEquals } from "./deps_test.ts";
import { WorkerReader, WorkerWriter } from "./worker.ts";

Deno.test(
  "WorkerWriter invokes internal worker.postMessage when data is written by 'write' method",
  async () => {
    const posted: number[][] = [];
    const worker = {
      postMessage(message: number[]): void {
        posted.push(message);
      },
    };
    const writer = new WorkerWriter(worker);
    await writer.write(new Uint8Array([0, 1, 2, 3, 4]));
    await writer.write(new Uint8Array([5, 6, 7, 8, 9]));
    assertEquals(posted[0], [0, 1, 2, 3, 4]);
    assertEquals(posted[1], [5, 6, 7, 8, 9]);
  },
);

Deno.test(
  "WorkerReader stores received data and return on 'read' method",
  async () => {
    const worker = {
      onmessage(_event: MessageEvent<number[]>): void {},
      terminate(): void {},
    };
    const reader = new WorkerReader(worker);
    worker.onmessage(
      new MessageEvent("worker", {
        data: [0, 1, 2, 3, 4],
      }),
    );
    worker.onmessage(
      new MessageEvent("worker", {
        data: [5, 6, 7, 8, 9],
      }),
    );
    let p: Uint8Array;
    let n: number | null;
    p = new Uint8Array(10);
    n = await reader.read(p);
    assert(typeof n === "number");
    assertEquals(p.slice(0, n), new Uint8Array([0, 1, 2, 3, 4]));
    p = new Uint8Array(10);
    n = await reader.read(p);
    assert(typeof n === "number");
    assertEquals(p.slice(0, n), new Uint8Array([5, 6, 7, 8, 9]));
  },
);

Deno.test(
  "WorkerReader return 'null' when the reader had closed by 'close' method",
  async () => {
    const worker = {
      onmessage(_event: MessageEvent<number[]>): void {},
      terminate(): void {},
    };
    const reader = new WorkerReader(worker);
    worker.onmessage(
      new MessageEvent("worker", {
        data: [0, 1, 2, 3, 4],
      }),
    );
    reader.close();
    worker.onmessage(
      new MessageEvent("worker", {
        data: [5, 6, 7, 8, 9],
      }),
    );
    let p: Uint8Array;
    let n: number | null;
    p = new Uint8Array(10);
    n = await reader.read(p);
    assert(typeof n === "number");
    assertEquals(p.slice(0, n), new Uint8Array([0, 1, 2, 3, 4]));
    p = new Uint8Array(10);
    n = await reader.read(p);
    assert(n == null);
  },
);
