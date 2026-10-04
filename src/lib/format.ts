export function formatTs(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export const isSameDay = (a: number, b: number) =>
  new Date(a).toDateString() === new Date(b).toDateString()
