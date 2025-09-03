type ClassValue = string | number | boolean | null | undefined | Record<string, unknown>;
type ClassArray = ClassValue[];

export const classNames = (...args: (ClassValue | ClassArray)[]): string => {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(String(arg));

      continue;
    }

    if (Array.isArray(arg)) {
      const inner = classNames(...arg);
      if (inner) classes.push(inner);

      continue;
    }

    if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
};
