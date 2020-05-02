pub use shared::*;
use itertools::Itertools;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn console_log(s: String);
}

#[allow(unused_macros)]
macro_rules! log {
    ($($t:tt)*) => (console_log(format_args!($($t)*).to_string()))
}

#[wasm_bindgen(start)]
pub fn start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub struct Collector {
    target_length: usize,
    sub_results: Vec<Vec<SearchResult>>,
}

#[wasm_bindgen]
impl Collector {
    #[wasm_bindgen(constructor)]
    pub fn new(target_length: usize) -> Self {
        Self {
            target_length,
            sub_results: Vec::with_capacity(target_length),
        }
    }

    pub fn collect(&mut self, blob: &[u8]) -> bool {
        let sub_result = bincode::deserialize(blob).unwrap();

        self.sub_results.push(sub_result);

        self.sub_results.len() == self.target_length
    }

    pub fn build(self) -> SearchResults {
        assert!(self.target_length == self.sub_results.len());

        let results: Vec<SearchResult> = self
            .sub_results
            .into_iter()
            .kmerge_by(|a, b| a.comparable() < b.comparable())
            .collect();

        SearchResults { results }
    }
}
#[wasm_bindgen]
#[derive(Clone)]
pub struct SearchResults {
    results: Vec<SearchResult>,
}

#[wasm_bindgen]
impl SearchResults {
    pub fn empty() -> Self {
        Self {
            results: Vec::new(),
        }
    }

    pub fn get(&self, index: usize) -> SearchResult {
        self.results[index].clone()
    }

    pub fn length(&self) -> usize {
        self.results.len()
    }
}
