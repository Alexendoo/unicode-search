#![no_std]
#![feature(alloc, core_intrinsics, panic_handler, lang_items, alloc_error_handler)]
#![feature(const_fn, const_string_new, const_vec_new)]

extern crate alloc;
extern crate wee_alloc;

mod table;

use alloc::vec::Vec;
use table::Table;

// Use `wee_alloc` as the global allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Need to provide a tiny `panic` implementation for `#![no_std]`.
// This translates into an `unreachable` instruction that will
// raise a `trap` the WebAssembly execution if we panic at runtime.
#[panic_handler]
#[no_mangle]
pub fn panic(_info: &::core::panic::PanicInfo) -> ! {
    unsafe {
        ::core::intrinsics::abort();
    }
}

// Need to provide an allocation error handler which just aborts
// the execution with trap.
#[alloc_error_handler]
#[no_mangle]
pub extern "C" fn oom(_: ::core::alloc::Layout) -> ! {
    unsafe {
        ::core::intrinsics::abort();
    }
}

#[lang = "eh_personality"]
#[no_mangle]
pub extern "C" fn eh_personality() {}

#[repr(C)]
#[derive(Debug)]
pub struct ResultLocation<T> {
    ptr: *const T,
    len: usize,
}

impl<T> ResultLocation<T> {
    const fn new() -> Self {
        ResultLocation {
            ptr: core::ptr::null(),
            len: 0,
        }
    }
}

static mut RESULT: Vec<u32> = Vec::new();
static mut RESULT_LOCATION: ResultLocation<u32> = ResultLocation::new();

unsafe fn set_result_location() {
    RESULT_LOCATION.ptr = RESULT.as_ptr();
    RESULT_LOCATION.len = RESULT.len();
}

const TABLE: Table = Table {
    entries: generated::ENTRIES,
    combined: generated::COMBINED,
};

#[no_mangle]
pub unsafe extern "C" fn allocate(capacity: usize) -> *mut u8 {
    Vec::with_capacity(capacity).as_mut_ptr()
}

#[no_mangle]
pub unsafe extern "C" fn find(
    ptr: *mut u8,
    length: usize,
    capacity: usize,
) -> *const ResultLocation<u32> {
    let slice = Vec::from_raw_parts(ptr, length, capacity);

    TABLE.codepoints(&mut RESULT, &slice);

    set_result_location();

    &RESULT_LOCATION
}
