import icHome from '../../assets/icons/ic_home.svg'
import icCamera from '../../assets/icons/ic_camera.svg'
import icEdit from '../../assets/icons/ic_edit.svg'
import icVideoAi from '../../assets/icons/ic_video_ai.svg'
import icEditAi from '../../assets/icons/ic_edit_ai.svg'
import icUser from '../../assets/icons/ic_user.svg'
import icSquare from '../../assets/icons/ic_square.svg'
import icMedia from '../../assets/icons/ic_media.svg'
import AutoEditIcon from './AutoEditIcon'
import './AutoEditSidebar.css'

// Figma's tool-shell sidebar (112px, icon+label rail) — a different navigation
// from YCM's own product Sidebar (Home/MV Create/Song Create/...). This is the
// "YouCam Online Editor" suite's tool switcher; only "AI Video" is a real
// destination here (this page), the rest are decorative/non-interactive
// per this project's mock-data-only scope.
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: icHome },
  { id: 'ai-photo', label: 'AI Photo Editing', icon: icCamera },
  { id: 'basic', label: 'Basic Editing', icon: icEdit },
  { id: 'ai-video', label: 'AI Video', icon: icVideoAi },
  { id: 'ai-image', label: 'AI Image', icon: icEditAi },
  { id: 'ai-portrait', label: 'AI Portrait', icon: icUser },
  { id: 'batch', label: 'Batch Editing', icon: icSquare },
  { id: 'gallery', label: 'My Gallery', icon: icMedia },
]

function AutoEditSidebar() {
  return (
    <nav className="auto-edit-sidebar" aria-label="Tool navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`auto-edit-sidebar__item${item.id === 'ai-video' ? ' auto-edit-sidebar__item--active' : ''}`}
        >
          <AutoEditIcon src={item.icon} size={24} className="auto-edit-sidebar__icon" />
          <span className="auto-edit-sidebar__label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default AutoEditSidebar
