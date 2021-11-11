pub use crate::bitset::BitSet;
use std::fmt::Debug;
use std::mem::transmute;
use std::str;

#[cfg(target_endian = "little")]
macro_rules! include_u32s {
    ($name:ident, $size:expr, $file:expr) => {
        pub const $name: &[u32; $size] = {
            const BYTES: &[u8; $size * 4] = include_bytes!($file);

            const U32S: &[u32; $size] = unsafe { &transmute(*BYTES) };

            U32S
        };
    };
}

#[derive(Copy, Clone, PartialEq)]
pub struct Character {
    /// 8 MSB = length
    /// 24 LSB = index
    pos: u32,
    literal: char,
}

impl Debug for Character {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?} {}", self.literal, self.name())
    }
}

impl Character {
    fn name(self) -> &'static str {
        let start = self.pos & 0xFF_FF_FF;
        let end = start + (self.pos >> 24);

        &NAMES[start as usize..end as usize]
    }

    pub fn codepoint(self) -> u32 {
        self.literal as u32
    }
}

pub const CHARS_LEN: usize = 33763;
const TABLE_LEN: usize = 870207;
const NAMES_LEN: usize = 903970;

pub type Characters = &'static [Character; CHARS_LEN];

#[allow(clippy::unusual_byte_groupings)]
pub const CHARACTERS: Characters = include!("./characters.rs");

pub const NAMES: &str = include_str!("./names.txt");
include_u32s!(SUFFIX_TABLE, TABLE_LEN, "./suffix_array.u32");
include_u32s!(INDICES, NAMES_LEN, "./indices.u32");

fn binary_search(mut left: usize, f: impl Fn(&str) -> bool) -> usize {
    let mut right = TABLE_LEN;

    while left < right {
        let mid = (left + right) / 2;

        let suffix = &NAMES[SUFFIX_TABLE[mid] as usize..];

        if f(suffix) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    left
}

pub fn search(pattern: &str, characters: &mut Vec<Character>, character_indices: &mut BitSet) {
    let start = binary_search(0, |suffix| pattern > suffix);
    let end = binary_search(start, |suffix| suffix.starts_with(pattern));

    for &suffix in &SUFFIX_TABLE[start..end] {
        let index = INDICES[suffix as usize];

        character_indices.insert(index);
    }

    characters.clear();
    character_indices.drain_ones(|i| characters.push(CHARACTERS[i as usize]));
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;
    use proptest::sample::select;
    use regex::Regex;

    fn naive_search(pattern: &str) -> Vec<Character> {
        CHARACTERS
            .iter()
            .copied()
            .filter(|character| character.name().contains(pattern))
            .collect()
    }

    fn search(pattern: &str) -> Vec<Character> {
        let mut set = BitSet::new();
        let mut chars = Vec::new();

        super::search(pattern, &mut chars, &mut set);

        chars
    }

    #[test]
    fn searches() {
        assert_eq!(search("LINE FEED"), search("INE FEED"));

        let names: Vec<&str> = search("LINE FEED")
            .into_iter()
            .map(|ch| ch.name())
            .collect();

        assert_eq!(
            names,
            &[
                "LINE FEED",
                "REVERSE LINE FEED",
                "SYMBOL FOR LINE FEED",
                "IDEOGRAPHIC TELEGRAPH LINE FEED SEPARATOR SYMBOL"
            ]
        );
    }

    proptest! {
        #[test]
        fn same_result_as_naive_search(s in "[A-Z0-9 -]*") {
            assert_eq!(
                search(&s),
                naive_search(&s)
            );
        }

        #[test]
        fn guaranteed_match(ch in select(&CHARACTERS[..]), start: usize, len: usize) {
            let name = ch.name();

            let name = &name[start % name.len()..];
            let name = &name[..len % name.len()];

            let results = search(name);
            assert!(results.contains(&ch));

            assert_eq!(results, naive_search(name));
        }
    }

    #[test]
    fn html_safe_characters() {
        let expected = Regex::new("^[A-Z0-9 -]+$").unwrap();

        for character in CHARACTERS {
            assert!(expected.is_match(character.name()), "{:?}", character);
        }
    }
}
