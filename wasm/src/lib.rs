use shared::search_html;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn console_log(s: String);

    #[wasm_bindgen(js_namespace = performance)]
    fn now() -> f64;
}

macro_rules! log {
    ($($t:tt)*) => (console_log(format_args!($($t)*).to_string()))
}

#[wasm_bindgen(start)]
pub fn start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn search(pattern: String) -> String {
    search_html(pattern)
}
