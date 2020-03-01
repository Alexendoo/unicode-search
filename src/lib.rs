#![warn(clippy::pedantic)]

use fuzzy_matcher::skim::fuzzy_indices;
use serde::{Deserialize, Serialize};
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

#[derive(Serialize, Deserialize, Debug)]
struct SearchResult {
    index: usize,
    score: i32,
    indices: Vec<usize>,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Searcher {
    names: Vec<String>,

    offset_mult: usize,
    offset_add: usize,
}

#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn new(capacity: usize, offset_mult: usize, offset_add: usize) -> Self {
        Self {
            names: Vec::with_capacity(capacity),

            offset_mult,
            offset_add,
        }
    }

    pub fn add_line(&mut self, line: String) {
        self.names.push(line)
    }

    pub fn search(&self, pattern: &str) -> Vec<u8> {
        let results: Vec<SearchResult> = self
            .names
            .iter()
            .enumerate()
            .filter_map(|(index, name)| {
                fuzzy_indices(name, pattern).map(|(score, indices)| SearchResult {
                    index: index * self.offset_mult + self.offset_add,
                    score: score as i32,
                    indices,
                })
            })
            .collect();

        serde_json::to_vec(&results).unwrap()
    }
}
