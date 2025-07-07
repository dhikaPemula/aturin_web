// Import ikon kategori
import akademikIcon from "../../../../../assets/icons/akademik.svg"
import hiburanIcon from "../../../../../assets/icons/hiburan.svg"
import pekerjaanIcon from "../../../../../assets/icons/pekerjaan.svg"
import olahragaIcon from "../../../../../assets/icons/olahraga.svg"
import sosialIcon from "../../../../../assets/icons/sosial.svg"
import spiritualIcon from "../../../../../assets/icons/spiritual.svg"
import pribadiIcon from "../../../../../assets/icons/pribadi.svg"
import istirahatIcon from "../../../../../assets/icons/istirahat.svg"
import styles from "./label_kategori.module.css"

const LabelKategori = ({ kategori }) => {
  // Normalize kategori name untuk memastikan matching yang benar
  const normalizedKategori = kategori?.toLowerCase() || ""

  const categoryConfig = {
    akademik: {
      icon: akademikIcon,
      textColor: "#3498DB", 
      displayName: "Akademik",
    },
    hiburan: {
      icon: hiburanIcon,
      textColor: "#9B59B6", 
      displayName: "Hiburan",
    },
    pekerjaan: {
      icon: pekerjaanIcon,
      textColor: "#F59E0B", 
      displayName: "Pekerjaan",
    },
    olahraga: {
      icon: olahragaIcon,
      textColor: "#E74C3C", 
      displayName: "Olahraga",
    },
    sosial: {
      icon: sosialIcon,
      textColor: "#E67E22", 
      displayName: "Sosial",
    },
    spiritual: {
      icon: spiritualIcon,
      textColor: "#27AE60", 
      displayName: "Spiritual",
    },
    pribadi: {
      icon: pribadiIcon,
      textColor: "#F1C40F", 
      displayName: "Pribadi",
    },
    istirahat: {
      icon: istirahatIcon,
      textColor: "#283593", 
      displayName: "Istirahat",
    },
  }

  const config = categoryConfig[normalizedKategori] || categoryConfig.pribadi

  return (
    <div className={styles.labelContainer} data-category={normalizedKategori}>
      <div className={styles.labelContent}>
        <img src={config.icon || "/placeholder.svg"} alt={config.displayName} className={styles.labelIcon} />
        <span className={styles.labelText} style={{ color: config.textColor }}>
          {config.displayName}
        </span>
      </div>
    </div>
  )
}

export default LabelKategori
