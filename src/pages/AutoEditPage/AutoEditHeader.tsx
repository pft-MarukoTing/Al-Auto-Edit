import logoSymbol from '../../assets/auto-edit/header/logo-symbol.svg'
import logoYouCamText from '../../assets/auto-edit/header/logo-youcam-text.svg'
import logoOnlineEditorText from '../../assets/auto-edit/header/logo-online-editor-text.svg'
import iconCreditCoin from '../../assets/auto-edit/header/icon-credit-coin.svg'
import iconAddPlus from '../../assets/auto-edit/header/icon-add-plus.svg'
import avatarCircleBg from '../../assets/auto-edit/header/avatar-circle-bg.svg'
import avatarMemberIcon from '../../assets/auto-edit/header/avatar-member-icon.svg'
import './AutoEditHeader.css'

interface AutoEditHeaderProps {
  credits: number
}

// Figma "Navigation header" (node 14442:170901) — the "YouCam Online Editor"
// tool chrome shared by every Auto-Edit frame. Every asset below (logo mark,
// wordmark, credit coin, avatar) is downloaded straight from that node rather
// than approximated.
function AutoEditHeader({ credits }: AutoEditHeaderProps) {
  return (
    <header className="auto-edit-header">
      <div className="auto-edit-header__brand">
        <img src={logoSymbol} alt="" className="auto-edit-header__logo-symbol" />
        <img src={logoYouCamText} alt="YouCam" className="auto-edit-header__logo-youcam" />
        <img src={logoOnlineEditorText} alt="Online Editor" className="auto-edit-header__logo-online-editor" />
      </div>
      <h1 className="auto-edit-header__title">AI Auto-Edit</h1>
      <div className="auto-edit-header__actions">
        <div className="auto-edit-header__credits">
          <img src={iconCreditCoin} alt="" className="auto-edit-header__credits-icon" />
          <span>{credits}</span>
          <button type="button" className="auto-edit-header__credits-add" aria-label="Add credits">
            <img src={iconAddPlus} alt="" />
          </button>
        </div>
        <button type="button" className="auto-edit-header__avatar" aria-label="Account">
          <img src={avatarCircleBg} alt="" className="auto-edit-header__avatar-bg" />
          <img src={avatarMemberIcon} alt="" className="auto-edit-header__avatar-icon" />
        </button>
      </div>
    </header>
  )
}

export default AutoEditHeader
