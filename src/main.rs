#[derive(Debug)]
struct Entry {
    index: usize,
}

#[derive(Debug)]
struct Table {
    combined: Vec<u8>,
    entries: Vec<Entry>,
}

#[derive(Debug)]
struct TempSuffix<'a> {
    suffix: &'a str,
    entry: Entry,
}

impl Table {
    fn new(strings: Vec<&str>) -> Table {
        let mut combined = Vec::<u8>::new();
        let mut temp_suffixes = Vec::new();

        for string in strings {
            let start = combined.len();

            for byte in string.bytes() {
                combined.push(byte);
            }
            combined.push(b'$');

            for (offset, suffix) in suffixes(string) {
                let entry = Entry {
                    index: start + offset,
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

    fn iter_from<'a>(&'a self, index: usize, limit: usize) -> impl Iterator<Item = u8> + 'a {
        self.combined
            .iter()
            .map(|&b| b)
            .skip(index)
            .take(limit)
            .take_while(|&byte| byte != b'$')
    }

    fn slice_from(&self, start: usize, limit: usize) -> &[u8] {
        let end = usize::min(start + limit, self.combined.len());

        &self.combined[start..end]
    }

    fn binary_search(&self, substring: &str) -> Option<usize> {
        for entry in &self.entries {
            println!(
                "{:?}",
                self.iter_from(entry.index, usize::max_value())
                    .map(|c| c as char)
                    .collect::<String>()
            )
        }

        self.entries
            .binary_search_by(|entry| {
                let candidate = self.iter_from(entry.index, substring.len())
                    .map(|c| c as char)
                    .collect::<String>();

                println!(
                    "{0:?} - {1:?}.cmp({2:?}) = {3:?}",
                    entry,
                    substring,
                    candidate,
                    substring
                        .bytes()
                        .cmp(self.iter_from(entry.index, substring.len())),
                );

                substring
                    .bytes()
                    .cmp(self.iter_from(entry.index, substring.len()))
            })
            .ok()
    }
}

fn suffixes<'a>(string: &'a str) -> impl Iterator<Item = (usize, &'a str)> {
    (0..string.len()).map(move |i| &string[i..]).enumerate()
}

fn main() {
    let input = vec!["one", "two", "three"];

    let table = Table::new(input);

    println!("{:?}", table);

    let it: String = table.iter_from(6, 1000).map(|byte| byte as char).collect();
    println!("{:?}", it);

    let se = table.binary_search("tw");
    println!("{:?}", se);
}
