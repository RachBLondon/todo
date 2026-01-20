/**
 * Get avatar path based on user ID using modulo
 * Consistently assigns one of 3 avatars to each user
 */
export function getAvatarPath(userId: string): string {
  // Convert the last part of the UUID to a number for modulo
  // Using last 8 characters of UUID as hex
  const hexPart = userId.replace(/-/g, '').slice(-8);
  const num = parseInt(hexPart, 16);
  const avatarIndex = (num % 3) + 1; // 1, 2, or 3

  return `/avatars/avatar-${avatarIndex}.png`;
}
