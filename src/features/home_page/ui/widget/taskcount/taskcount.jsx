import styles from './taskcount.module.css';
import { useState, useEffect, useMemo } from 'react';
import { getAllTasks } from '../../../../../core/services/api/task_api_service';
// Import SVG as image path
import countIcon from '../../../../../assets/home/count.svg';
import checkCircleIcon from '../../../../../assets/home/check-circle.svg';
import clockIcon from '../../../../../assets/home/clock.svg';
import warningCircleIcon from '../../../../../assets/home/warning-circle.svg';

function TaskCount({ selectedDate }) {
	const [allTasks, setAllTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch all tasks
	useEffect(() => {
		const fetchAllTasks = async () => {
			try {
				setLoading(true);
				setError(null);
				const tasks = await getAllTasks();
				setAllTasks(tasks);
			} catch (error) {
				setError('Gagal mengambil data tugas');
				console.error('Error fetching tasks for TaskCount:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAllTasks();
	}, []);

	// Utility function to check if two dates are the same day
	const isSameDate = (date1, date2) => {
		if (!date1 || !date2) return false;
		
		// Pastikan kedua tanggal dalam timezone yang sama (WIB)
		const d1 = new Date(date1.getTime());
		const d2 = new Date(date2.getTime());
		
		return d1.getFullYear() === d2.getFullYear() &&
			   d1.getMonth() === d2.getMonth() &&
			   d1.getDate() === d2.getDate();
	};

	// Utility function to parse deadline date dengan timezone handling
	const parseDeadlineDate = (deadline) => {
		if (!deadline) return null;
		
		if (deadline instanceof Date) {
			return deadline;
		}
		
		if (typeof deadline === 'string') {
			// Handle DD/MM/YYYY format (Indonesian format)
			if (deadline.includes('/')) {
				const parts = deadline.trim().split('/');
				if (parts.length === 3) {
					const day = parseInt(parts[0], 10);
					const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
					const year = parseInt(parts[2], 10);
					
					if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
						// Buat date dengan timezone lokal (Indonesia) - jam 00:00:00
						return new Date(year, month, day, 0, 0, 0, 0);
					}
				}
			}
			
			// Handle YYYY-MM-DD format dengan ISO string parsing (lebih akurat)
			if (deadline.includes('-')) {
				// Gunakan Date constructor untuk ISO strings, sudah handle timezone dengan benar
				const parsed = new Date(deadline);
				if (!isNaN(parsed.getTime())) {
					return parsed;
				}
				
				// Fallback manual parsing jika Date constructor gagal
				const parts = deadline.split('T'); // Split date and time
				const datePart = parts[0]; // YYYY-MM-DD
				const timePart = parts[1]; // HH:MM:SS atau undefined
				
				const dateComponents = datePart.split('-');
				if (dateComponents.length === 3) {
					const year = parseInt(dateComponents[0], 10);
					const month = parseInt(dateComponents[1], 10) - 1; // Month is 0-indexed
					const day = parseInt(dateComponents[2], 10);

					if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
						if (timePart) {
							// Jika ada time component, parse jam:menit:detik
							const timeComponents = timePart.replace('Z', '').split(':');
							const hour = parseInt(timeComponents[0], 10) || 0;
							const minute = parseInt(timeComponents[1], 10) || 0;
							const second = parseInt(timeComponents[2], 10) || 0;
							
							if (deadline.endsWith('Z')) {
								// UTC time - buat date dalam UTC kemudian konversi otomatis ke local timezone
								return new Date(Date.UTC(year, month, day, hour, minute, second));
							} else {
								// Local time
								return new Date(year, month, day, hour, minute, second);
							}
						} else {
							// Tanpa time component, gunakan jam 00:00:00 local time
							return new Date(year, month, day, 0, 0, 0, 0);
						}
					}
				}
			}
			
			// Try parsing as ISO string
			const parsed = new Date(deadline);
			if (!isNaN(parsed.getTime())) {
				return parsed;
			}
		}
		
		return null;
	};

	// Calculate task counts for the selected date
	const taskCounts = useMemo(() => {
		if (loading || !selectedDate) {
			return { total: 0, completed: 0, uncompleted: 0, late: 0 };
		}

		// Filter tasks for the selected date
		const tasksForDate = allTasks.filter(task => {
			const taskDate = parseDeadlineDate(task.task_deadline);
			return taskDate && isSameDate(taskDate, selectedDate);
		});

		// Count berdasarkan task_status dari API
		const completed = tasksForDate.filter(task => task.task_status === 'selesai').length;
		const uncompleted = tasksForDate.filter(task => task.task_status === 'belum_selesai').length;
		const late = tasksForDate.filter(task => task.task_status === 'terlambat').length;

		const result = {
			total: tasksForDate.length,
			completed,
			uncompleted,
			late
		};

		console.log(`TaskCount for ${selectedDate.toLocaleDateString('id-ID')}:`, result);
		console.log(`Tasks breakdown by status:`, {
			selesai: tasksForDate.filter(task => task.task_status === 'selesai').map(t => ({ title: t.task_title, status: t.task_status })),
			belum_selesai: tasksForDate.filter(task => task.task_status === 'belum_selesai').map(t => ({ title: t.task_title, status: t.task_status })),
			terlambat: tasksForDate.filter(task => task.task_status === 'terlambat').map(t => ({ title: t.task_title, status: t.task_status }))
		});

		return result;
	}, [allTasks, selectedDate, loading]);

	// Format date label for display
	const getDateLabel = (date) => {
		if (!date) return 'Hari Ini';
		
		const today = new Date();
		const isToday = isSameDate(date, today);
		
		if (isToday) {
			return 'Hari Ini';
		}
		
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		const isTomorrow = isSameDate(date, tomorrow);
		
		if (isTomorrow) {
			return 'Besok';
		}
		
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		const isYesterday = isSameDate(date, yesterday);
		
		if (isYesterday) {
			return 'Kemarin';
		}
		
		return date.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short'
		});
	};

	const dateLabel = getDateLabel(selectedDate);

	const cardData = [
		{
			label: `Total Tugas`,
			count: taskCounts.total,
			icon: countIcon,
			color: styles.cardBlue,
			countClass: styles.countPrimary,
		},
		{
			label: `Selesai`,
			count: taskCounts.completed,
			icon: checkCircleIcon,
			color: styles.cardGreen,
			countClass: styles.countSuccess,
		},
		{
			label: `Belum Dikerjakan`,
			count: taskCounts.uncompleted,
			icon: clockIcon,
			color: styles.cardOrange,
			countClass: styles.countWarning,
		},
		{
			label: `Terlambat`,
			count: taskCounts.late,
			icon: warningCircleIcon,
			color: styles.cardRed,
			countClass: styles.countDanger,
		},
	];

	if (loading) {
		return (
			<div className={styles.taskCountContainer}>
				{[1, 2, 3, 4].map((idx) => (
					<div key={idx} className={`${styles.card} ${styles.cardGray}`}>
						<div className={styles.label}>Loading...</div>
						<div className={`${styles.count}`}>...</div>
						<div className={styles.iconWrapper}>
							<div className={styles.iconSkeleton}></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.taskCountContainer}>
				<div className={`${styles.card} ${styles.cardGray}`}>
					<div className={styles.label}>Error</div>
					<div className={styles.count}>Gagal memuat data</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.taskCountContainer}>
			{cardData.map((card, idx) => (
				<div key={idx} className={`${styles.card} ${card.color}`}>
					<div className={styles.label}>{card.label}</div>
					<div className={`${styles.count} ${card.countClass || ''}`}>{card.count}</div>
					<div className={styles.iconWrapper}>
						<img src={card.icon} alt={card.label} className={styles.icon} />
					</div>
				</div>
			))}
		</div>
	);
}

export default TaskCount;