type Props = { name: string; hue?: number; size?: number }

export function Avatar({ name, hue = 220, size = 36 }: Props) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  const fontSize = Math.round(size * 0.38)

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: `hsl(${hue} 60% 38%)`,
        fontSize,
      }}
      aria-hidden="true"
      title={name}
    >
      {initials || '?'}
    </div>
  )
}
