use std::collections::HashSet;
use std::fmt::Debug;
use std::fmt::Write;
use std::mem::transmute;
use std::str;

#[cfg(target_endian = "little")]
macro_rules! include_u32s {
    ($file:expr) => {{
        const BYTES: &[u8; TABLE_LEN * 4] = include_bytes!($file);

        const U32S: &[u32; TABLE_LEN] = unsafe { &transmute(*BYTES) };

        U32S
    }};
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
}

const CHARS_LEN: usize = 33763;
const TABLE_LEN: usize = 903970;

pub type Characters = &'static [Character; CHARS_LEN];

#[allow(clippy::unusual_byte_groupings)]
pub const CHARACTERS: Characters = include!("./characters.rs");

pub const NAMES: &str = include_str!("./names.txt");
pub const SUFFIX_TABLE: &[u32; TABLE_LEN] = include_u32s!("./suffix_array.u32");
pub const INDICES: &[u32; TABLE_LEN] = include_u32s!("./indices.u32");

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

fn search(pattern: &str) -> Vec<Character> {
    let start = binary_search(0, |suffix| pattern > suffix);
    let end = binary_search(start, |suffix| suffix.starts_with(pattern));

    let character_indices: HashSet<u32> = SUFFIX_TABLE[start..end]
        .iter()
        .map(|&i| INDICES[i as usize])
        .collect();

    let mut characters: Vec<Character> = character_indices
        .into_iter()
        .map(|i| CHARACTERS[i as usize])
        .collect();

    characters.sort_unstable_by_key(|character| character.literal);

    characters
}

pub fn search_html(mut pattern: String) -> String {
    if pattern.is_empty() {
        return String::new();
    }

    pattern.make_ascii_uppercase();

    let mut characters = search(&pattern);
    characters.truncate(50);

    let mut out = String::new();

    for character in characters {
        write!(
            out,
            r#"
            <div class="char">
                <span class="literal">{}</span>
                <span class="name">{}</span>
            </div>"#,
            character.literal,
            character.name()
        )
        .unwrap();
    }

    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;
    use proptest::sample::select;

    fn naive_search(pattern: &str) -> Vec<Character> {
        CHARACTERS
            .iter()
            .copied()
            .filter(|character| character.name().contains(pattern))
            .collect()
    }

    #[test]
    fn searches() {
        let chars = search("LINE FEED");
        assert_eq!(search("INE FEED"), chars);

        let names: Vec<&str> = chars.iter().map(|ch| ch.name()).collect();

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
            assert_eq!(search(&s), naive_search(&s));
        }

        #[test]
        fn gauranteed_match(ch in select(&CHARACTERS[..]), start: usize, len: usize) {
            let name = ch.name();

            let name = &name[start % name.len()..];
            let name = &name[..len % name.len()];

            let results = search(name);
            assert!(results.contains(&ch));

            assert_eq!(results, naive_search(name));
        }
    }
}
