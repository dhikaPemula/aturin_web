# Global Data Refresh System

Sistem refresh global telah diimplementasikan untuk memastikan bahwa perubahan data (tambah/edit tugas) akan langsung ter-update di semua halaman tanpa perlu reload manual.

## Komponen Utama

### 1. DataRefreshContext (`src/core/context/DataRefreshContext.jsx`)
- **Provider** global yang mengelola state refresh trigger
- Menyediakan trigger untuk berbagai jenis data (task, activity, alarm)
- Dapat digunakan untuk trigger refresh spesifik atau semua data sekaligus

### 2. useGlobalTaskRefresh Hook (`src/core/hooks/useGlobalTaskRefresh.js`)
- Hook untuk mengakses dan menggunakan global task refresh
- Menyediakan `triggerTaskRefresh()` untuk memicu refresh
- Menyediakan `taskRefreshTrigger` untuk subscribe ke perubahan

### 3. useTaskAutoRefresh Hook (`src/core/hooks/useGlobalTaskRefresh.js`)
- Hook untuk auto-refresh data ketika global trigger berubah
- Komponen yang menggunakan hook ini akan otomatis fetch ulang data
- Mengelola loading state dan error handling

## Cara Kerja

1. **Setup Provider**: `DataRefreshProvider` di-wrap di level App (main.jsx)
2. **Trigger Refresh**: Ketika data berubah (tambah/edit), `triggerTaskRefresh()` dipanggil
3. **Auto Update**: Semua komponen yang menggunakan `useTaskAutoRefresh` akan otomatis fetch data baru
4. **Real-time Sync**: Semua halaman yang menampilkan data task akan ter-update secara real-time

## Implementasi di Komponen

### Form Component (AddEditForm)
```jsx
import { useGlobalTaskRefresh } from '../../../core/hooks/useGlobalTaskRefresh';

function AddEditForm() {
  const { triggerTaskRefresh } = useGlobalTaskRefresh();
  
  const handleSubmit = async () => {
    await onSave(taskData);
    triggerTaskRefresh(); // Trigger global refresh
  };
}
```

### List Component
```jsx
import { useTaskAutoRefresh } from '../../../core/hooks/useGlobalTaskRefresh';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };
  
  // Auto-refresh ketika global trigger berubah
  useTaskAutoRefresh(fetchTasks);
}
```

## Halaman yang Sudah Terintegrasi

### ✅ Sudah Terintegrasi dengan Global Refresh:
1. **Home Page** (`src/features/home_page/`)
   - List component
   - TaskCount component
   - Tetap mempertahankan backward compatibility dengan refreshTrigger prop

2. **Task Page** (`src/features/task_page/`)
   - Main task page
   - Menggunakan useTaskList hook yang sudah di-update

3. **AddEditForm** (`src/features/crudtask/`)
   - Form tambah/edit tugas
   - Trigger global refresh setelah save berhasil

4. **Test Global Refresh Page** (`src/features/test/`)
   - Halaman demo untuk testing global refresh
   - Menampilkan real-time update dan statistik

5. **Dashboard Page** (`src/features/dashboard/`)
   - Halaman dashboard dengan statistik real-time
   - Auto-refresh task statistics

## Testing Global Refresh

Untuk menguji sistem global refresh:

1. Buka multiple tabs/windows dengan halaman berbeda
2. Tambah atau edit task dari halaman manapun
3. Lihat bagaimana semua halaman lain otomatis ter-update
4. Gunakan "Test Global Refresh Page" untuk monitoring real-time

## Backward Compatibility

Sistem ini tetap mempertahankan backward compatibility:
- Props `refreshTrigger` di komponen lama masih berfungsi
- Callback `onDataChanged` masih dipanggil untuk komponen yang belum migrasi
- Tidak ada breaking changes pada API yang sudah ada

## Future Enhancements

1. **Activity & Alarm Refresh**: Implementasi global refresh untuk data activity dan alarm
2. **Selective Refresh**: Refresh hanya komponen tertentu berdasarkan jenis perubahan
3. **Optimistic Updates**: Update UI segera sebelum API call selesai
4. **WebSocket Integration**: Real-time updates menggunakan WebSocket untuk multiple users

## Troubleshooting

### Jika komponen tidak auto-refresh:
1. Pastikan komponen menggunakan `useTaskAutoRefresh(fetchFunction)`
2. Pastikan `fetchFunction` di-pass dengan benar ke hook
3. Check console log untuk error di fetch function
4. Pastikan komponen berada di dalam `DataRefreshProvider`

### Performance Optimization:
- Hook `useTaskAutoRefresh` sudah di-optimize untuk menghindari multiple fetch calls
- Loading state di-manage secara individual per komponen
- Error handling di-isolasi per komponen untuk menghindari crash global

## Migration Guide

Untuk migrate komponen lama ke sistem global refresh:

```jsx
// Before (manual refresh)
const [refreshTrigger, setRefreshTrigger] = useState(0);
useEffect(() => {
  fetchData();
}, [refreshTrigger]);

// After (global refresh)
import { useTaskAutoRefresh } from '../path/to/hook';
useTaskAutoRefresh(fetchData);
```
