type Props = { name: string; hue?: number; size?: number }

export function Avatar({ name, hue = 220, size = 36 }: Props) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue} 55% 42%)`,
      }}
      aria-hidden="true"
      title={name}
    >
      ☺
    </div>
  )
}
