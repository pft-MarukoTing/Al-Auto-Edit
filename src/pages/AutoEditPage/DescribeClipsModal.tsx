import { useState } from 'react'
import icClose from '../../assets/icons/ic_close.svg'
import AutoEditIcon from './AutoEditIcon'
import type { MediaItem } from './autoEditData'
import './DescribeClipsModal.css'

interface DescribeClipsModalProps {
  media: MediaItem[]
  initialClipId: string
  onCancel: () => void
  onDone: (hints: Record<string, string>) => void
}

const HINT_MAX = 2500

// Figma "Auto-Edit / Describe your clips" (+ "/ Scroll Down") — see
// auto-edit-spec-main.md section 3. 600x600 modal, internally scrollable body,
// sticky header/footer.
function DescribeClipsModal({ media, initialClipId, onCancel, onDone }: DescribeClipsModalProps) {
  const [selectedId, setSelectedId] = useState(initialClipId)
  const [hints, setHints] = useState<Record<string, string>>(() =>
    Object.fromEntries(media.map((item) => [item.id, item.hint])),
  )

  const selected = media.find((item) => item.id === selectedId) ?? media[0]
  const hintValue = hints[selected.id] ?? ''

  return (
    <div className="ae-modal-overlay" role="dialog" aria-modal="true" aria-label="Describe your clips">
      <div className="ae-modal ae-modal--wide">
        <button type="button" className="ae-modal__close" aria-label="Close" onClick={onCancel}>
          <AutoEditIcon src={icClose} size={24} />
        </button>
        <div className="ae-modal__heading-row">
          <h2 className="ae-modal__heading">Describe your clips</h2>
        </div>

        <div className="ae-modal__body describe-clips-modal__body">
          <section>
            <h3 className="describe-clips-modal__label">Select to edit</h3>
            <div className="describe-clips-modal__thumb-row">
              {media.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`describe-clips-modal__thumb${item.id === selected.id ? ' describe-clips-modal__thumb--selected' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <img src={item.src} alt="" />
                </button>
              ))}
            </div>
          </section>

          <section className="describe-clips-modal__story">
            <h3 className="describe-clips-modal__label">Tell the story of this moment</h3>
            <div className="describe-clips-modal__preview">
              <img src={selected.src} alt="" />
            </div>
            <div className="describe-clips-modal__field-wrap">
              <textarea
                className="describe-clips-modal__field"
                placeholder="Describe your video to help AI create a more compelling story."
                maxLength={HINT_MAX}
                value={hintValue}
                onChange={(event) => setHints((prev) => ({ ...prev, [selected.id]: event.target.value }))}
              />
              <div className="describe-clips-modal__field-footer">
                <span>
                  {hintValue.length}/{HINT_MAX}
                </span>
                {hintValue.length > 0 && (
                  <button
                    type="button"
                    className="describe-clips-modal__clear-btn"
                    aria-label="Clear"
                    onClick={() => setHints((prev) => ({ ...prev, [selected.id]: '' }))}
                  >
                    <AutoEditIcon src={icClose} size={12} />
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="ae-modal__footer">
          <button type="button" className="ae-btn ae-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="ae-btn ae-btn--primary" onClick={() => onDone(hints)}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default DescribeClipsModal
