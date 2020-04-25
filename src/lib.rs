#![warn(clippy::pedantic)]

use fuzzy_matcher::skim::fuzzy_indices;
use itertools::Itertools;
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

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchResult {
    index: usize,
    score: i32,
    indices: Vec<usize>,
}

#[wasm_bindgen]
impl SearchResult {
    pub fn index(&self) -> usize {
        self.index
    }

    pub fn indices(&self) -> Vec<usize> {
        self.indices.clone()
    }

    fn comparable(&self) -> impl Ord {
        (-self.score, self.index)
    }
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
        let mut results: Vec<SearchResult> = self
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

        results.sort_unstable_by_key(|result| result.comparable());

        bincode::serialize(&results).unwrap()
    }
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
