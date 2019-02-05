use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Searcher {
    prefixes: Box<[u8]>
}

#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn new(prefixes: &[u8]) -> Self {
        Self {
            prefixes: prefixes.into(),
        }
    }
}