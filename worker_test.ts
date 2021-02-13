import { assert } from "./deps_test.ts";
import { isDedicatedWorkerGlobalScope } from "./worker.ts";

Deno.test(
  "isDedicatedWorkerGlobalScope returns true if given self seems DedicatedWorkerGlobalScope",
  () => {
    const self = {
      close: () => undefined,
      postMessage: () => undefined,
    };
    assert(isDedicatedWorkerGlobalScope(self));
  },
);

Deno.test(
  "isDedicatedWorkerGlobalScope returns false if given self seems not DedicatedWorkerGlobalScope",
  () => {
    assert(
      !isDedicatedWorkerGlobalScope({
        postMessage: () => undefined,
      }),
    );
    assert(
      !isDedicatedWorkerGlobalScope({
        close: () => undefined,
      }),
    );
  },
);
