use crate::log;
use std::collections::BTreeSet;
use std::ops::Range;
use wasm_bindgen::prelude::*;

#[derive(Debug, Default, PartialEq)]
pub struct Entry {
    pub(crate) index: usize,
    pub(crate) codepoints: Vec<u32>,
}

#[wasm_bindgen]
#[derive(Debug, Default)]
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

            if substring > self.slice_from(entry.index as usize, substring.len()) {
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

    fn find(&self, substring: &[u8]) -> &[Entry] {
        let range = self.find_range(substring);

        &self.entries[range]
    }

    pub fn dump(&self) {
        log(format!("{:?}", self))
    }

    pub fn codepoints(&self, substring: &str) {
        for entry in self.find(substring.as_bytes()) {
            log(format!("{:?}", entry));
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_data;

    fn get_table() -> Table {
        let mut unpacker = crate::decoder::Unpacker::new();

        unpacker.transform(test_data::TABLE);

        unpacker.flush(test_data::COMBINED)
    }

    #[test]
    fn find_single() {
        let table = get_table();

        let mut codepoints = BTreeSet::new();

        for entry in dbg!(table.find(b"Q")) {
            let s = &table.combined[entry.index..];

            for &codepoint in &entry.codepoints {
                codepoints.insert(codepoint);
            }

            dbg!(String::from_utf8_lossy(s));
        }

        dbg!(&codepoints);

        for codepoint in codepoints.into_iter() {
            dbg!(std::char::from_u32(codepoint));
        }
    }
}
