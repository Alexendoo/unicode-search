use fuzzy_matcher::skim::SkimMatcherV2;

#[cfg(feature = "wasm")]
use serde::{Deserialize, Serialize};
#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg_attr(feature = "wasm", wasm_bindgen, derive(Serialize, Deserialize))]
#[derive(Debug, Clone)]
pub struct SearchResult {
    index: usize,
    score: i32,
    indices: Vec<usize>,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl SearchResult {
    pub fn index(&self) -> usize {
        self.index
    }

    pub fn indices(&self) -> Vec<usize> {
        self.indices.clone()
    }
}

impl SearchResult {
    pub fn comparable(&self) -> impl Ord {
        (-self.score, self.index)
    }
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct Searcher {
    names: Vec<String>,

    matcher: SkimMatcherV2,

    offset_mult: usize,
    offset_add: usize,
}

impl Searcher {
    pub fn from_names(names: &str) -> Self {
        Self {
            names: names.lines().map(|s| s.to_string()).collect(),

            matcher: SkimMatcherV2::default().ignore_case(),

            offset_mult: 0,
            offset_add: 0,
        }
    }

    fn search_word(&self, name: &str, pattern_word: &str, index: usize) -> Option<SearchResult> {
        self.matcher
            .fuzzy(name, pattern_word, true)
            .map(|(score, indices)| SearchResult {
                index: index * self.offset_mult + self.offset_add,
                score: score as i32,
                indices,
            })
    }

    fn split_match(&self, name: &str, pattern: &str, index: usize) -> Option<SearchResult> {
        let mut results = pattern
            .split_ascii_whitespace()
            .map(|word| self.search_word(name, word, index));

        let mut first_result = results.next()??;
        let indices = &mut first_result.indices;

        for result in results {
            indices.extend(result?.indices);
        }

        indices.sort_unstable();
        indices.dedup();

        Some(first_result)
    }

    pub fn search_words(&self, pattern: &str) -> Vec<SearchResult> {
        let mut results: Vec<SearchResult> = self
            .names
            .iter()
            .enumerate()
            .filter_map(|(index, name)| self.split_match(name, pattern, index))
            .collect();

        results.sort_unstable_by_key(|result| result.comparable());

        results
    }
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn new(capacity: usize, offset_mult: usize, offset_add: usize) -> Self {
        Self {
            names: Vec::with_capacity(capacity),

            matcher: SkimMatcherV2::default().ignore_case(),

            offset_mult,
            offset_add,
        }
    }

    pub fn add_line(&mut self, line: String) {
        self.names.push(line)
    }

    pub fn search(&self, pattern: &str) -> Vec<u8> {
        let results = self.search_words(pattern);

        bincode::serialize(&results).unwrap()
    }
}
