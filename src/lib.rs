use bitset::BitSet;
use search::{Character, NAMES, search};
use std::collections::VecDeque;
use std::mem;
use std::ops::Range;
use wasm_bindgen::prelude::*;

mod bitset;
mod search;

#[wasm_bindgen(raw_module = "../../client/js/search.js")]
extern "C" {
    fn clear();
    fn pop_front();
    fn pop_back();
    fn push_front(codepoint: u32);
    fn push_back(codepoint: u32);
}

#[wasm_bindgen(start)]
pub fn start() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen]
pub fn names_ptr() -> *const u8 {
    NAMES.as_ptr()
}

#[wasm_bindgen]
pub fn names_len() -> usize {
    NAMES.len()
}


#[wasm_bindgen]
#[derive(Default)]
pub struct Searcher {
    chars: Vec<Character>,
    current: Range<u32>,
}

#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }

    pub fn search(&mut self, mut pattern: String) {
        static mut SET: BitSet = BitSet::new();

        pattern.make_ascii_uppercase();

        // SAFETY: wasm will be only single threaded
        self.chars = search(&pattern, unsafe { &mut SET });
    }

    pub fn render(&mut self, start: u32, end: u32) {
        let prev = mem::replace(&mut self.current, start..end);

        let contains_start = prev.contains(&start);
        let contains_end = prev.contains(&end);

        if !contains_start && !contains_end {
            // ~~~~~
            // ~~~~~
            //       ->
            //          ~~~~~
            //          ~~~~~
            clear();
            for i in start..end {
                push_back(ch);
            }
            return;
        }

        if contains_start {
            // 0 ~~~~~
            // 1 ~~~~~ -> ~~~~~
            // 2 ~~~~~    ~~~~~
            let pop = start - prev.start;
            for _ in 0..pop {
                pop_front();
            }
        } else {
            // 0          ~~~~~
            // 1 ~~~~~ -> ~~~~~
            // 2 ~~~~~    ~~~~~
            let push = prev.start - start;
            for i in 0..push {
                push_front(start - i);
            }
        }

        if contains_end {
            // 0 ~~~~~    ~~~~~
            // 1 ~~~~~ -> ~~~~~
            // 2 ~~~~~
            let pop = prev.end - end;
            for _ in 0..pop {
                pop_back();
            }
        } else {
            // 0 ~~~~~    ~~~~~
            // 1 ~~~~~ -> ~~~~~
            // 2          ~~~~~
            let push = end - prev.end;
            for i in 0..push {
                push_back(prev.end + i);
            }
        }
    }
}
