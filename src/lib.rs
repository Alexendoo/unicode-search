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
    ($val:expr) => {
        console_log(format!(
            "[{}:{}] {} = {:#?}",
            file!(),
            line!(),
            stringify!($val),
            $val
        ))
    };
}

#[wasm_bindgen]
pub fn set_panic_hook() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct SearchResult {
    index: usize,
    score: i32,
    indices: Vec<usize>,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Searcher {
    names: Vec<String>,

    chunk_size: usize,
    chunk_count: usize,
    chunk_offset: usize,
}

#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn new(
        capacity: usize,
        chunk_size: usize,
        chunk_count: usize,
        chunk_offset: usize,
    ) -> Self {
        Self {
            names: Vec::with_capacity(capacity),

            chunk_size,
            chunk_count,
            chunk_offset,
        }
    }

    pub fn add_line(&mut self, line: String) {
        self.names.push(line)
    }

    pub fn dbg(&self) {
        log!(self)
    }

    pub fn search(&self, pattern: &str, chunk: usize) -> Vec<u8> {
        let start_index = chunk * self.chunk_size * self.chunk_count + self.chunk_offset;

        let results: Vec<SearchResult> = self
            .names
            .iter()
            .enumerate()
            .skip(start_index)
            .take(self.chunk_size)
            .filter_map(|(index, name)| {
                fuzzy_indices(name, pattern).map(|(score, indices)| SearchResult {
                    index: index + start_index,
                    score: score as i32,
                    indices,
                })
            })
            .collect();

        bincode::serialize(&results).unwrap()
    }
}
