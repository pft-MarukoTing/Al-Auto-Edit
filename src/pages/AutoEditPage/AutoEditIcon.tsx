import type { CSSProperties } from 'react'

interface AutoEditIconProps {
  src: string
  size?: number
  className?: string
}

// Shared mask-icon helper for this feature only (see AGENTS.md: monochrome
// `ic_*.svg` assets are applied as a CSS mask, tinted via `currentColor`, not
// rendered as `<img>`). Kept page-local since every other page already has
// its own equivalent inline (Button's MaskIcon, IconButton's icon span) — this
// just avoids repeating the same style object across this page's many files.
function AutoEditIcon({ src, size = 20, className }: AutoEditIconProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    maskImage: `url("${src}")`,
    WebkitMaskImage: `url("${src}")`,
  }
  return <span className={`auto-edit-icon${className ? ` ${className}` : ''}`} style={style} aria-hidden="true" />
}

export default AutoEditIcon
