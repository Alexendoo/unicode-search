extern crate ucd_raw;

use std::fs::File;
use std::io::Write;
use std::time::Instant;
use ucd_raw::CHARACTERS;

#[derive(Debug)]
struct Entry {
    index: usize,
    codepoint: u32,
}

#[derive(Debug)]
struct TempSuffix<'a> {
    suffix: &'a str,
    entry: Entry,
}

fn suffixes<'a>(string: &'a str) -> impl Iterator<Item = (usize, &'a str)> {
    (0..string.len()).map(move |i| &string[i..]).enumerate()
}

fn main() {
    let start = Instant::now();

    let mut combined = Vec::new();
    let mut temp_suffixes = Vec::new();

    let mut out = File::create("src/generated.rs").unwrap();

    for character in CHARACTERS.iter() {
        let start = combined.len();

        for byte in character.name.bytes() {
            combined.push(byte);
        }
        combined.push(b'\n');

        for (offset, suffix) in suffixes(character.name) {
            temp_suffixes.push(TempSuffix {
                suffix,
                entry: Entry {
                    index: start + offset,
                    codepoint: character.codepoint,
                },
            });
        }
    }

    temp_suffixes.sort_by_key(|temp_suffix| temp_suffix.suffix);

    writeln!(out, "use table::Entry;").unwrap();

    writeln!(
        out,
        "pub const ENTRIES: &[Entry] = &{:#?};",
        temp_suffixes
            .into_iter()
            .map(|temp_suffix| temp_suffix.entry)
            .collect::<Vec<_>>()
    ).unwrap();

    writeln!(
        out,
        "pub static COMBINED: &[u8] = b\"{}\";",
        String::from_utf8(combined).unwrap()
    ).unwrap();

    println!("Generated in {:?}", start.elapsed());
}
