//! Generate 4 files:
//!
//! ## names.txt
//!
//! A newline (\n) seperated list of every codepoint name in order.
//!
//! ## table.bin
//!
//! A suffix table generated from the contents of names.txt,

use byteorder::{LittleEndian, WriteBytesExt};
use std::fs::create_dir_all;
use std::fs::File;
use std::io::BufWriter;
use std::io::Write;
use std::path::Path;
use std::time::Instant;
use ucd_raw::Character;
use ucd_raw::CHARACTERS;

#[derive(Debug)]
struct Suffix<'a> {
    suffix: &'a str,
    index: u32,
}

fn out_file<P: AsRef<Path>>(path: P) -> BufWriter<File> {
    let dir = Path::new("target/data");
    let path = dir.join(path);

    create_dir_all(dir).unwrap();

    let file = File::create(path).unwrap();

    BufWriter::new(file)
}

fn char_iter() -> impl Iterator<Item = &'static Character> {
    CHARACTERS
        .iter()
        .filter(|character| match character.codepoint {
            0x03400..=0x04DB5 => false,
            0x04E00..=0x09FEA => false,
            0x20000..=0x2A6D6 => false,
            0x2A700..=0x2B734 => false,
            0x2B740..=0x2B81D => false,
            0x2B820..=0x2CEA1 => false,
            0x2CEB0..=0x2EBE0 => false,
            0x17000..=0x187EC => false,
            0x1B170..=0x1B2FB => false,
            0x0F900..=0x0FA6D => false,
            0x0FA70..=0x0FAD9 => false,
            0x2F800..=0x2FA1D => false,
            _ => true,
        })
}

fn suffixes(string: &str) -> impl Iterator<Item = (usize, &str)> {
    (0..string.len()).map(move |i| &string[i..]).enumerate()
}

fn main() {
    println!("indexing {} codepoints...", char_iter().count());

    let start = Instant::now();

    let mut combined = String::new();
    let mut temp_suffixes = Vec::new();

    let mut combined_out = out_file("names.txt");
    let mut table_out = out_file("table.bin");
    let mut indicies = out_file("indicies.bin");
    let mut codepoints = out_file("codepoints.bin");

    for (character_index, character) in char_iter().enumerate() {
        let start = combined.len() as u32;
        let name = character.name;

        codepoints
            .write_u32::<LittleEndian>(character.codepoint)
            .unwrap();
        indicies
            .write_u32::<LittleEndian>(character_index as u32)
            .unwrap();

        combined.push_str(name);
        combined.push('\n');

        for (offset, suffix) in suffixes(name) {
            indicies
                .write_u32::<LittleEndian>(character_index as u32)
                .unwrap();
            temp_suffixes.push(Suffix {
                suffix,
                index: start + offset as u32,
            });
        }
    }

    temp_suffixes.sort_unstable_by_key(|temp_suffix| temp_suffix.suffix);

    println!("length: {}", temp_suffixes.len());

    for suffix in temp_suffixes {
        table_out.write_u32::<LittleEndian>(suffix.index).unwrap();
    }
    combined_out.write_all(combined.as_bytes()).unwrap();

    println!("Generated in {:?}", start.elapsed());
}
