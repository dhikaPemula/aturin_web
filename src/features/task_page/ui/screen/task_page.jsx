import useTaskList from "../../../../core/hooks/useTaskList.js";

function TaskPage() {
  const { tasks, loading, error, toggleTaskStatus } = useTaskList();

  const handleToggleStatus = async (slug) => {
    const result = await toggleTaskStatus(slug);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <>
        <div style={{ padding: '20px' }}>
          <h1>Halaman Tugas</h1>
          <p>Memuat data tugas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div style={{ padding: '20px' }}>
          <h1>Halaman Tugas</h1>
          <p style={{ color: 'red' }}>Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h1>Halaman Tugas</h1>
        <p>Daftar semua tugas Anda ({tasks.length} tugas)</p>
        
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Belum ada tugas yang dibuat
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {tasks.map((task) => (
              <div 
                key={task.slug}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: task.task_status === 'selesai' ? '#f0f9f0' : '#fff',
                  opacity: task.task_status === 'selesai' ? 0.8 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0',
                      textDecoration: task.task_status === 'selesai' ? 'line-through' : 'none',
                      color: task.task_status === 'selesai' ? '#666' : '#333'
                    }}>
                      {task.task_title}
                    </h3>
                    {task.task_description && (
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                        {task.task_description}
                      </p>
                    )}
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      <span>Kategori: {task.task_category}</span>
                      {task.task_deadline && (
                        <span style={{ marginLeft: '16px' }}>
                          Deadline: {new Date(task.task_deadline).toLocaleDateString('id-ID')}
                        </span>
                      )}
                      {task.estimated_task_duration && (
                        <span style={{ marginLeft: '16px' }}>
                          Durasi: {task.estimated_task_duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ marginLeft: '16px' }}>
                    <button
                      onClick={() => handleToggleStatus(task.slug)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: task.task_status === 'selesai' ? '#dc3545' : '#28a745',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    >
                      {task.task_status === 'selesai' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
export default TaskPage;