import { requireAdmin } from '@/app/actions/auth'
import { db } from '@/lib/adapters/db'
import styles from '../admin.module.css'
import PricingEditor from './PricingEditor'
import PromotionsEditor from './PromotionsEditor'

export default async function PricingPage() {
  await requireAdmin()
  const [pricing, promotions] = await Promise.all([
    db.listPricing(),
    db.listAllPromotions(),
  ])

  return (
    <div>
      <div className={styles.pageHeader}>
        <span className={styles.pageEyebrow}>MANAGE</span>
        <h1 className={styles.pageTitle}>Pricing & Promotions</h1>
        <p className={styles.pageSub}>Changes to rates apply to all future bookings immediately.</p>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionBlockTitle}>PRICING TIERS</div>
        <PricingEditor pricing={pricing} />
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.sectionBlockTitle}>PROMOTIONS & DISCOUNTS</div>
        <PromotionsEditor promotions={promotions} />
      </div>
    </div>
  )
}
