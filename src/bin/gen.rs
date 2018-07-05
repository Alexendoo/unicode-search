extern crate ucd_raw;

use std::fs::File;
use std::io::Write;
use std::time::Instant;
use ucd_raw::Character;
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

    for character in char_iter() {
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

fn char_iter() -> impl Iterator<Item = &'static Character> {
    CHARACTERS
        .iter()
        .filter(|character| match character.codepoint {
            0x03400...0x04DB5 => false,
            0x04E00...0x09FEA => false,
            0x20000...0x2A6D6 => false,
            0x2A700...0x2B734 => false,
            0x2B740...0x2B81D => false,
            0x2B820...0x2CEA1 => false,
            0x2CEB0...0x2EBE0 => false,
            0x17000...0x187EC => false,
            0x1B170...0x1B2FB => false,
            0x0F900...0x0FA6D => false,
            0x0FA70...0x0FAD9 => false,
            0x2F800...0x2FA1D => false,
            _ => true,
        })
}
