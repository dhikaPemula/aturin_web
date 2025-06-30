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
      textColor: "#3B82F6", // blue-500
      displayName: "Akademik",
    },
    hiburan: {
      icon: hiburanIcon,
      textColor: "#A855F7", // purple-500
      displayName: "Hiburan",
    },
    pekerjaan: {
      icon: pekerjaanIcon,
      textColor: "#F59E0B", // amber-500
      displayName: "Pekerjaan",
    },
    olahraga: {
      icon: olahragaIcon,
      textColor: "#EF4444", // red-500
      displayName: "Olahraga",
    },
    sosial: {
      icon: sosialIcon,
      textColor: "#F97316", // orange-500
      displayName: "Sosial",
    },
    spiritual: {
      icon: spiritualIcon,
      textColor: "#10B981", // emerald-500
      displayName: "Spiritual",
    },
    pribadi: {
      icon: pribadiIcon,
      textColor: "#EAB308", // yellow-500
      displayName: "Pribadi",
    },
    istirahat: {
      icon: istirahatIcon,
      textColor: "#6366F1", // indigo-500
      displayName: "Istirahat",
    },
  }

  const config = categoryConfig[normalizedKategori] || categoryConfig.pribadi

  console.log("🏷️ Label Kategori Debug:", {
    originalKategori: kategori,
    normalizedKategori,
    config: config.displayName,
    textColor: config.textColor,
  })

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
