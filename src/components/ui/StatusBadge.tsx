import type { Availability } from '../../data/vehicles'
import { useLang } from '../../i18n'

export function StatusBadge({ status }: { status: Availability }) {
  const { t } = useLang()
  return (
    <span className={`status status--${status}`}>
      <i className="status__dot" aria-hidden="true" />
      {t.status[status]}
    </span>
  )
}
