const EXT_REGEX = /^[a-z0-9][a-z0-9_-]*$/;
const MAX_LENGTH = 20;

export function normalizeExtension(raw: string): string {
  return raw.replace(/^\./, '').trim().toLowerCase();
}

export function validateExtensionInput(raw: string): string {
  const ext = normalizeExtension(raw);
  if (!ext) {
    throw new Error('확장자를 입력해주세요.');
  }
  if (ext.length > MAX_LENGTH) {
    throw new Error(`확장자는 최대 ${MAX_LENGTH}자까지 가능합니다.`);
  }
  if (!EXT_REGEX.test(ext)) {
    throw new Error('영문 소문자, 숫자, -, _ 만 사용할 수 있습니다.');
  }
  return ext;
}

export function normalizedEquals(a: string, b: string): boolean {
  return normalizeExtension(a) === normalizeExtension(b);
}
