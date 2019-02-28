use crate::table::{Entry, Table};
use std::mem;
use wasm_bindgen::prelude::*;

#[derive(Default)]
struct Decoder {
    buffer: Vec<u32>,

    shift: u32,
    result: u32,
}

const CONTINUATION_BIT: u8 = 1 << 7;
const LOW_BITS_MASK: u8 = !CONTINUATION_BIT;

impl Decoder {
    fn transform(&mut self, bytes: &[u8]) -> &[u32] {
        self.buffer.clear();

        for byte in bytes {
            let bits = (byte & LOW_BITS_MASK) as u32;
            self.result |= bits << self.shift;

            if byte & CONTINUATION_BIT == 0 {
                self.buffer.push(self.result);
                self.result = 0;
                self.shift = 0;
                continue;
            }

            self.shift += 7;
        }

        self.buffer.as_slice()
    }
}

#[derive(Debug, Eq, PartialEq)]
enum Has {
    None,
    Index,
    Length,
}

impl Default for Has {
    fn default() -> Self {
        Has::None
    }
}

#[wasm_bindgen]
#[derive(Default)]
pub struct Unpacker {
    decoder: Decoder,

    has: Has,

    last_codepoint: u32,

    current_index: u32,
    current_codepoints: Vec<u32>,

    table: Table,
}

#[wasm_bindgen]
impl Unpacker {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }

    pub fn transform(&mut self, bytes: &[u8]) {
        let chunk = self.decoder.transform(bytes);

        for &n in chunk {
            match self.has {
                Has::None => {
                    self.current_index = n;

                    self.has = Has::Index;
                }
                Has::Index => {
                    self.current_codepoints = Vec::with_capacity(n as usize);

                    self.has = Has::Length;
                }
                Has::Length => {
                    self.last_codepoint += n;

                    let codepoints = &mut self.current_codepoints;
                    codepoints.push(self.last_codepoint);

                    if codepoints.capacity() == codepoints.len() {
                        self.table.entries.push(Entry {
                            index: self.current_index,
                            codepoints: mem::replace(codepoints, Vec::new()),
                        });

                        self.last_codepoint = 0;

                        self.has = Has::None;
                    }
                }
            }
        }
    }

    pub fn flush(self) -> Table {
        assert_eq!(self.has, Has::None);
        self.table
    }
}

#[cfg(test)]
mod tests {
    use super::Unpacker;
    use crate::test_data;

    #[test]
    fn unpack() {
        let mut unpacker = Unpacker::new();

        for chunk in test_data::table.chunks(5) {
            unpacker.transform(chunk);
        }

        let table = unpacker.flush();

        let expected_entries = test_data::expected_entries();
        let actual_entries = table.entries;

        assert_eq!(actual_entries, expected_entries);
    }
}
