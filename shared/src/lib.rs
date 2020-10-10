mod characters;

use crate::characters::CHARACTERS;
use fuzzy_matcher::skim::SkimMatcherV2;
use std::fmt::Write;

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
    matcher: SkimMatcherV2,

    worker_num: usize,
    total_workers: usize,
}

impl Searcher {
    pub fn new() -> Self {
        Self {
            matcher: SkimMatcherV2::default().ignore_case(),

            worker_num: 0,
            total_workers: 1,
        }
    }

    fn search_word(&self, name: &str, pattern_word: &str, index: usize) -> Option<SearchResult> {
        self.matcher
            .fuzzy(name, pattern_word, true)
            .map(|(score, indices)| SearchResult {
                index,
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
        let mut results: Vec<SearchResult> = CHARACTERS
            .iter()
            .enumerate()
            .skip(self.worker_num)
            .step_by(self.total_workers)
            .filter_map(|(index, name)| self.split_match(name.name, pattern, index))
            .collect();

        results.sort_unstable_by_key(|result| result.comparable());

        results
    }
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn constructor(worker_num: usize, total_workers: usize) -> Self {
        Self {
            matcher: SkimMatcherV2::default().ignore_case(),

            worker_num,
            total_workers,
        }
    }

    pub fn search(&self, pattern: &str) -> Vec<u8> {
        let results = self.search_words(pattern);

        bincode::serialize(&results).unwrap()
    }
}

pub fn render_search_results(
    results: &[SearchResult],
    page_size: usize,
    page_number: usize,
) -> String {
    let characters = results
        .chunks(page_size)
        .nth(page_number.saturating_sub(1))
        .into_iter()
        .flatten()
        .map(|result| CHARACTERS[result.index]);

    let mut out = String::new();
    for character in characters {
        write!(
            out,
            r#"
            <div class="char">
                <span class="literal">{}</span>
                <span class="name">{}</span>
            </div>"#,
            character.literal, character.name
        )
        .unwrap();
    }

    out
}
