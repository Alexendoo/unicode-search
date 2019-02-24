use wasm_bindgen::prelude::*;
use std::ops::Range;
use crate::log;

#[derive(Default)]
pub struct Entry {
    pub(crate) index: u32,
    pub(crate) codepoints: Vec<u32>,
}

#[wasm_bindgen]
#[derive(Default)]
pub struct Table {
    pub(crate) combined: Vec<u8>,
    pub(crate) entries: Vec<Entry>,
}

#[wasm_bindgen]
impl Table {
    fn slice_from(&self, start: usize, limit: usize) -> &[u8] {
        let end = usize::min(start + limit, self.combined.len());

        &self.combined[start..end]
    }

    fn find_range(&self, substring: &[u8]) -> Range<usize> {
        // https://en.wikipedia.org/wiki/Suffix_array#Applications
        let mut left = 0;
        let mut right = self.entries.len();

        while left < right {
            let mid = (left + right) / 2;
            let entry = &self.entries[mid];

            if substring > &self.slice_from(entry.index as usize, substring.len()) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        let start = left;
        right = self.entries.len();

        while left < right {
            let mid = (left + right) / 2;
            let entry = &self.entries[mid];

            if substring < self.slice_from(entry.index as usize, substring.len()) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        start..right
    }

    fn codepoints(&self, substring: &[u8]) {
        let range = self.find_range(substring);

        for entry in self.entries[range].into_iter() {
            log(format!("{}", 1));
        }
    }

    // pub fn codepoints(&self, vec: &mut Vec<u32>, substring: &[u8]) {
    //     let (start, end) = self.find_range(substring);

    //     vec.clear();

    //     for entry in self.entries[start..end].into_iter() {
    //         vec.push(entry.codepoint);
    //     }

    //     vec.sort_unstable();
    //     vec.dedup();
    // }
}
