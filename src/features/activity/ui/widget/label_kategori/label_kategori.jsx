// Import ikon kategori
import akademikIcon from "../../../../../assets/activity/categories/akademik.svg"
import hiburanIcon from "../../../../../assets/activity/categories/hiburan.svg"
import pekerjaanIcon from "../../../../../assets/activity/categories/pekerjaan.svg"
import olahragaIcon from "../../../../../assets/activity/categories/olahraga.svg"
import sosialIcon from "../../../../../assets/activity/categories/sosial.svg"
import spiritualIcon from "../../../../../assets/activity/categories/spiritual.svg"
import pribadiIcon from "../../../../../assets/activity/categories/pribadi.svg"
import istirahatIcon from "../../../../../assets/activity/categories/istirahat.svg"
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
      textColor: "#8E5C42", 
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
