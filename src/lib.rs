#![no_std]
#![feature(alloc, core_intrinsics, panic_implementation, lang_items)]
#![feature(const_fn, const_string_new, const_vec_new)]

#[macro_use]
extern crate alloc;
extern crate wee_alloc;

mod generated;
mod table;

use alloc::Vec;
use table::Table;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[panic_implementation]
#[no_mangle]
pub fn panic(_info: &core::panic::PanicInfo) -> ! {
    unsafe {
        core::intrinsics::abort();
    }
}

#[lang = "oom"]
#[no_mangle]
pub extern "C" fn oom() -> ! {
    unsafe {
        core::intrinsics::abort();
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
