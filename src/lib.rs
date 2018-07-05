#![no_std]
#![feature(alloc, core_intrinsics, panic_implementation, lang_items)]
#![feature(const_fn, const_string_new, const_vec_new)]

#[macro_use]
extern crate alloc;
extern crate wee_alloc;

mod table;

use alloc::Vec;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

extern "C" {
    fn console_panic(ptr: *const ResultLocation<u8>);
    fn console_oom();
}

#[panic_implementation]
#[no_mangle]
pub fn panic(info: &core::panic::PanicInfo) -> ! {
    unsafe {
        static mut ERROR_LOCATION: ResultLocation<u8> = ResultLocation::new();

        let stacktrace = format!("{}", info);

        ERROR_LOCATION.ptr = stacktrace.as_ptr();
        ERROR_LOCATION.len = stacktrace.len();

        console_panic(&ERROR_LOCATION);

        core::intrinsics::abort();
    }
}

#[lang = "oom"]
#[no_mangle]
pub extern "C" fn oom() -> ! {
    unsafe {
        console_oom();

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

#[no_mangle]
pub unsafe extern "C" fn location() -> *const ResultLocation<u32> {
    &RESULT_LOCATION
}
