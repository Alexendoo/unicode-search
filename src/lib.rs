use bitset::BitSet;
use ranges::{GenericRange, Relation};
use search::{search, Character, CHARS_LEN, NAMES};
use std::mem;
use std::ops::{Bound, Range, RangeBounds};
use wasm_bindgen::prelude::*;

mod bitset;
mod search;

mod js {
    use wasm_bindgen::prelude::*;
    #[wasm_bindgen(raw_module = "../../src/index.js")]
    extern "C" {
        pub fn clear();
        #[wasm_bindgen(js_name = "popEnd")]
        pub fn pop_end();
        #[wasm_bindgen(js_name = "popStart")]
        pub fn pop_start();
        #[wasm_bindgen(js_name = "pushEnd")]
        pub fn push_end(index: u32, codepoint: u32, start: usize, end: usize);
        #[wasm_bindgen(js_name = "pushStart")]
        pub fn push_start(index: u32, codepoint: u32, start: usize, end: usize);
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused_macros)]
macro_rules! log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
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
pub struct Searcher {
    chars: Vec<Character>,
    current: GenericRange<u32>,
}

fn to_range(generic: GenericRange<u32>) -> Range<u32> {
    let start = match generic.start_bound() {
        Bound::Included(&s) => s,
        Bound::Excluded(&s) => s + 1,
        Bound::Unbounded => 0,
    };

    let end = match generic.end_bound() {
        Bound::Included(&e) => e + 1,
        Bound::Excluded(&e) => e,
        Bound::Unbounded => u32::MAX,
    };

    start..end
}

#[wasm_bindgen]
impl Searcher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            chars: Vec::with_capacity(CHARS_LEN),
            current: GenericRange::from(0..0),
        }
    }

    pub fn search(&mut self, mut pattern: String) {
        static mut SET: BitSet = BitSet::new();

        pattern.make_ascii_uppercase();

        // SAFETY: wasm will be only single threaded
        search(&pattern, &mut self.chars, unsafe { &mut SET });
        self.current = GenericRange::from(0..0);
    }

    pub fn codepoints(&mut self, codepoints: Vec<u32>) {
        self.chars.clear();
        self.chars
            .extend(codepoints.into_iter().filter_map(Character::from_codepoint));

        self.current = GenericRange::from(0..0);
    }

    pub fn len(&self) -> usize {
        self.chars.len()
    }

    pub fn render(&mut self, start: u32, end: u32) {
        let next = GenericRange::from(start..end);
        let prev = mem::replace(&mut self.current, next);

        // log!("{} -> {}\t{:?}", prev, next, prev.relation(next));

        let pop_start = |generic_range| {
            for _ in to_range(generic_range) {
                js::pop_start();
            }
        };

        let pop_end = |generic_range| {
            for _ in to_range(generic_range) {
                js::pop_end();
            }
        };

        let push_start = |generic_range| {
            for i in to_range(generic_range).rev() {
                let ch = self.chars[i as usize];
                let range = ch.range();
                js::push_start(i, ch.codepoint(), range.start, range.end);
            }
        };

        let push_end = |generic_range| {
            for i in to_range(generic_range) {
                let ch = self.chars[i as usize];
                let range = ch.range();
                js::push_end(i, ch.codepoint(), range.start, range.end);
            }
        };

        match prev.relation(next) {
            Relation::Equal(_) => {}
            Relation::Disjoint { .. } | Relation::Touching { .. } | Relation::Empty { .. } => {
                js::clear();
                push_end(next);
            }
            Relation::Overlapping {
                first_disjoint,
                second_disjoint,
                self_less,
                ..
            } => {
                if self_less {
                    pop_start(first_disjoint);
                    push_end(second_disjoint);
                } else {
                    pop_end(second_disjoint);
                    push_start(first_disjoint);
                }
            }
            Relation::Containing {
                first_disjoint,
                second_disjoint,
                self_shorter,
                ..
            } => {
                if self_shorter {
                    pop_start(first_disjoint);
                    pop_end(second_disjoint);
                } else {
                    push_start(first_disjoint);
                    push_end(second_disjoint);
                }
            }
            Relation::Starting {
                disjoint,
                self_shorter,
                ..
            } => {
                if self_shorter {
                    push_end(disjoint);
                } else {
                    pop_end(disjoint);
                }
            }
            Relation::Ending {
                disjoint,
                self_shorter,
                ..
            } => {
                if self_shorter {
                    push_start(disjoint);
                } else {
                    pop_start(disjoint);
                }
            }
        }
    }
}
