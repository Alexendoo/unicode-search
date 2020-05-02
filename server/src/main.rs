#![feature(proc_macro_hygiene, decl_macro)]

use rocket::{get, routes};

use askama::Template;

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate;

#[get("/")]
fn index() -> IndexTemplate {
    IndexTemplate
}

#[derive(Template)]
#[template(path = "hello.html")]
struct HelloTemplate {
    name: String,
}

#[get("/hello/<name>")]
fn hello<'a>(name: String) -> HelloTemplate {
    HelloTemplate {
        name
    }
}

fn main() {
    rocket::ignite().mount("/", routes![hello]).launch();
}
