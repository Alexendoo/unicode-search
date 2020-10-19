use anyhow::Result;
use rocket::get;

#[get("/codepoint/<hex>")]
pub fn codepoint(hex: String) -> Result<String> {
    let cp = u32::from_str_radix(&hex, 16)?;

    Ok("".to_string())
}
