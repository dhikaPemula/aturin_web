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
		return date1.getFullYear() === date2.getFullYear() &&
			   date1.getMonth() === date2.getMonth() &&
			   date1.getDate() === date2.getDate();
	};

	// Utility function to parse deadline date
	const parseDeadlineDate = (deadline) => {
		if (!deadline) return null;
		
		if (deadline instanceof Date) {
			return deadline;
		}
		
		if (typeof deadline === 'string') {
			// Handle DD/MM/YYYY format
			if (deadline.includes('/')) {
				const parts = deadline.trim().split('/');
				if (parts.length === 3) {
					const day = parseInt(parts[0], 10);
					const month = parseInt(parts[1], 10) - 1;
					const year = parseInt(parts[2], 10);
					
					if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
						return new Date(year, month, day);
					}
				}
			}
			
			// Handle YYYY-MM-DD format
			if (deadline.includes('-')) {
				const dateOnly = deadline.split('T')[0];
				const parts = dateOnly.split('-');
				if (parts.length === 3) {
					const year = parseInt(parts[0], 10);
					const month = parseInt(parts[1], 10) - 1;
					const day = parseInt(parts[2], 10);
					
					if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
						return new Date(year, month, day);
					}
				}
			}
			
			// Fallback
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

		// Count completed tasks
		const completed = tasksForDate.filter(task => task.task_status === 'selesai').length;
		
		// Calculate late tasks (deadline < today AND not completed)
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set to start of today for accurate comparison
		
		const lateTasks = tasksForDate.filter(task => {
			if (task.task_status === 'selesai') return false;
			
			const taskDate = parseDeadlineDate(task.task_deadline);
			if (!taskDate) return false;
			
			const taskDateCopy = new Date(taskDate);
			taskDateCopy.setHours(0, 0, 0, 0); // Set to start of day for comparison
			return taskDateCopy < today;
		});
		
		const late = lateTasks.length;
		
		// Calculate uncompleted tasks (not completed AND not late)
		// This includes tasks with deadline today or in the future, and tasks without deadline
		const uncompleted = tasksForDate.filter(task => {
			if (task.task_status === 'selesai') return false;
			
			const taskDate = parseDeadlineDate(task.task_deadline);
			if (!taskDate) return true; // Tasks without deadline are considered uncompleted but not late
			
			const taskDateCopy = new Date(taskDate);
			taskDateCopy.setHours(0, 0, 0, 0);
			
			// Only count as uncompleted if not late (deadline is today or in the future)
			return taskDateCopy >= today;
		}).length;

		const result = {
			total: tasksForDate.length,
			completed,
			uncompleted,
			late
		};

		console.log(`TaskCount for ${selectedDate.toLocaleDateString('id-ID')}:`, result);
		console.log(`Tasks breakdown:`, {
			completed: tasksForDate.filter(task => task.task_status === 'selesai').map(t => t.task_title),
			uncompleted: tasksForDate.filter(task => {
				if (task.task_status === 'selesai') return false;
				const taskDate = parseDeadlineDate(task.task_deadline);
				if (!taskDate) return true;
				const taskDateCopy = new Date(taskDate);
				taskDateCopy.setHours(0, 0, 0, 0);
				return taskDateCopy >= today;
			}).map(t => t.task_title),
			late: lateTasks.map(t => t.task_title)
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