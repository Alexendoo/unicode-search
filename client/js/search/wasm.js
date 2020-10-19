import init from "../../../target/wasm/wasm";

export * from "../../../target/wasm/wasm";

export default async function initWasm() {
    await init(new URL("../../../target/wasm/wasm_bg.wasm", import.meta.url));

    // eslint-disable-next-line no-underscore-dangle
    return init.__wbindgen_wasm_module;
}
