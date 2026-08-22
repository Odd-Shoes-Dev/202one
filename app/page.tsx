import Nav from './components/Nav'
import Hero from './components/Hero'
import PatternDivider from './components/PatternDivider'
import Making from './components/Making'
import TheSpace from './components/TheSpace'
import Experience from './components/Experience'
import Sessions from './components/Sessions'
import Pricing from './components/Pricing'
import Community from './components/Community'
import About from './components/About'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import RevealObserver from './components/RevealObserver'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <PatternDivider />
      <Making />
      <TheSpace />
      <PatternDivider />
      <Experience />
      <Sessions />
      <Pricing />
      <Community />
      <About />
      <FinalCta />
      <Footer />
      <RevealObserver />
    </>
  )
}
