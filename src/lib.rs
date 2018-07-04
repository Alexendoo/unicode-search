#![feature(const_vec_new)]

#[repr(C)]
#[derive(Debug)]
pub struct ResultLocation {
    ptr: *const u32,
    len: usize,
}

static mut RESULT: Vec<u32> = Vec::new();
static mut RESULT_LOCATION: ResultLocation = ResultLocation {
    ptr: std::ptr::null(),
    len: 0,
};

unsafe fn set_result_location() {
    RESULT_LOCATION.ptr = RESULT.as_ptr();
    RESULT_LOCATION.len = RESULT.len();
}

#[no_mangle]
pub unsafe extern "C" fn location() -> *const ResultLocation {
    &RESULT_LOCATION
}
