import { MapPin } from 'lucide-react'
import site from './Site.module.css'
import styles from './StudioLocation.module.css'

const latitude = -0.596442
const longitude = 30.636703
const googleMapsLink = 'https://maps.app.goo.gl/y41ptNb9xk4CcweG7'
const mapParams = new URLSearchParams({
  q: `${latitude},${longitude}`,
  z: '17',
  output: 'embed',
})

export default function StudioLocation({ compact = false }: { compact?: boolean }) {
  const directions = (
    <a
      className={`${compact ? styles.directions : site.textLink} ${site.iconLabel}`}
      href={googleMapsLink}
      target="_blank"
      rel="noreferrer"
    >
      <MapPin aria-hidden="true" /> Open in Google Maps
    </a>
  )

  return (
    <section id="location" className={compact ? styles.compact : styles.location} aria-labelledby="location-title">
      <div className={compact ? styles.details : site.copy}>
        <h2 id="location-title">{compact ? 'See what you can make in Mbarara' : 'Find us in Mbarara'}</h2>
        <p>{compact ? 'Visit 202One for a private room, a recording session, or a team to help finish your project.' : '202One Studio is based in Mbarara, Uganda. Use the map pin to plan your visit.'}</p>
        {compact && directions}
      </div>
      <iframe
        className={styles.map}
        src={`https://www.google.com/maps?${mapParams}`}
        title="Google Maps pin for 202One Studio in Mbarara, Uganda"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {!compact && (
        <div className={styles.mapActions}>
          <p className={styles.coordinates}>{latitude}, {longitude}</p>
          {directions}
        </div>
      )}
    </section>
  )
}
