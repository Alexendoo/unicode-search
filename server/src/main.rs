#![feature(proc_macro_hygiene, decl_macro)]

use anyhow::Result;
use askama::Template;
use byteorder::{LittleEndian, ReadBytesExt};
use rocket::response::content::Html;
use rocket::{get, routes, State};
use rocket_contrib::serve::StaticFiles;
use serde::Deserialize;
use shared::Searcher;
use std::convert::TryFrom;
use std::fs::File;
use std::io::{self, Read};

#[derive(Deserialize)]
struct Manifest {
    #[serde(rename = "codepoints.bin")]
    codepoints_bin: String,
    #[serde(rename = "names.txt")]
    names_txt: String,
    #[serde(rename = "search.js")]
    search_js: String,
    #[serde(rename = "search.css")]
    search_css: String,
}

impl Manifest {
    fn new() -> Result<Self> {
        Ok(serde_json::from_str(include_str!(
            "../static/manifest.json"
        ))?)
    }

    fn load_file(path: &str) -> io::Result<File> {
        let server_dir = env!("CARGO_MANIFEST_DIR");
        let path = server_dir.to_string() + path;

        File::open(path)
    }

    fn load_file_string(path: &str) -> io::Result<String> {
        let mut file = Manifest::load_file(path)?;

        let mut string = String::new();
        file.read_to_string(&mut string)?;

        Ok(string)
    }

    fn load_file_chars(path: &str) -> Result<Vec<char>> {
        let mut file = Manifest::load_file(path)?;
        let len = file.metadata()?.len() as usize;

        assert_eq!(len % 4, 0);

        let mut buf = vec![0; len / 4];
        file.read_u32_into::<LittleEndian>(&mut buf)?;

        let chars = buf
            .into_iter()
            .map(char::try_from)
            .collect::<Result<_, _>>()?;

        Ok(chars)
    }
}

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate;

#[get("/")]
fn index() -> Result<Html<String>> {
    Ok(Html(IndexTemplate.render()?))
}

struct RenderedSearchResult<'a> {
    literal: char,
    name: &'a str,
}

impl<'a> RenderedSearchResult<'a> {
    fn new(pattern: &str, searcher: &'a Searcher, codepoints: &[char]) -> Vec<Self> {
        let mut results = searcher.search_words(&pattern);
        results.truncate(100);

        let names = searcher.names();

        results
            .into_iter()
            .map(|result| {
                let index = result.index();
                let literal = codepoints[index];

                RenderedSearchResult {
                    literal,
                    name: &names[index],
                }
            })
            .collect()
    }
}

#[derive(Template)]
#[template(path = "search.html")]
struct SearchTemplate<'a> {
    results: Vec<RenderedSearchResult<'a>>,
    manifest: &'a Manifest,
}

#[get("/search?<pattern>")]
fn search(
    searcher: State<Searcher>,
    manifest: State<Manifest>,
    codepoints: State<Vec<char>>,
    pattern: Option<String>,
) -> Result<Html<String>> {
    let results = pattern
        .map(|pat| RenderedSearchResult::new(&pat, &searcher, &codepoints))
        .unwrap_or_default();

    let template = SearchTemplate {
        results,
        manifest: &manifest,
    };

    Ok(Html(template.render()?))
}

fn main() -> Result<()> {
    let manifest = Manifest::new()?;
    let names = Manifest::load_file_string(&manifest.names_txt)?;
    let codepoints = Manifest::load_file_chars(&manifest.codepoints_bin)?;

    let searcher = Searcher::from_names(&names);

    const STATIC_DIR: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/static");
    let err = rocket::ignite()
        .manage(searcher)
        .manage(manifest)
        .manage(codepoints)
        .mount("/", routes![index, search])
        .mount("/static", StaticFiles::from(STATIC_DIR))
        .launch();

    Err(err.into())
}
