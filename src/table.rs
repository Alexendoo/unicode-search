use core::fmt;

use alloc::Vec;
use alloc::String;

#[derive(Debug)]
pub struct Entry {
    pub index: usize,
    pub codepoint: usize,
}

pub struct Table<'a> {
    pub combined: &'a [u8],
    pub entries: &'a [Entry],
}

impl<'a> fmt::Debug for Table<'a> {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        writeln!(f, "{:?} len: {:?}", self.combined, self.combined.len())?;

        for (index, entry) in self.entries.iter().enumerate() {
            writeln!(
                f,
                "{:4}: {:?} -> {:?}",
                index,
                entry,
                String::from_utf8_lossy(self.slice_from(entry.index, usize::max_value() / 2))
            )?;
        }

        Ok(())
    }
}

impl<'a> Table<'a> {
    fn slice_from(&self, start: usize, limit: usize) -> &[u8] {
        let end = usize::min(start + limit, self.combined.len());

        &self.combined[start..end]
    }

    fn find_range(&self, substring: &[u8]) -> (usize, usize) {
        // https://en.wikipedia.org/wiki/Suffix_array#Applications
        let mut left = 0;
        let mut right = self.entries.len();

        while left < right {
            let mid = (left + right) / 2;
            let entry = &self.entries[mid];

            if substring > &self.slice_from(entry.index, substring.len()) {
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

            if substring < self.slice_from(entry.index, substring.len()) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        (start, right)
    }

    pub fn codepoints(&self, vec: &mut Vec<usize>, substring: &[u8]) {
        let (start, end) = self.find_range(substring);

        vec.clear();

        for entry in self.entries[start..end].into_iter() {
            vec.push(entry.codepoint);
        }

        vec.sort_unstable();
        vec.dedup();
    }
}
