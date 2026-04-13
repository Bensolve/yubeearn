export function validateLoginInputs(email: string, password: string): string | null {
  if (!email || !password) return "Please fill all fields";
  return null; // null = no error
}


export function validateSignupInputs(
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!email || !password || !confirmPassword) return "Please fill all fields";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}


export function validatePaymentDetails(
  paymentMethod: 'bank' | 'momo',
  bankName: string,
  accountNumber: string,
  phoneNumber: string
): string | null {
  if (paymentMethod === 'bank' && (!bankName || !accountNumber)) {
    return 'Please fill bank details';
  }
  if (paymentMethod === 'momo' && !phoneNumber) {
    return 'Please fill phone number';
  }
  return null;
}

export function validatePasswordChange(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): string | null {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return 'Please fill all password fields';
  }
  if (newPassword.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (newPassword !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

export function validateWithdrawAmount(
  amount: number,
  balance: number
): string | null {
  if (!amount || amount <= 0) return 'Please enter a valid amount';
  if (amount < 10) return 'Minimum withdrawal is GHS 10';
  if (amount > 50000) return 'Maximum withdrawal is GHS 50,000';
  if (amount > balance) return `Insufficient balance. You have GHS ${balance.toFixed(2)}`;
  return null;
}

export function validateWithdrawMethod(
  method: 'bank' | 'momo',
  bankAccount: string,
  bankName: string,
  phone: string
): string | null {
  if (method === 'bank' && (!bankAccount || !bankName)) return 'Please provide bank details';
  if (method === 'momo' && !phone) return 'Please provide phone number';
  return null;
}