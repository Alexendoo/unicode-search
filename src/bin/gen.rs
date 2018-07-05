use std::fmt;

#[derive(Debug)]
struct Entry {
    index: usize,
    codepoint: usize,
}

#[derive(Debug)]
struct TempSuffix<'a> {
    suffix: &'a str,
    entry: Entry,
}

struct Table {
    combined: Vec<u8>,
    entries: Vec<Entry>,
}

impl fmt::Debug for Table {
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

impl Table {
    fn new(strings: Vec<&str>) -> Table {
        let mut combined = Vec::new();
        let mut temp_suffixes = Vec::new();

        for (string_idx, string) in strings.iter().enumerate() {
            let start = combined.len();

            for byte in string.bytes() {
                combined.push(byte);
            }
            combined.push(b'$');

            for (offset, suffix) in suffixes(string) {
                let entry = Entry {
                    index: start + offset,
                    codepoint: string_idx,
                };

                temp_suffixes.push(TempSuffix { suffix, entry })
            }
        }

        temp_suffixes.sort_by_key(|temp_suffix| temp_suffix.suffix);

        let entries = temp_suffixes
            .into_iter()
            .map(|temp_suffix| temp_suffix.entry)
            .collect();

        Table { combined, entries }
    }

    fn slice_from(&self, start: usize, limit: usize) -> &[u8] {
        let end = usize::min(start + limit, self.combined.len());

        &self.combined[start..end]
    }
}

fn suffixes<'a>(string: &'a str) -> impl Iterator<Item = (usize, &'a str)> {
    (0..string.len()).map(move |i| &string[i..]).enumerate()
}

fn main() {
}
