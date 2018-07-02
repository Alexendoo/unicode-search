#[derive(Debug)]
struct Entry {
    index: usize,
}

#[derive(Debug)]
struct Table {
    combined: String,
    entries: Vec<Entry>,
}

#[derive(Debug)]
struct TempSuffix<'a> {
    suffix: &'a str,
    entry: Entry,
}

impl Table {
    fn new(strings: Vec<&str>) -> Table {
        let mut combined = String::new();
        let mut temp_suffixes = Vec::new();

        for string in strings {
            let start = combined.len();

            combined.push_str(string);
            combined.push('$');

            for (offset, suffix) in suffixes(string) {
                let entry = Entry { index: start + offset };

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

    fn iter_from<'a>(&'a self, index: usize) -> impl Iterator<Item = u8> + 'a {
        self.combined
            .bytes()
            .skip(index)
            .take_while(|&byte| byte != b'$')
    }

    fn binary_search(&self, substring: &str) -> Option<usize> {
        self.entries
            .binary_search_by(|entry| self.iter_from(entry.index).cmp(substring.bytes()))
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

    let it: String = table.iter_from(6).map(|byte| byte as char).collect();
    println!("{:?}", it);
}
