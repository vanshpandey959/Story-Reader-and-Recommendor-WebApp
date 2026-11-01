export const loadJson = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / blocked - ignore */
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};
