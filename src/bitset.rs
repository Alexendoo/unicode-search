use crate::CHARS_LEN;

const BITSET_LEN: usize = CHARS_LEN / 32 + 1;

pub struct BitSet {
    buf: [u32; BITSET_LEN],
}

impl BitSet {
    pub const fn new() -> Self {
        Self {
            buf: [0; BITSET_LEN],
        }
    }

    pub fn insert(&mut self, bit: u32) {
        let block = bit as usize / 32;
        let offset = bit % 32;

        debug_assert!(block < BITSET_LEN);

        unsafe {
            *self.buf.get_unchecked_mut(block) |= 1 << offset;
        }
    }

    pub fn drain_ones<F>(&mut self, mut callback: F)
    where
        F: FnMut(u32),
    {
        let mut base = 0;

        for block in &mut self.buf {
            while *block != 0 {
                let lsb = *block & block.wrapping_neg();

                callback(base + block.trailing_zeros());

                *block ^= lsb;
            }

            base += 32;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn drain_ones() {
        let mut set = BitSet::new();

        let mut expected = vec![
            4,
            1,
            2,
            5,
            7000,
            7,
            12,
            204,
            CHARS_LEN as u32 - 1,
            0,
            30200,
            30199,
            30198,
        ];

        for &i in &expected {
            set.insert(i);
        }

        let mut ones = Vec::new();
        set.drain_ones(|one| ones.push(one));

        expected.sort_unstable();
        assert_eq!(ones, expected);
    }
}
