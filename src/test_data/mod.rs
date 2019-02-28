//! Exports a smaller table generated from a reduced set of codepoints,
//! specifically characters represented by char::is_ascii_graphic:
//! U+0021 '!' ... U+007E '~'.

use crate::table::Entry;

pub(crate) const TABLE: &[u8] = include_bytes!("./table.bin");
pub(crate) const COMBINED: &str = include_str!("./combined.txt");

pub(crate) fn expected_entries() -> Vec<Entry> {
    vec![
        Entry {
            // "-MINUS"
            index: 124,
            codepoints: vec![45],
        },
        Entry {
            // "-THAN"
            index: 245,
            codepoints: vec![60, 62],
        },
        Entry {
            // "A"
            index: 116,
            codepoints: vec![44, 65, 97],
        },
        Entry {
            // "ACCENT"
            index: 381,
            codepoints: vec![94, 96],
        },
        Entry {
            // "ACKET"
            index: 356,
            codepoints: vec![91, 93, 123, 125],
        },
        Entry {
            // "AL"
            index: 285,
            codepoints: vec![
                64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
                85, 86, 87, 88, 89, 90, 124,
            ],
        },
        Entry {
            // "ALL"
            index: 405,
            codepoints: vec![
                97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
                114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "ALS"
            index: 234,
            codepoints: vec![61],
        },
        Entry {
            // "AMATION"
            index: 4,
            codepoints: vec![33],
        },
        Entry {
            // "AMPERSAND"
            index: 54,
            codepoints: vec![38],
        },
        Entry {
            // "AN"
            index: 228,
            codepoints: vec![60, 62],
        },
        Entry {
            // "AND"
            index: 60,
            codepoints: vec![38],
        },
        Entry {
            // "APITAL"
            index: 281,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90,
            ],
        },
        Entry {
            // "APOSTROPHE"
            index: 64,
            codepoints: vec![39],
        },
        Entry {
            // "AR"
            index: 43,
            codepoints: vec![36],
        },
        Entry {
            // "ARE"
            index: 350,
            codepoints: vec![91, 93],
        },
        Entry {
            // "ARENTHESIS"
            index: 81,
            codepoints: vec![40, 41],
        },
        Entry {
            // "ARK"
            index: 13,
            codepoints: vec![33, 34, 63],
        },
        Entry {
            // "ASTERISK"
            index: 98,
            codepoints: vec![42],
        },
        Entry {
            // "AT"
            index: 271,
            codepoints: vec![64],
        },
        Entry {
            // "ATER-THAN"
            index: 241,
            codepoints: vec![62],
        },
        Entry {
            // "ATIN"
            index: 275,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "ATION"
            index: 21,
            codepoints: vec![33, 34],
        },
        Entry {
            // "AVE"
            index: 399,
            codepoints: vec![96],
        },
        Entry {
            // "B"
            index: 297,
            codepoints: vec![66, 98],
        },
        Entry {
            // "BER"
            index: 30,
            codepoints: vec![35],
        },
        Entry {
            // "BRACKET"
            index: 354,
            codepoints: vec![91, 93, 123, 125],
        },
        Entry {
            // "C"
            index: 299,
            codepoints: vec![67, 99],
        },
        Entry {
            // "CAL"
            index: 420,
            codepoints: vec![124],
        },
        Entry {
            // "CAPITAL"
            index: 280,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90,
            ],
        },
        Entry {
            // "CCENT"
            index: 382,
            codepoints: vec![94, 96],
        },
        Entry {
            // "CENT"
            index: 49,
            codepoints: vec![37, 94, 96],
        },
        Entry {
            // "CIAL"
            index: 266,
            codepoints: vec![64],
        },
        Entry {
            // "CIRCUMFLEX"
            index: 370,
            codepoints: vec![94],
        },
        Entry {
            // "CKET"
            index: 357,
            codepoints: vec![91, 93, 123, 125],
        },
        Entry {
            // "CLAMATION"
            index: 2,
            codepoints: vec![33],
        },
        Entry {
            // "COLON"
            index: 205,
            codepoints: vec![58, 59],
        },
        Entry {
            // "COMMA"
            index: 112,
            codepoints: vec![44],
        },
        Entry {
            // "COMMERCIAL"
            index: 260,
            codepoints: vec![64],
        },
        Entry {
            // "CUMFLEX"
            index: 373,
            codepoints: vec![94],
        },
        Entry {
            // "CURLY"
            index: 409,
            codepoints: vec![123, 125],
        },
        Entry {
            // "D"
            index: 62,
            codepoints: vec![38, 68, 100],
        },
        Entry {
            // "DE"
            index: 427,
            codepoints: vec![126],
        },
        Entry {
            // "DIGIT"
            index: 149,
            codepoints: vec![48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
        },
        Entry {
            // "DOLLAR"
            index: 39,
            codepoints: vec![36],
        },
        Entry {
            // "DUS"
            index: 145,
            codepoints: vec![47, 92],
        },
        Entry {
            // "E"
            index: 352,
            codepoints: vec![39, 49, 51, 53, 57, 69, 91, 92, 93, 95, 96, 101, 124, 126],
        },
        Entry {
            // "EATER-THAN"
            index: 240,
            codepoints: vec![62],
        },
        Entry {
            // "EE"
            index: 171,
            codepoints: vec![51],
        },
        Entry {
            // "EFT"
            index: 76,
            codepoints: vec![40, 91, 123],
        },
        Entry {
            // "EIGHT"
            index: 194,
            codepoints: vec![56],
        },
        Entry {
            // "EMICOLON"
            index: 212,
            codepoints: vec![59],
        },
        Entry {
            // "EN"
            index: 191,
            codepoints: vec![55],
        },
        Entry {
            // "EN-MINUS"
            index: 122,
            codepoints: vec![45],
        },
        Entry {
            // "ENT"
            index: 384,
            codepoints: vec![37, 94, 96],
        },
        Entry {
            // "ENTHESIS"
            index: 83,
            codepoints: vec![40, 41],
        },
        Entry {
            // "EQUALS"
            index: 231,
            codepoints: vec![61],
        },
        Entry {
            // "ER"
            index: 292,
            codepoints: vec![
                35, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
                85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
                109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "ER-THAN"
            index: 243,
            codepoints: vec![62],
        },
        Entry {
            // "ERCENT"
            index: 47,
            codepoints: vec![37],
        },
        Entry {
            // "ERCIAL"
            index: 264,
            codepoints: vec![64],
        },
        Entry {
            // "ERISK"
            index: 101,
            codepoints: vec![42],
        },
        Entry {
            // "ERO"
            index: 156,
            codepoints: vec![48],
        },
        Entry {
            // "ERSAND"
            index: 57,
            codepoints: vec![38],
        },
        Entry {
            // "ERSE"
            index: 365,
            codepoints: vec![92],
        },
        Entry {
            // "ERTICAL"
            index: 416,
            codepoints: vec![124],
        },
        Entry {
            // "ESIS"
            index: 87,
            codepoints: vec![40, 41],
        },
        Entry {
            // "ESS-THAN"
            index: 222,
            codepoints: vec![60],
        },
        Entry {
            // "ESTION"
            index: 253,
            codepoints: vec![63],
        },
        Entry {
            // "ET"
            index: 359,
            codepoints: vec![91, 93, 123, 125],
        },
        Entry {
            // "ETTER"
            index: 289,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "EVEN"
            index: 189,
            codepoints: vec![55],
        },
        Entry {
            // "EVERSE"
            index: 363,
            codepoints: vec![92],
        },
        Entry {
            // "EX"
            index: 378,
            codepoints: vec![94],
        },
        Entry {
            // "EXCLAMATION"
            index: 0,
            codepoints: vec![33],
        },
        Entry {
            // "F"
            index: 305,
            codepoints: vec![70, 102],
        },
        Entry {
            // "FIVE"
            index: 179,
            codepoints: vec![53],
        },
        Entry {
            // "FLEX"
            index: 376,
            codepoints: vec![94],
        },
        Entry {
            // "FOUR"
            index: 174,
            codepoints: vec![52],
        },
        Entry {
            // "FT"
            index: 77,
            codepoints: vec![40, 91, 123],
        },
        Entry {
            // "FULL"
            index: 131,
            codepoints: vec![46],
        },
        Entry {
            // "G"
            index: 307,
            codepoints: vec![71, 103],
        },
        Entry {
            // "GHT"
            index: 196,
            codepoints: vec![41, 56, 93, 125],
        },
        Entry {
            // "GIT"
            index: 151,
            codepoints: vec![48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
        },
        Entry {
            // "GN"
            index: 36,
            codepoints: vec![35, 36, 37, 43, 60, 61, 62],
        },
        Entry {
            // "GRAVE"
            index: 397,
            codepoints: vec![96],
        },
        Entry {
            // "GREATER-THAN"
            index: 238,
            codepoints: vec![62],
        },
        Entry {
            // "H"
            index: 309,
            codepoints: vec![72, 104],
        },
        Entry {
            // "HAN"
            index: 247,
            codepoints: vec![60, 62],
        },
        Entry {
            // "HE"
            index: 72,
            codepoints: vec![39],
        },
        Entry {
            // "HEN-MINUS"
            index: 121,
            codepoints: vec![45],
        },
        Entry {
            // "HESIS"
            index: 86,
            codepoints: vec![40, 41],
        },
        Entry {
            // "HREE"
            index: 169,
            codepoints: vec![51],
        },
        Entry {
            // "HT"
            index: 95,
            codepoints: vec![41, 56, 93, 125],
        },
        Entry {
            // "HYPHEN-MINUS"
            index: 118,
            codepoints: vec![45],
        },
        Entry {
            // "I"
            index: 311,
            codepoints: vec![73, 105],
        },
        Entry {
            // "IAL"
            index: 267,
            codepoints: vec![64],
        },
        Entry {
            // "ICAL"
            index: 419,
            codepoints: vec![124],
        },
        Entry {
            // "ICOLON"
            index: 214,
            codepoints: vec![59],
        },
        Entry {
            // "IDUS"
            index: 144,
            codepoints: vec![47, 92],
        },
        Entry {
            // "IGHT"
            index: 93,
            codepoints: vec![41, 56, 93, 125],
        },
        Entry {
            // "IGIT"
            index: 150,
            codepoints: vec![48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
        },
        Entry {
            // "IGN"
            index: 35,
            codepoints: vec![35, 36, 37, 43, 60, 61, 62],
        },
        Entry {
            // "ILDE"
            index: 425,
            codepoints: vec![126],
        },
        Entry {
            // "IN"
            index: 277,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "INE"
            index: 393,
            codepoints: vec![57, 95, 124],
        },
        Entry {
            // "INUS"
            index: 126,
            codepoints: vec![45],
        },
        Entry {
            // "ION"
            index: 256,
            codepoints: vec![33, 34, 63],
        },
        Entry {
            // "IRCUMFLEX"
            index: 371,
            codepoints: vec![94],
        },
        Entry {
            // "IS"
            index: 89,
            codepoints: vec![40, 41],
        },
        Entry {
            // "ISK"
            index: 103,
            codepoints: vec![42],
        },
        Entry {
            // "IT"
            index: 152,
            codepoints: vec![48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
        },
        Entry {
            // "ITAL"
            index: 283,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90,
            ],
        },
        Entry {
            // "IVE"
            index: 180,
            codepoints: vec![53],
        },
        Entry {
            // "IX"
            index: 185,
            codepoints: vec![54],
        },
        Entry {
            // "J"
            index: 313,
            codepoints: vec![74, 106],
        },
        Entry {
            // "K"
            index: 15,
            codepoints: vec![33, 34, 42, 63, 75, 107],
        },
        Entry {
            // "KET"
            index: 358,
            codepoints: vec![91, 93, 123, 125],
        },
        Entry {
            // "L"
            index: 286,
            codepoints: vec![
                46, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
                84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
                108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 124,
            ],
        },
        Entry {
            // "LAMATION"
            index: 3,
            codepoints: vec![33],
        },
        Entry {
            // "LAR"
            index: 42,
            codepoints: vec![36],
        },
        Entry {
            // "LATIN"
            index: 274,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "LDE"
            index: 426,
            codepoints: vec![126],
        },
        Entry {
            // "LEFT"
            index: 75,
            codepoints: vec![40, 91, 123],
        },
        Entry {
            // "LESS-THAN"
            index: 221,
            codepoints: vec![60],
        },
        Entry {
            // "LETTER"
            index: 288,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "LEX"
            index: 377,
            codepoints: vec![94],
        },
        Entry {
            // "LIDUS"
            index: 143,
            codepoints: vec![47, 92],
        },
        Entry {
            // "LINE"
            index: 392,
            codepoints: vec![95, 124],
        },
        Entry {
            // "LL"
            index: 406,
            codepoints: vec![
                46, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
                113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "LLAR"
            index: 41,
            codepoints: vec![36],
        },
        Entry {
            // "LON"
            index: 217,
            codepoints: vec![58, 59],
        },
        Entry {
            // "LOW"
            index: 388,
            codepoints: vec![95],
        },
        Entry {
            // "LS"
            index: 235,
            codepoints: vec![61],
        },
        Entry {
            // "LUS"
            index: 108,
            codepoints: vec![43],
        },
        Entry {
            // "LY"
            index: 412,
            codepoints: vec![123, 125],
        },
        Entry {
            // "M"
            index: 319,
            codepoints: vec![77, 109],
        },
        Entry {
            // "MA"
            index: 115,
            codepoints: vec![44],
        },
        Entry {
            // "MALL"
            index: 404,
            codepoints: vec![
                97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
                114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "MARK"
            index: 12,
            codepoints: vec![33, 34, 63],
        },
        Entry {
            // "MATION"
            index: 5,
            codepoints: vec![33],
        },
        Entry {
            // "MBER"
            index: 29,
            codepoints: vec![35],
        },
        Entry {
            // "MERCIAL"
            index: 263,
            codepoints: vec![64],
        },
        Entry {
            // "MFLEX"
            index: 375,
            codepoints: vec![94],
        },
        Entry {
            // "MICOLON"
            index: 213,
            codepoints: vec![59],
        },
        Entry {
            // "MINUS"
            index: 125,
            codepoints: vec![45],
        },
        Entry {
            // "MMA"
            index: 114,
            codepoints: vec![44],
        },
        Entry {
            // "MMERCIAL"
            index: 262,
            codepoints: vec![64],
        },
        Entry {
            // "MPERSAND"
            index: 55,
            codepoints: vec![38],
        },
        Entry {
            // "N"
            index: 278,
            codepoints: vec![
                33, 34, 35, 36, 37, 43, 55, 58, 59, 60, 61, 62, 63, 65, 66, 67, 68, 69, 70, 71, 72,
                73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99,
                100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
                116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "N-MINUS"
            index: 123,
            codepoints: vec![45],
        },
        Entry {
            // "ND"
            index: 61,
            codepoints: vec![38],
        },
        Entry {
            // "NE"
            index: 394,
            codepoints: vec![49, 57, 95, 124],
        },
        Entry {
            // "NINE"
            index: 200,
            codepoints: vec![57],
        },
        Entry {
            // "NT"
            index: 385,
            codepoints: vec![37, 94, 96],
        },
        Entry {
            // "NTHESIS"
            index: 84,
            codepoints: vec![40, 41],
        },
        Entry {
            // "NUMBER"
            index: 27,
            codepoints: vec![35],
        },
        Entry {
            // "NUS"
            index: 127,
            codepoints: vec![45],
        },
        Entry {
            // "O"
            index: 158,
            codepoints: vec![48, 50, 79, 111],
        },
        Entry {
            // "OLIDUS"
            index: 142,
            codepoints: vec![47, 92],
        },
        Entry {
            // "OLLAR"
            index: 40,
            codepoints: vec![36],
        },
        Entry {
            // "OLON"
            index: 216,
            codepoints: vec![58, 59],
        },
        Entry {
            // "OMMA"
            index: 113,
            codepoints: vec![44],
        },
        Entry {
            // "OMMERCIAL"
            index: 261,
            codepoints: vec![64],
        },
        Entry {
            // "ON"
            index: 24,
            codepoints: vec![33, 34, 58, 59, 63],
        },
        Entry {
            // "ONE"
            index: 160,
            codepoints: vec![49],
        },
        Entry {
            // "OP"
            index: 138,
            codepoints: vec![46],
        },
        Entry {
            // "OPHE"
            index: 70,
            codepoints: vec![39],
        },
        Entry {
            // "OSTROPHE"
            index: 66,
            codepoints: vec![39],
        },
        Entry {
            // "OTATION"
            index: 19,
            codepoints: vec![34],
        },
        Entry {
            // "OUR"
            index: 175,
            codepoints: vec![52],
        },
        Entry {
            // "OW"
            index: 389,
            codepoints: vec![95],
        },
        Entry {
            // "P"
            index: 325,
            codepoints: vec![46, 80, 112],
        },
        Entry {
            // "PARENTHESIS"
            index: 80,
            codepoints: vec![40, 41],
        },
        Entry {
            // "PERCENT"
            index: 46,
            codepoints: vec![37],
        },
        Entry {
            // "PERSAND"
            index: 56,
            codepoints: vec![38],
        },
        Entry {
            // "PHE"
            index: 71,
            codepoints: vec![39],
        },
        Entry {
            // "PHEN-MINUS"
            index: 120,
            codepoints: vec![45],
        },
        Entry {
            // "PITAL"
            index: 282,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90,
            ],
        },
        Entry {
            // "PLUS"
            index: 107,
            codepoints: vec![43],
        },
        Entry {
            // "POSTROPHE"
            index: 65,
            codepoints: vec![39],
        },
        Entry {
            // "Q"
            index: 327,
            codepoints: vec![81, 113],
        },
        Entry {
            // "QUALS"
            index: 232,
            codepoints: vec![61],
        },
        Entry {
            // "QUARE"
            index: 348,
            codepoints: vec![91, 93],
        },
        Entry {
            // "QUESTION"
            index: 251,
            codepoints: vec![63],
        },
        Entry {
            // "QUOTATION"
            index: 17,
            codepoints: vec![34],
        },
        Entry {
            // "R"
            index: 293,
            codepoints: vec![
                35, 36, 52, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
                83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
                108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "R-THAN"
            index: 244,
            codepoints: vec![62],
        },
        Entry {
            // "RACKET"
            index: 355,
            codepoints: vec![91, 93, 123, 125],
        },
        Entry {
            // "RAVE"
            index: 398,
            codepoints: vec![96],
        },
        Entry {
            // "RCENT"
            index: 48,
            codepoints: vec![37],
        },
        Entry {
            // "RCIAL"
            index: 265,
            codepoints: vec![64],
        },
        Entry {
            // "RCUMFLEX"
            index: 372,
            codepoints: vec![94],
        },
        Entry {
            // "RE"
            index: 351,
            codepoints: vec![91, 93],
        },
        Entry {
            // "REATER-THAN"
            index: 239,
            codepoints: vec![62],
        },
        Entry {
            // "REE"
            index: 170,
            codepoints: vec![51],
        },
        Entry {
            // "RENTHESIS"
            index: 82,
            codepoints: vec![40, 41],
        },
        Entry {
            // "REVERSE"
            index: 362,
            codepoints: vec![92],
        },
        Entry {
            // "RIGHT"
            index: 92,
            codepoints: vec![41, 93, 125],
        },
        Entry {
            // "RISK"
            index: 102,
            codepoints: vec![42],
        },
        Entry {
            // "RK"
            index: 14,
            codepoints: vec![33, 34, 63],
        },
        Entry {
            // "RLY"
            index: 411,
            codepoints: vec![123, 125],
        },
        Entry {
            // "RO"
            index: 157,
            codepoints: vec![48],
        },
        Entry {
            // "ROPHE"
            index: 69,
            codepoints: vec![39],
        },
        Entry {
            // "RSAND"
            index: 58,
            codepoints: vec![38],
        },
        Entry {
            // "RSE"
            index: 366,
            codepoints: vec![92],
        },
        Entry {
            // "RTICAL"
            index: 417,
            codepoints: vec![124],
        },
        Entry {
            // "S"
            index: 147,
            codepoints: vec![40, 41, 43, 45, 47, 61, 83, 92, 115],
        },
        Entry {
            // "S-THAN"
            index: 224,
            codepoints: vec![60],
        },
        Entry {
            // "SAND"
            index: 59,
            codepoints: vec![38],
        },
        Entry {
            // "SE"
            index: 367,
            codepoints: vec![92],
        },
        Entry {
            // "SEMICOLON"
            index: 211,
            codepoints: vec![59],
        },
        Entry {
            // "SEVEN"
            index: 188,
            codepoints: vec![55],
        },
        Entry {
            // "SIGN"
            index: 34,
            codepoints: vec![35, 36, 37, 43, 60, 61, 62],
        },
        Entry {
            // "SIS"
            index: 88,
            codepoints: vec![40, 41],
        },
        Entry {
            // "SIX"
            index: 184,
            codepoints: vec![54],
        },
        Entry {
            // "SK"
            index: 104,
            codepoints: vec![42],
        },
        Entry {
            // "SMALL"
            index: 403,
            codepoints: vec![
                97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
                114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "SOLIDUS"
            index: 141,
            codepoints: vec![47, 92],
        },
        Entry {
            // "SQUARE"
            index: 347,
            codepoints: vec![91, 93],
        },
        Entry {
            // "SS-THAN"
            index: 223,
            codepoints: vec![60],
        },
        Entry {
            // "STERISK"
            index: 99,
            codepoints: vec![42],
        },
        Entry {
            // "STION"
            index: 254,
            codepoints: vec![63],
        },
        Entry {
            // "STOP"
            index: 136,
            codepoints: vec![46],
        },
        Entry {
            // "STROPHE"
            index: 67,
            codepoints: vec![39],
        },
        Entry {
            // "T"
            index: 78,
            codepoints: vec![
                37, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 64, 84, 91, 93, 94, 96, 116,
                123, 125,
            ],
        },
        Entry {
            // "TAL"
            index: 284,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90,
            ],
        },
        Entry {
            // "TATION"
            index: 20,
            codepoints: vec![34],
        },
        Entry {
            // "TER"
            index: 291,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "TER-THAN"
            index: 242,
            codepoints: vec![62],
        },
        Entry {
            // "TERISK"
            index: 100,
            codepoints: vec![42],
        },
        Entry {
            // "THAN"
            index: 226,
            codepoints: vec![60, 62],
        },
        Entry {
            // "THESIS"
            index: 85,
            codepoints: vec![40, 41],
        },
        Entry {
            // "THREE"
            index: 168,
            codepoints: vec![51],
        },
        Entry {
            // "TICAL"
            index: 418,
            codepoints: vec![124],
        },
        Entry {
            // "TILDE"
            index: 424,
            codepoints: vec![126],
        },
        Entry {
            // "TIN"
            index: 276,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "TION"
            index: 7,
            codepoints: vec![33, 34, 63],
        },
        Entry {
            // "TOP"
            index: 137,
            codepoints: vec![46],
        },
        Entry {
            // "TROPHE"
            index: 68,
            codepoints: vec![39],
        },
        Entry {
            // "TTER"
            index: 290,
            codepoints: vec![
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
                86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
                110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            ],
        },
        Entry {
            // "TWO"
            index: 164,
            codepoints: vec![50],
        },
        Entry {
            // "U"
            index: 335,
            codepoints: vec![85, 117],
        },
        Entry {
            // "UALS"
            index: 233,
            codepoints: vec![61],
        },
        Entry {
            // "UARE"
            index: 349,
            codepoints: vec![91, 93],
        },
        Entry {
            // "UESTION"
            index: 252,
            codepoints: vec![63],
        },
        Entry {
            // "ULL"
            index: 132,
            codepoints: vec![46],
        },
        Entry {
            // "UMBER"
            index: 28,
            codepoints: vec![35],
        },
        Entry {
            // "UMFLEX"
            index: 374,
            codepoints: vec![94],
        },
        Entry {
            // "UOTATION"
            index: 18,
            codepoints: vec![34],
        },
        Entry {
            // "UR"
            index: 176,
            codepoints: vec![52],
        },
        Entry {
            // "URLY"
            index: 410,
            codepoints: vec![123, 125],
        },
        Entry {
            // "US"
            index: 146,
            codepoints: vec![43, 45, 47, 92],
        },
        Entry {
            // "V"
            index: 337,
            codepoints: vec![86, 118],
        },
        Entry {
            // "VE"
            index: 400,
            codepoints: vec![53, 96],
        },
        Entry {
            // "VEN"
            index: 190,
            codepoints: vec![55],
        },
        Entry {
            // "VERSE"
            index: 364,
            codepoints: vec![92],
        },
        Entry {
            // "VERTICAL"
            index: 415,
            codepoints: vec![124],
        },
        Entry {
            // "W"
            index: 339,
            codepoints: vec![87, 95, 119],
        },
        Entry {
            // "WO"
            index: 165,
            codepoints: vec![50],
        },
        Entry {
            // "X"
            index: 341,
            codepoints: vec![54, 88, 94, 120],
        },
        Entry {
            // "XCLAMATION"
            index: 1,
            codepoints: vec![33],
        },
        Entry {
            // "Y"
            index: 343,
            codepoints: vec![89, 121, 123, 125],
        },
        Entry {
            // "YPHEN-MINUS"
            index: 119,
            codepoints: vec![45],
        },
        Entry {
            // "Z"
            index: 345,
            codepoints: vec![90, 122],
        },
        Entry {
            // "ZERO"
            index: 155,
            codepoints: vec![48],
        },
    ]
}
