#![feature(proc_macro_hygiene, decl_macro)]

use askama::Template;
use rocket::{get, routes};
use rocket_contrib::serve::StaticFiles;

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate;

#[get("/")]
fn index() -> IndexTemplate {
    IndexTemplate
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index])
        .mount(
            "/static",
            StaticFiles::from(concat!(env!("CARGO_MANIFEST_DIR"), "/static")),
        )
        .launch();
}
