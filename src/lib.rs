#![warn(clippy::pedantic)]

use std::mem;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: String);
}

#[wasm_bindgen]
pub fn init() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[cfg(target_endian = "little")]
unsafe fn cast_bytes(mut le_bytes: Vec<u8>) -> Vec<u32> {
    let p = le_bytes.as_mut_ptr();
    let len = le_bytes.len();
    let cap = le_bytes.capacity();

    assert_eq!(len % 4, 0);
    assert_eq!(cap % 4, 0);

    mem::forget(le_bytes);

    #[allow(clippy::cast_ptr_alignment)]
    Vec::from_raw_parts(p as *mut u32, len / 4, cap / 4)
}

#[wasm_bindgen]
#[derive(Debug, Default)]
pub struct Table {
    text: Vec<u8>,
    indicies: Vec<u32>,
    bounds: Vec<u32>,
}

#[wasm_bindgen]
impl Table {
    #[wasm_bindgen(constructor)]
    pub fn new(text: String, indicies: Vec<u8>, bounds: Vec<u8>) -> Self {
        Self {
            text: text.into_bytes(),
            indicies: unsafe { cast_bytes(indicies) },
            bounds: unsafe { cast_bytes(bounds) },
        }
    }

    pub fn search(&self, substring: &str) -> Vec<u32> {
        let indicies = self.find(substring.as_bytes());

        indicies
            .iter()
            .map(|&i| self.index_to_codepoint(i))
            .collect()
    }

    fn find(&self, substring: &[u8]) -> &[u32] {
        // https://en.wikipedia.org/wiki/Suffix_array#Applications
        let mut left = 0;
        let mut right = self.indicies.len();

        while left < right {
            let mid = (left + right) / 2;
            let index = self.indicies[mid] as usize;

            if substring > self.slice_from(index, substring.len()) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        let start = left;
        right = self.indicies.len();

        while left < right {
            let mid = (left + right) / 2;
            let index = self.indicies[mid] as usize;

            if substring < self.slice_from(index, substring.len()) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        &self.indicies[start..right]
    }

    fn slice_from(&self, start: usize, limit: usize) -> &[u8] {
        let end = usize::min(start + limit, self.text.len());

        &self.text[start..end]
    }

    fn index_to_codepoint(&self, index: u32) -> u32 {
        match self.bounds.binary_search(&index) {
            Ok(i) => self.bounds[i],
            Err(i) => self.bounds[i - 1],
        }
    }
}
