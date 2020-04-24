import init from "../../intermediate/wasm/utf";

import { wasm } from "./files";

export * from "../../intermediate/wasm/utf";

export default async function initWasm() {
    await init(wasm);

    // eslint-disable-next-line no-underscore-dangle
    return init.__wbindgen_wasm_module;
}
