<script>
  import { onMount } from "svelte";
  import { api } from "../lib/api";
  import { dialog } from "../stores/dialogStore";

  let message = "";
  let isSubmitting = false;
  
  let broadcasts = [];
  let isLoadingHistory = true;
  
  let editingId = null;
  
  async function loadBroadcasts() {
    try {
      const res = await api.get('/notifications/broadcast');
      if (res.success) {
        broadcasts = res.data;
      }
    } catch (err) {
      console.error(err);
    } finally {
      isLoadingHistory = false;
    }
  }
  
  onMount(loadBroadcasts);

  async function handleBroadcast() {
    if (!message.trim()) {
      await dialog.alert("Pesan tidak boleh kosong!");
      return;
    }

    const actionText = editingId ? "Perbarui pesan siaran ini?" : "Kirim pesan ini ke semua pengguna biasa?";
    
    if (await dialog.confirm(actionText)) {
      isSubmitting = true;
      try {
        let res;
        if (editingId) {
          res = await api.put(`/notifications/broadcast/${editingId}`, { message: message.trim() });
        } else {
          res = await api.post('/notifications/broadcast', { message: message.trim() });
        }
        
        if (res.success) {
          await dialog.alert(editingId ? "Pesan berhasil diperbarui!" : "Pesan berhasil disiarkan!");
          message = "";
          editingId = null;
          loadBroadcasts();
        } else {
          await dialog.alert(res.message || "Gagal memproses pesan.");
        }
      } catch (error) {
        await dialog.alert("Terjadi kegagalan komunikasi dengan server.");
      } finally {
        isSubmitting = false;
      }
    }
  }
  
  function handleEdit(b) {
    editingId = b.id;
    message = b.message;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function cancelEdit() {
    editingId = null;
    message = "";
  }
  
  async function handleDelete(id) {
    if (await dialog.confirm("Konfirmasi penghapusan pesan ini? Pesan ini akan ditarik dari lonceng semua pengguna secara permanen.")) {
      try {
        const res = await api.delete(`/notifications/broadcast/${id}`);
        if (res.success) {
          loadBroadcasts();
        } else {
          await dialog.alert(res.message || "Gagal menghapus pesan siaran.");
        }
      } catch (err) {
        await dialog.alert("Terjadi kegagalan komunikasi dengan server.");
      }
    }
  }
</script>

<div class="page-enter">
  <header class="page-header">
    <div class="header-content">
      <h2>Pusat Siaran</h2>
      <p>Kirim pengumuman penting ke semua pengguna.</p>
    </div>
  </header>

  <div class="card broadcast-card">
    <div class="card-header">
      <h3>{editingId ? 'Edit Pesan Siaran' : 'Buat Siaran Baru'}</h3>
    </div>
    <div class="card-body">
      <div class="form-group">
        <label for="message">Isi Pesan</label>
        <textarea 
          id="message" 
          rows="4" 
          bind:value={message} 
          placeholder="Tulis pesan pengumuman di sini..." 
          disabled={isSubmitting}
        ></textarea>
        <p class="help-text">Pesan akan dikirim seketika ke lonceng notifikasi semua pengguna.</p>
      </div>

      <div class="actions">
        {#if editingId}
          <button class="btn btn-outline" on:click={cancelEdit} disabled={isSubmitting}>Batal Edit</button>
        {/if}
        <button class="btn btn-primary" on:click={handleBroadcast} disabled={isSubmitting || !message.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          {isSubmitting ? 'Memproses...' : (editingId ? 'Simpan Perubahan' : 'Kirim Siaran')}
        </button>
      </div>
    </div>
  </div>

  <div class="history-section">
    <h3>Riwayat Siaran</h3>
    
    {#if isLoadingHistory}
      <div class="empty-state">
        <div class="spinner"></div>
        <p>Memuat riwayat siaran...</p>
      </div>
    {:else if broadcasts.length === 0}
      <div class="empty-state card">
        <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <p>Belum ada pesan yang disiarkan.</p>
      </div>
    {:else}
      <div class="grid grid-cols-2">
        {#each broadcasts as b}
          <div class="broadcast-item card">
            <div class="b-content">
              <p>{b.message}</p>
              <span class="date">{new Date(b.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="b-actions">
              <button class="btn btn-icon text-primary" on:click={() => handleEdit(b)} title="Edit Pesan">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
              </button>
              <button class="btn btn-icon text-danger" on:click={() => handleDelete(b.id)} title="Tarik Pesan">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .page-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .page-header h2 {
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
  
  .page-header p {
    color: var(--text-muted);
  }

  .broadcast-card {
    margin-bottom: 3rem;
    padding: 0;
    overflow: hidden;
  }

  .card-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-subtle);
  }

  .card-body {
    padding: 2rem;
  }

  .card-header h3 {
    margin: 0;
    font-size: 1.125rem;
    color: var(--text-h);
  }

  .help-text {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    gap: 0.75rem;
  }

  .btn {
    display: flex;
    align-items: center;
  }

  .history-section h3 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    color: var(--text-h);
  }

  .broadcast-item {
    padding: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    transition: transform var(--transition-fast);
  }
  
  .broadcast-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .b-content {
    flex: 1;
  }

  .b-content p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9375rem;
    color: var(--text-body);
    line-height: 1.5;
  }

  .date {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .b-actions {
    display: flex;
    gap: 0.25rem;
  }

  .btn-icon {
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: all 0.2s;
  }

  .btn-icon:hover {
    background: var(--bg-subtle);
  }

  .btn-icon.text-primary:hover {
    color: var(--primary);
    background: var(--primary-light);
  }

  .btn-icon.text-danger:hover {
    color: var(--danger);
    background: var(--danger-bg);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    color: var(--text-muted);
    gap: 1rem;
    text-align: center;
  }
  
  .empty-state.card {
    background: transparent;
    border: 1px dashed var(--border-focus);
  }

  .empty-icon {
    color: var(--border-focus);
    opacity: 0.5;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
