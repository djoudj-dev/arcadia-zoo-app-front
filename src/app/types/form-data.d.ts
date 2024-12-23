interface FormData {
  entries(): IterableIterator<[string, string | Blob]>;
}
