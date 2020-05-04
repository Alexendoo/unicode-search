import init from "../../../target/wasm/utf";

import { wasm } from "./files";

export * from "../../../target/wasm/utf";

export default async function initWasm() {
    await init(wasm);

    // eslint-disable-next-line no-underscore-dangle
    return init.__wbindgen_wasm_module;
}
