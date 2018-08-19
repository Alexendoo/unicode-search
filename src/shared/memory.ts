export const enum Offset {
  Index,
  Turn,

  Coordinator,
  Mutex,
  Codepoint,

  InputLength,
  MaxInputLength = 0xff,
  InputEnd = InputLength + MaxInputLength,
}
