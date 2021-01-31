use anyhow::Result;
use proc_macro2::Literal;
use std::env;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::PathBuf;
use ucd_parse::{NameAlias, UcdFile, UnicodeData};

fn relative_path(p: &str) -> PathBuf {
    let mut path = PathBuf::new();
    path.push(env!("CARGO_MANIFEST_DIR"));
    path.push(p);
    path
}

fn out_file(filename: &str) -> Result<BufWriter<File>> {
    let mut path = relative_path("../shared/src/");
    path.push(filename);

    let file = File::create(path)?;

    Ok(BufWriter::new(file))
}

fn parse<D: UcdFile>() -> Result<Vec<D>, ucd_parse::Error> {
    let path = relative_path("ucd-data");
    ucd_parse::parse(path)
}

fn write_bytes(filename: &str, xs: &[u32]) -> Result<()> {
    let mut file = out_file(filename)?;

    for x in xs {
        file.write_all(&x.to_le_bytes())?;
    }

    Ok(())
}

fn main() -> Result<()> {
    let unicode_data = parse::<UnicodeData>()?;
    let name_aliases = parse::<NameAlias>()?;

    let mut names = Vec::new();

    for row in &unicode_data {
        if row.is_range_start() || row.is_range_end() || row.name == "<control>" {
            continue;
        }

        names.push((row.name.as_str(), row.codepoint.scalar().unwrap()));
    }

    for row in &name_aliases {
        names.push((row.alias.as_str(), row.codepoint.scalar().unwrap()));
    }

    // stable sort to keep canonical names first
    names.sort_by_key(|&(_, literal)| literal);

    // TODO: include multiple aliases
    names.dedup_by_key(|&mut (_, literal)| literal);

    let mut indices = Vec::new();
    let mut all_names = String::new();
    let mut characters = String::new();

    for (i, &(name, ch)) in names.iter().enumerate() {
        assert!(name.len() < 0xFF);
        assert!(all_names.len() < 0xFF_FF_FF);

        characters.push_str(&format!(
            "    Character {{ pos: 0x{:02X}_{:06X}, literal: {} }},\n",
            name.len(),
            all_names.len(),
            Literal::character(ch),
        ));

        all_names.push_str(name);
        all_names.push('\n');

        for _ in 0..=name.len() {
            indices.push(i as u32);
        }
    }


    // TODO: exclude \n... suffixes
    let mut suffix_array: Vec<u32> = (0..all_names.len() as u32).collect();
    suffix_array.sort_unstable_by_key(|&i| &all_names[i as usize..]);

    assert_eq!(indices.len(), all_names.len());
    assert_eq!(all_names.len(), suffix_array.len());
    assert!(suffix_array.len() < u32::MAX as usize);

    write!(out_file("names.txt")?, "{}", all_names)?;
    write!(out_file("characters.rs")?, "&[\n{}]", characters)?;

    write_bytes("suffix_array.u32", &suffix_array)?;
    write_bytes("indices.u32", &indices)?;

    Ok(())
}
