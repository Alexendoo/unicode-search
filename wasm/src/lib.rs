use shared::{BitSet, search_html};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn search(pattern: String) -> String {
    static mut SET: BitSet = BitSet::new();

    // SAFETY: wasm will be only single threaded
    search_html(pattern, unsafe { &mut SET })
}
