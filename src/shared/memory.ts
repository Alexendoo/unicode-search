export const enum Offset {
  Index,
  Turn,

  Coordinator,

  InputLength,
  MaxInputLength = 0xff,
  InputEnd = InputLength + MaxInputLength,

  // Offsets from InputEnd + n * ResultEnd

  Fuzzer = 0,
  Codepoint,
  ResultEnd,
}

export const enum CoordinatorState {
  Idle,
  Scanning,
  HasResult,
}

export const enum FuzzerState {
  Fuzzing,
  Complete,
}
