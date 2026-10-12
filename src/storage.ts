import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'chutaai:';

export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)).catch(() => {});
}
