import { Hero } from '../components/Hero'
import { ChiSiamo } from '../components/ChiSiamo'
import { BandaCinematica } from '../components/BandaCinematica'
import { Corsi } from '../components/Corsi'
import { Voucher } from '../components/Voucher'
import { Galleria } from '../components/Galleria'
import { Contatti } from '../components/Contatti'
import { FiloArcobaleno } from '../components/Onda'
import { StrisciaCorsi } from '../components/StrisciaCorsi'
import { Citazione } from '../components/Citazione'
import { LaMaestra } from '../components/LaMaestra'
import { Qualifiche } from '../components/Qualifiche'
import { Vacugym } from '../components/Vacugym'

export function Home({ versoSezione }: { versoSezione: (id: string) => void }) {
  return (
    <>
      <Hero versoSezione={versoSezione} />
      {/* Banner scorrevole: non si ferma mai, nemmeno col mouse sopra. */}
      <StrisciaCorsi />
      <ChiSiamo />
      {/* Il momento cinematografico: video sul palco, luminanza 35/255. */}
      <BandaCinematica />
      <Corsi versoSezione={versoSezione} />
      {/* Il Vacugym è un macchinario, non una disciplina: sezione a sé. */}
      <Vacugym versoSezione={versoSezione} />
      {/* Il racconto dell'insegnante, testo integrale del cliente. */}
      <LaMaestra />
      {/* Riconoscimenti CONI, laurea, diplomi, affiliazioni. */}
      <Qualifiche />
      <Voucher versoSezione={versoSezione} />
      <FiloArcobaleno />
      <Galleria />
      {/* Dichiarazione della scuola: riempie lo stacco prima dei contatti. */}
      <Citazione />
      <Contatti />
    </>
  )
}
