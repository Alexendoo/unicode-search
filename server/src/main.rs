#![feature(proc_macro_hygiene, decl_macro)]

use anyhow::Result;
use askama::Template;
use rocket::response::content::Html;
use rocket::{get, routes, State};
use rocket_contrib::serve::StaticFiles;
use serde::Deserialize;
use shared::Searcher;
use std::fs;
use std::io;

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

    fn load_file(path: &str) -> io::Result<Vec<u8>> {
        let path = format!("./static/{}", path);

        fs::read(path)
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
    name: &'a str,
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
    // codepoints: State<Vec<u8>>,
    pattern: String,
) -> Result<Html<String>> {
    let mut results = searcher.search_words(&pattern);
    results.truncate(100);

    let names = searcher.names();

    let rendered_results = results
        .into_iter()
        .map(|result| {
            let index = result.index();
            // let codepoint = codepoints[index];

            // let literal =

            RenderedSearchResult {
                name: &names[index],
            }
        })
        .collect();

    let template = SearchTemplate {
        results: rendered_results,
        manifest: &manifest,
    };

    Ok(Html(template.render()?))
}

fn main() -> Result<()> {
    let manifest = Manifest::new()?;
    let names = Manifest::load_file(&manifest.names_txt)?;
    // let codepoints = Manifest::load_file(&manifest.codepoints_bin)?;

    let searcher = Searcher::from_names(std::str::from_utf8(&names)?);

    const STATIC_DIR: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/static");
    let err = rocket::ignite()
        .manage(searcher)
        .manage(manifest)
        // .manage(codepoints)
        .mount("/", routes![index, search])
        .mount("/static", StaticFiles::from(STATIC_DIR))
        .launch();

    Err(err.into())
}
