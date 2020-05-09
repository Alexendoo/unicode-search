import init from "../../../target/wasm/wasm";

import { wasm } from "./files";

export * from "../../../target/wasm/wasm";

export default async function initWasm() {
    await init(wasm);

    // eslint-disable-next-line no-underscore-dangle
    return init.__wbindgen_wasm_module;
}
