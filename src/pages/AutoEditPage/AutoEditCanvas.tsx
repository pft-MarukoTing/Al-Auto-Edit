import { useState, type DragEvent } from 'react'
import emptyPhotoIllustration from '../../assets/auto-edit/illustrations/empty-photo.svg'
import icGrip from '../../assets/auto-edit/icons/grip-vertical.svg'
import icEdit from '../../assets/auto-edit/icons/square-pen.svg'
import icDelete from '../../assets/auto-edit/icons/trash.svg'
import icPlus from '../../assets/icons/ic_add.svg'
import icAlert from '../../assets/icons/ic_alert.svg'
import icClose from '../../assets/icons/ic_close.svg'
import AutoEditIcon from './AutoEditIcon'
import {
  type MediaItem,
  MIN_MATERIAL_SECONDS,
  MAX_MATERIAL_SECONDS,
  formatMaterialLabel,
} from './autoEditData'
import './AutoEditCanvas.css'

interface AutoEditCanvasProps {
  activeTab: 'Media' | 'History'
  onTabChange: (tab: 'Media' | 'History') => void
  media: MediaItem[]
  materialSeconds: number
  onImportMedia: () => void
  onEditClip: (id: string) => void
  onDeleteClip: (id: string) => void
  onReorderMedia: (fromIndex: number, toIndex: number) => void
  warningDismissed: boolean
  onDismissWarning: () => void
}

// Figma "Auto-Edit / Empty State", "/ Ideal State" and "/ Near Limit Warning
// State" right canvas (see auto-edit-spec-main.md sections 1, 2 and 4).
function AutoEditCanvas({
  activeTab,
  onTabChange,
  media,
  materialSeconds,
  onImportMedia,
  onEditClip,
  onDeleteClip,
  onReorderMedia,
  warningDismissed,
  onDismissWarning,
}: AutoEditCanvasProps) {
  const hasMedia = media.length > 0
  const videoCount = media.filter((m) => m.kind === 'video').length
  const photoCount = media.length - videoCount
  const isNearLimit = hasMedia && materialSeconds < MIN_MATERIAL_SECONDS && !warningDismissed
  const secondsNeeded = Math.max(0, MIN_MATERIAL_SECONDS - materialSeconds)

  // Drag-to-reorder (matches the grid's own drag-handle affordance — see
  // "ic-grip-vertical" in the Figma spec, "drag, reorder, sort, move").
  // Native HTML5 drag-and-drop rather than a library: this is a simple flat
  // list reorder, no nested/virtualized lists involved.
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragOver(event: DragEvent, index: number) {
    event.preventDefault()
    if (index !== dragOverIndex) setDragOverIndex(index)
  }

  function handleDrop(index: number) {
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderMedia(draggedIndex, index)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="auto-edit-canvas">
      <div className="auto-edit-canvas__tabs-row">
        <div className="auto-edit-canvas__tabs">
          <button
            type="button"
            className={`auto-edit-canvas__tab${activeTab === 'Media' ? ' auto-edit-canvas__tab--active' : ''}`}
            onClick={() => onTabChange('Media')}
          >
            Media
          </button>
          <button
            type="button"
            className={`auto-edit-canvas__tab${activeTab === 'History' ? ' auto-edit-canvas__tab--active' : ''}`}
            onClick={() => onTabChange('History')}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'History' ? (
        <div className="auto-edit-canvas__card auto-edit-canvas__card--empty">
          <p className="auto-edit-canvas__empty-body">No generation history yet.</p>
        </div>
      ) : !hasMedia ? (
        <div className="auto-edit-canvas__card auto-edit-canvas__card--empty">
          <img src={emptyPhotoIllustration} alt="" className="auto-edit-canvas__empty-icon" />
          <h2 className="auto-edit-canvas__empty-title">Your media appears here</h2>
          <p className="auto-edit-canvas__empty-body">
            Videos up to 10 minutes each, or photos — 1 photo counts as 2 seconds. You need 30 seconds of
            material to generate.
          </p>
          <button type="button" className="auto-edit-canvas__import-btn" onClick={onImportMedia}>
            <AutoEditIcon src={icPlus} size={18} />
            Import media
          </button>
        </div>
      ) : (
        <div className="auto-edit-canvas__card">
          <div className="auto-edit-canvas__grid-header">
            <h2 className="auto-edit-canvas__grid-title">Your media</h2>
            <span className="auto-edit-canvas__stat-pill">{videoCount} / 60 videos</span>
            <span className="auto-edit-canvas__stat-pill">{photoCount} / 300 photos</span>
            <button type="button" className="auto-edit-canvas__import-btn auto-edit-canvas__import-btn--outline" onClick={onImportMedia}>
              <AutoEditIcon src={icPlus} size={18} />
              Import media
            </button>
          </div>

          <div className="auto-edit-canvas__storage-row">
            <div className="auto-edit-canvas__storage-track">
              <div
                className={`auto-edit-canvas__storage-fill${materialSeconds < MIN_MATERIAL_SECONDS ? ' auto-edit-canvas__storage-fill--warning' : ''}`}
                style={{ width: `${Math.min(100, (materialSeconds / MAX_MATERIAL_SECONDS) * 100)}%` }}
              />
            </div>
            <span className="auto-edit-canvas__storage-label">
              {formatMaterialLabel(materialSeconds)} of material · 30:00 max
            </span>
          </div>

          {isNearLimit && (
            <div className="auto-edit-canvas__alert">
              <AutoEditIcon src={icAlert} size={24} className="auto-edit-canvas__alert-icon" />
              <span className="auto-edit-canvas__alert-text">{secondsNeeded} more seconds of material needed</span>
              <button type="button" className="auto-edit-canvas__alert-dismiss" aria-label="Dismiss" onClick={onDismissWarning}>
                <AutoEditIcon src={icClose} size={16} />
              </button>
            </div>
          )}

          <div className="auto-edit-canvas__grid">
            {media.map((item, index) => (
              <div
                key={item.id}
                className={`auto-edit-canvas__thumb${draggedIndex === index ? ' auto-edit-canvas__thumb--dragging' : ''}${dragOverIndex === index && draggedIndex !== index ? ' auto-edit-canvas__thumb--drag-over' : ''}`}
                style={{ aspectRatio: `${item.ratio}` }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <img src={item.src} alt="" />
                <div className="auto-edit-canvas__thumb-top">
                  <span className="auto-edit-canvas__thumb-index">{index + 1}</span>
                  <span className="auto-edit-canvas__thumb-grip" aria-label="Drag to reorder">
                    <AutoEditIcon src={icGrip} size={16} />
                  </span>
                </div>
                <div className="auto-edit-canvas__thumb-bottom">
                  {item.durationLabel ? (
                    <span className="auto-edit-canvas__thumb-duration">{item.durationLabel}</span>
                  ) : (
                    <span />
                  )}
                  <span className="auto-edit-canvas__thumb-actions">
                    <button type="button" aria-label="Add hints" onClick={() => onEditClip(item.id)}>
                      <AutoEditIcon src={icEdit} size={14} />
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => onDeleteClip(item.id)}>
                      <AutoEditIcon src={icDelete} size={14} />
                    </button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AutoEditCanvas
