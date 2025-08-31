export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /\W/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const strengthMap = {
    0: { label: 'Very Weak', color: '#ff4444' },
    1: { label: 'Very Weak', color: '#ff4444' },
    2: { label: 'Weak', color: '#ff8e53' },
    3: { label: 'Fair', color: '#ffb347' },
    4: { label: 'Good', color: '#90ee90' },
    5: { label: 'Strong', color: '#22c55e' },
  };

  return {
    score,
    label: strengthMap[score as keyof typeof strengthMap].label,
    color: strengthMap[score as keyof typeof strengthMap].color,
    checks,
  };
};
