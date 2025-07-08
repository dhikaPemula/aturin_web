export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  const feedback = []
  if (!checks.length) feedback.push("Minimal 8 karakter")
  if (!checks.uppercase) feedback.push("Tambahkan huruf besar")
  if (!checks.lowercase) feedback.push("Tambahkan huruf kecil")
  if (!checks.number) feedback.push("Tambahkan angka")
  if (!checks.special) feedback.push("Tambahkan simbol")

  return {
    score,
    feedback,
    isValid: score >= 4,
  }
}

export const checkPasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword
}
