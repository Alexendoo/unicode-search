export const enum Offset {
  Index,
  Turn,

  PIDFlags,

  InputLength,
  MaxInputLength = 0xff,
  InputEnd = InputLength + MaxInputLength,

  // Offsets from InputEnd + n * ResultEnd

  WakeFuzzer = 0,
  Codepoint,
  ResultEnd,
}
