"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "./user-preference.module.css"
import aturinMascot from "/assets/user_preference/aturin_mascot.svg"
import halfMoonIcon from "/assets/user_preference/half-moon.svg"
import sunLightIcon from "/assets/user_preference/sun-light.svg"
import seaAndSunIcon from "/assets/user_preference/sea-and-sun.svg"
import cloudSunnyIcon from "/assets/user_preference/cloud-sunny.svg"
import arrowLeftIcon from "/assets/user_preference/arrow-left.svg"
import arrowRightIcon from "/assets/user_preference/arrow-right.svg"
import checkCircleIcon from "/assets/user_preference/check-circle.svg"
import { categories } from "../categories/categories.jsx"

const UserPreference = ({ isOpen, onClose, onSave }) => {
  // State untuk form data
  const [formData, setFormData] = useState({
    workStartTime: "09:00",
    workEndTime: "17:00",
    breakDuration: "60",
    maxTasksPerDay: "5",
    preferredCategories: [],
    targetFrequency: "",
    notificationEnabled: true,
    reminderTime: "10",
    sleepPeriods: {
      malam: true,
      siang: false
    },
    sleepTimes: {
      malam: {
        jamTidur: "22:00",
        jamBangun: "06:00"
      },
      siang: {
        jamTidur: "13:00",
        jamBangun: "15:00"
      }
    },
    focusPeriods: {
      pagi: false,
      siang: false,
      sore: false,
      malam: false
    }
  })

  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState("")
  const [currentStep, setCurrentStep] = useState(0)

  // Frequency options for case 3
  const frequencyOptions = [
    { value: "1x", label: "1x seminggu", description: "Santai aja ~" },
    { value: "2x", label: "2x seminggu", description: "Lumayan nih ~" },
    { value: "3x", label: "3x seminggu", description: "Keren~" },
    { value: "4x", label: "4x seminggu", description: "Si paling konsisten ~" }
  ]

  // Steps configuration
  const steps = [
    {
      title: "Periode Tidur",
      key: "sleepTime",
      question: "Biasanya kamu mulai tidur dan bangun jam berapa, nih?!"
    },
    {
      title: "Jam Fokus Ideal",
      key: "taskPreferences",
      question: "Kamu paling semangat ngerjain tugas di jam berapa, sih? "
    },
    {
      title: "Prioritas Aktivitas",
      key: "categories",
      question: "Aktivitas apa yang penting untuk kamu jaga dalam hidupmu tiap minggu?"
    },
    {
      title: "Target Frekuensi Aktivitas",
      key: "notifications",
      question: "Kalau untuk Hiburan, kamu mau ngerjainnya berapa kali seminggu nih?"
    }
  ]

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle sleep period toggle
  const handleSleepPeriodToggle = (period) => {
    setFormData((prev) => ({
      ...prev,
      sleepPeriods: {
        ...prev.sleepPeriods,
        [period]: !prev.sleepPeriods[period]
      }
    }));
  };

  // Handle focus period toggle
  const handleFocusPeriodToggle = (period) => {
    setFormData((prev) => {
      const currentFocusPeriods = prev.focusPeriods;
      const isCurrentlySelected = currentFocusPeriods[period];
      
      // Jika sedang unselect, langsung izinkan
      if (isCurrentlySelected) {
        return {
          ...prev,
          focusPeriods: {
            ...prev.focusPeriods,
            [period]: false
          }
        };
      }
      
      // Jika sedang select, cek apakah sudah ada 2 yang terpilih
      const selectedCount = Object.values(currentFocusPeriods).filter(Boolean).length;
      if (selectedCount >= 2) {
        // Sudah mencapai maksimal, tidak bisa select lagi
        return prev;
      }
      
      // Boleh select
      return {
        ...prev,
        focusPeriods: {
          ...prev.focusPeriods,
          [period]: true
        }
      };
    });
  };

  // Handle sleep time changes
  const handleSleepTimeChange = (period, timeType, value) => {
    setFormData((prev) => ({
      ...prev,
      sleepTimes: {
        ...prev.sleepTimes,
        [period]: {
          ...prev.sleepTimes[period],
          [timeType]: value
        }
      }
    }));
  };

  // Handle category selection
  const handleCategoryToggle = (categoryName) => {
    setFormData((prev) => {
      const currentCategories = prev.preferredCategories;
      const isCurrentlySelected = currentCategories.includes(categoryName);
      
      // Jika sedang unselect, langsung izinkan
      if (isCurrentlySelected) {
        return {
          ...prev,
          preferredCategories: currentCategories.filter(c => c !== categoryName)
        };
      }
      
      // Jika sedang select, cek apakah sudah ada 4 yang terpilih
      if (currentCategories.length >= 4) {
        // Sudah mencapai maksimal, tidak bisa select lagi
        return prev;
      }
      
      // Boleh select
      return {
        ...prev,
        preferredCategories: [...currentCategories, categoryName]
      };
    });
  };

  // Handle frequency selection
  const handleFrequencyToggle = (frequency) => {
    setFormData((prev) => ({
      ...prev,
      targetFrequency: prev.targetFrequency === frequency ? "" : frequency
    }));
  };

  // Validate current step
  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 0: // Periode Tidur
        // Validasi minimal satu periode tidur harus dipilih
        if (!formData.sleepPeriods.malam && !formData.sleepPeriods.siang) {
          newErrors.sleepPeriods = "Pilih minimal satu periode tidur";
        }
        
        // Validasi waktu tidur malam jika dipilih
        if (formData.sleepPeriods.malam) {
          if (!formData.sleepTimes.malam.jamTidur) {
            newErrors.malamTidur = "Jam tidur malam harus diisi";
          }
          if (!formData.sleepTimes.malam.jamBangun) {
            newErrors.malamBangun = "Jam bangun malam harus diisi";
          }
        }
        
        // Validasi waktu tidur siang jika dipilih
        if (formData.sleepPeriods.siang) {
          if (!formData.sleepTimes.siang.jamTidur) {
            newErrors.siangTidur = "Jam tidur siang harus diisi";
          }
          if (!formData.sleepTimes.siang.jamBangun) {
            newErrors.siangBangun = "Jam bangun siang harus diisi";
          }
          
          // Validasi durasi tidur siang tidak terlalu lama
          if (formData.sleepTimes.siang.jamTidur && formData.sleepTimes.siang.jamBangun) {
            const startTime = new Date(`2000-01-01 ${formData.sleepTimes.siang.jamTidur}`);
            const endTime = new Date(`2000-01-01 ${formData.sleepTimes.siang.jamBangun}`);
            if (startTime >= endTime) {
              newErrors.siangBangun = "Jam bangun harus lebih besar dari jam tidur";
            }
          }
        }
        break;
        
      case 1: // Jam Fokus Ideal
        // Validasi maksimal 2 periode fokus
        const selectedFocusPeriods = Object.values(formData.focusPeriods || {}).filter(Boolean);
        if (selectedFocusPeriods.length > 2) {
          newErrors.focusPeriods = "Pilih maksimal 2 periode waktu fokus";
        }
        break;
        
      case 2: // Kategori
        // Validasi maksimal 4 kategori
        if (formData.preferredCategories.length > 4) {
          newErrors.categories = "Pilih maksimal 4 kategori aktivitas";
        }
        break;
        
      case 3: // Notifikasi - tidak ada validasi wajib
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Last step - save
        onSave(formData);
        onClose();
      }
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext(); // Use handleNext instead of direct validation
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField("");

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.section}>
            {/* Periode Tidur Header */}
            <div className={styles.sleepPeriodHeader}>
              <h3 className={styles.sleepPeriodTitle}>Periode Tidur</h3>
              <div className={styles.sleepPeriodToggles}>
                <label className={styles.sleepPeriodToggle}>
                  <input
                    type="checkbox"
                    checked={formData.sleepPeriods.malam}
                    onChange={() => handleSleepPeriodToggle('malam')}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Malam</span>
                </label>
                <label className={styles.sleepPeriodToggle}>
                  <input
                    type="checkbox"
                    checked={formData.sleepPeriods.siang}
                    onChange={() => handleSleepPeriodToggle('siang')}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Siang</span>
                </label>
              </div>
            </div>
            {errors.sleepPeriods && <span className={styles.errorText}>{errors.sleepPeriods}</span>}

            {/* Tidur Malam */}
            {formData.sleepPeriods.malam && (
              <div className={styles.sleepSection}>
                <div className={styles.sleepSectionHeader}>
                  <img src={halfMoonIcon} alt="Half Moon" className={styles.sleepIcon} />
                  <h4 className={styles.sleepSectionTitle}>Tidur Malam</h4>
                </div>
                <div className={styles.timeFields}>
                  <div className={styles.field}>
                    <label className={styles.label}>Jam Tidur</label>
                    <input
                      type="time"
                      value={formData.sleepTimes.malam.jamTidur}
                      onChange={(e) => handleSleepTimeChange('malam', 'jamTidur', e.target.value)}
                      onFocus={() => handleFocus("malamTidur")}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        focusedField === "malamTidur" ? styles.inputFocused : ""
                      } ${errors.malamTidur ? styles.inputError : ""}`}
                    />
                    {errors.malamTidur && <span className={styles.errorText}>{errors.malamTidur}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Jam Bangun</label>
                    <input
                      type="time"
                      value={formData.sleepTimes.malam.jamBangun}
                      onChange={(e) => handleSleepTimeChange('malam', 'jamBangun', e.target.value)}
                      onFocus={() => handleFocus("malamBangun")}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        focusedField === "malamBangun" ? styles.inputFocused : ""
                      } ${errors.malamBangun ? styles.inputError : ""}`}
                    />
                    {errors.malamBangun && <span className={styles.errorText}>{errors.malamBangun}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Tidur Siang */}
            {formData.sleepPeriods.siang && (
              <div className={styles.sleepSection}>
                <div className={styles.sleepSectionHeader}>
                  <img src={sunLightIcon} alt="Sun Light" className={styles.sleepIcon} />
                  <h4 className={styles.sleepSectionTitle}>Tidur Siang</h4>
                </div>
                <div className={styles.timeFields}>
                  <div className={styles.field}>
                    <label className={styles.label}>Jam Tidur</label>
                    <input
                      type="time"
                      value={formData.sleepTimes.siang.jamTidur}
                      onChange={(e) => handleSleepTimeChange('siang', 'jamTidur', e.target.value)}
                      onFocus={() => handleFocus("siangTidur")}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        focusedField === "siangTidur" ? styles.inputFocused : ""
                      } ${errors.siangTidur ? styles.inputError : ""}`}
                    />
                    {errors.siangTidur && <span className={styles.errorText}>{errors.siangTidur}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Jam Bangun</label>
                    <input
                      type="time"
                      value={formData.sleepTimes.siang.jamBangun}
                      onChange={(e) => handleSleepTimeChange('siang', 'jamBangun', e.target.value)}
                      onFocus={() => handleFocus("siangBangun")}
                      onBlur={handleBlur}
                      className={`${styles.input} ${
                        focusedField === "siangBangun" ? styles.inputFocused : ""
                      } ${errors.siangBangun ? styles.inputError : ""}`}
                    />
                    {errors.siangBangun && <span className={styles.errorText}>{errors.siangBangun}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className={styles.section}>
            {/* Jam Fokus Ideal Header */}
            <div className={styles.sleepPeriodHeader}>
              <h3 className={styles.sleepPeriodTitle}>Jam Fokus Ideal</h3>
            </div>
            
            <div className={styles.focusPeriodGrid}>
              <div 
                className={`${styles.focusPeriodCard} ${formData.focusPeriods?.pagi ? styles.focusPeriodCardSelected : ''}`}
                onClick={() => handleFocusPeriodToggle('pagi')}
              >
                <img src={seaAndSunIcon} alt="Pagi" className={styles.focusPeriodIcon} />
                <div className={styles.focusPeriodText}>
                  <span className={styles.checkboxText}>Pagi</span>
                  <span className={styles.timeText}>(06:00 - 10:00)</span>
                </div>
                {formData.focusPeriods?.pagi && (
                  <img src={checkCircleIcon} alt="Selected" className={styles.checkIcon} />
                )}
              </div>

              <div 
                className={`${styles.focusPeriodCard} ${formData.focusPeriods?.siang ? styles.focusPeriodCardSelected : ''}`}
                onClick={() => handleFocusPeriodToggle('siang')}
              >
                <img src={sunLightIcon} alt="Siang" className={styles.focusPeriodIcon} />
                <div className={styles.focusPeriodText}>
                  <span className={styles.checkboxText}>Siang</span>
                  <span className={styles.timeText}>(10:00 - 14:00)</span>
                </div>
                {formData.focusPeriods?.siang && (
                  <img src={checkCircleIcon} alt="Selected" className={styles.checkIcon} />
                )}
              </div>

              <div 
                className={`${styles.focusPeriodCard} ${formData.focusPeriods?.sore ? styles.focusPeriodCardSelected : ''}`}
                onClick={() => handleFocusPeriodToggle('sore')}
              >
                <img src={cloudSunnyIcon} alt="Sore" className={styles.focusPeriodIcon} />
                <div className={styles.focusPeriodText}>
                  <span className={styles.checkboxText}>Sore</span>
                  <span className={styles.timeText}>(14:00 - 18:00)</span>
                </div>
                {formData.focusPeriods?.sore && (
                  <img src={checkCircleIcon} alt="Selected" className={styles.checkIcon} />
                )}
              </div>

              <div 
                className={`${styles.focusPeriodCard} ${formData.focusPeriods?.malam ? styles.focusPeriodCardSelected : ''}`}
                onClick={() => handleFocusPeriodToggle('malam')}
              >
                <img src={halfMoonIcon} alt="Malam" className={styles.focusPeriodIcon} />
                <div className={styles.focusPeriodText}>
                  <span className={styles.checkboxText}>Malam</span>
                  <span className={styles.timeText}>(18:00 - 22:00)</span>
                </div>
                {formData.focusPeriods?.malam && (
                  <img src={checkCircleIcon} alt="Selected" className={styles.checkIcon} />
                )}
              </div>
            </div>
            {errors.focusPeriods && <span className={styles.errorText}>{errors.focusPeriods}</span>}
          </div>
        );

      case 2:
        return (
          <div className={styles.section}>
            {/* Prioritas Aktivitas Header */}
            <div className={styles.sleepPeriodHeader}>
              <h3 className={styles.sleepPeriodTitle}>Prioritas Aktivitas</h3>
            </div>
            
            <div className={styles.categoriesGrid}>
              {categories.map((category) => (
                <div 
                  key={category.name}
                  className={`${styles.categoryCard} ${formData.preferredCategories.includes(category.name) ? styles.categoryCardSelected : ''}`}
                  onClick={() => handleCategoryToggle(category.name)}
                >
                  <img src={category.iconPath} alt={category.label} className={styles.categoryIcon} />
                  <div className={styles.categoryText}>
                    <span className={styles.checkboxText}>{category.label}</span>
                  </div>
                  {formData.preferredCategories.includes(category.name) && (
                    <img src={checkCircleIcon} alt="Selected" className={styles.checkIcon} />
                  )}
                </div>
              ))}
            </div>
            {errors.categories && <span className={styles.errorText}>{errors.categories}</span>}
          </div>
        );

      case 3:
        return (
          <div className={styles.section}>
            {/* Target Frekuensi Aktivitas Header */}
            <div className={styles.sleepPeriodHeader}>
              <h3 className={styles.sleepPeriodTitle}>Target Frekuensi Aktivitas</h3>
            </div>
            
            <div className={styles.categoriesGrid}>
              {frequencyOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`${styles.categoryCard} ${formData.targetFrequency === option.value ? styles.categoryCardSelected : ''}`}
                  onClick={() => handleFrequencyToggle(option.value)}
                >
                  <div className={styles.frequencyText}>
                    <span className={styles.checkboxText}>{option.label}</span>
                    <span className={styles.frequencyDescription}>{option.description}</span>
                  </div>
                  {formData.targetFrequency === option.value && (
                    <img src={checkCircleIcon} alt="Selected" className={styles.checkIcon} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className={styles.closeButton}
        >
          ×
        </button>

        {/* Progress Indicator */}
        <div className={styles.progressContainer}>
          <h2 className={styles.progressTitle}>
            Pertanyaan {currentStep + 1} dari {steps.length}
          </h2>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mascot and Question */}
        <div className={styles.mascotSection}>
          <img 
            src={aturinMascot} 
            alt="Aturin Mascot" 
            className={styles.mascotIcon}
          />
          <div className={styles.chatBubble}>
            <p className={styles.questionText}>
              {steps[currentStep].question}
            </p>
            {/* Maximum selection info for cases 1 and 2 */}
            {(currentStep === 1 || currentStep === 2) && (
              <p className={styles.maxSelectionText}>
                {currentStep === 1 ? 'Pilih maksimal 2 jawaban' : 'Pilih maksimal 4 jawaban'}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step Content with animation */}
          <div className={styles.stepContainer}>
            {renderStepContent()}
          </div>
        </form>

        {/* Buttons - Fixed at bottom */}
        <div className={styles.buttons}>
          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={handlePrevious} 
              className={styles.cancelButton}
            >
              <img src={arrowLeftIcon} alt="Arrow Left" className={styles.buttonIcon} />
              Kembali
            </button>
          )}
          <button 
            type="button"
            onClick={handleNext}
            className={styles.saveButton}
          >
            {currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}
            {currentStep < steps.length - 1 && (
              <img src={arrowRightIcon} alt="Arrow Right" className={styles.buttonIcon} />
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserPreference;
