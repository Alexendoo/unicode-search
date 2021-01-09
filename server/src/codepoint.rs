use anyhow::Result;
use rocket::get;
use std::fmt::Write;

fn utf8_hex(ch: char) -> String {
    let mut buf = [0u8; 4];
    let encoded = ch.encode_utf8(&mut buf);

    let mut out = String::with_capacity(ch.len_utf8() * 3);
    for byte in encoded.bytes() {
        write!(out, "{:X} ", byte).unwrap();
    }
    out.pop();

    out
}

#[get("/codepoint/<hex>")]
pub fn codepoint(hex: String) -> Result<String> {
    let cp = u32::from_str_radix(&hex, 16)?;

    Ok("".to_string())
}
