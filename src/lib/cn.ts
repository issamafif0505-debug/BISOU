/**
 * Tiny className helper — joins truthy class strings.
 * Avoids pulling `clsx` as a dependency for now.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
