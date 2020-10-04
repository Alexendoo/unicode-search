#![feature(proc_macro_hygiene, decl_macro)]

use anyhow::Result;
use askama::Template;
use rocket::response::content::Html;
use rocket::{get, routes, State};
use rocket_contrib::serve::StaticFiles;
use shared::{render_search_results, Searcher};

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate;

#[get("/")]
fn index() -> Result<Html<String>> {
    Ok(Html(IndexTemplate.render()?))
}

const PAGE_SIZE: usize = 50;

#[derive(Template)]
#[template(path = "search.html")]
struct SearchTemplate {
    results: String,
    // next_page: Origin<'a>,
    // last_page: Origin<'a>,
}

#[get("/search?<pattern>&<page>")]
fn search(
    searcher: State<Searcher>,
    pattern: Option<String>,
    page: Option<usize>,
) -> Result<Html<String>> {
    let all_results = pattern
        .as_ref()
        .map(|pattern| searcher.search_words(pattern))
        .unwrap_or_default();


    let num_pages = all_results.len() / PAGE_SIZE + 1;
    let page_number = page.unwrap_or(1).min(1).max(num_pages);

    let results = render_search_results(&all_results, PAGE_SIZE, page_number);
    eprintln!("num_pages = {:#?}", num_pages);
    eprintln!("page_number = {:#?}", page_number);
    eprintln!("results = {:#?}", results);

    let template = SearchTemplate {
        results,
        // next_page: 1,
        // last_page: 2,
    };

    Ok(Html(template.render()?))
}

fn main() -> Result<()> {
    let searcher = Searcher::new();

    const STATIC_DIR: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/static");
    let err = rocket::ignite()
        .manage(searcher)
        .mount("/", routes![index, search])
        .mount("/static", StaticFiles::from(STATIC_DIR))
        .launch();

    Err(err.into())
}
