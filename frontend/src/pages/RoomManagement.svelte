<script>
  import { onMount } from "svelte";
  import { api } from "../lib/api";
  import { dialog } from "../stores/dialogStore";
  import Modal from "../components/Modal.svelte";

  let rooms = [];
  let loading = true;
  let isModalOpen = false;
  let isSubmitting = false;
  
  let formData = {
    name: '',
    location: '',
    capacity: '',
    description: '',
    open_time: '08:00',
    close_time: '17:00'
  };

  async function loadRooms() {
    loading = true;
    try {
      const res = await api.get('/rooms');
      if (res.success) {
        rooms = res.data;
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  onMount(loadRooms);

  function resetForm() {
    formData = {
      name: '',
      location: '',
      capacity: '',
      description: '',
      open_time: '08:00',
      close_time: '17:00'
    };
  }

  function openAddModal() {
    resetForm();
    isModalOpen = true;
  }

  async function handleSubmit() {
    isSubmitting = true;
    try {
      const payload = { ...formData, capacity: parseInt(formData.capacity) };
      const res = await api.post('/rooms', payload);
      
      if (res.success) {
        isModalOpen = false;
        loadRooms();
      } else {
        await dialog.alert(res.message || "Sistem gagal menambahkan ruangan");
      }
    } catch (err) {
      await dialog.alert("Terjadi kegagalan komunikasi dengan server.");
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id) {
    if (await dialog.confirm("Konfirmasi penghapusan permanen data ruangan ini? Tindakan ini tidak dapat diubah.")) {
      try {
        const res = await api.delete(`/rooms/${id}`);
        if (res.success) {
          loadRooms();
        } else {
          await dialog.alert(res.message || "Gagal menghapus ruangan");
        }
      } catch (err) {
        await dialog.alert("Terjadi kegagalan komunikasi dengan server.");
      }
    }
  }
</script>

<div class="page-enter">
  <header class="page-header flex-header">
    <div class="header-content">
      <h2>Kelola Ruangan</h2>
      <p>Tambah, edit, dan atur ketersediaan ruangan.</p>
    </div>
    <button class="btn btn-primary btn-compact" on:click={openAddModal}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      Tambah Ruangan
    </button>
  </header>

  <div class="card p-0 overflow-hidden">
    {#if loading}
      <div class="state-container">
        <div class="spinner"></div>
        <p>Memuat data ruangan...</p>
      </div>
    {:else if rooms.length === 0}
      <div class="state-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
        <p>Belum ada ruangan terdaftar. Tambahkan ruangan pertama Anda.</p>
      </div>
    {:else}
      <div class="table-responsive" style="border: none; border-radius: 0;">
        <table>
          <thead>
            <tr>
              <th width="10%">Reg ID</th>
              <th width="25%">Identitas Ruang</th>
              <th width="20%">Area Lokasi</th>
              <th width="15%">Kapasitas</th>
              <th width="20%">Operasional</th>
              <th width="10%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each rooms as room}
              <tr>
                <td class="font-mono text-muted">#{room.id.toString().padStart(3, '0')}</td>
                <td><strong style="color: var(--text-h); font-family: 'Plus Jakarta Sans', sans-serif;">{room.name}</strong></td>
                <td>{room.location}</td>
                <td>{room.capacity} Org</td>
                <td class="font-mono text-sm">{room.openTime.substring(0,5)} &mdash; {room.closeTime.substring(0,5)}</td>
                <td>
                  <button class="btn btn-danger text-sm" on:click={() => handleDelete(room.id)}>Hapus</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<Modal title="Tambah Ruangan Baru" isOpen={isModalOpen} on:close={() => (isModalOpen = false)}>
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group form-group-compact">
      <label for="name">Nama Ruangan</label>
      <input type="text" id="name" bind:value={formData.name} required placeholder="Mis. Meeting Room A" />
    </div>
    
    <div class="compact-grid">
      <div class="form-group form-group-compact">
        <label for="location">Lokasi</label>
        <input type="text" id="location" bind:value={formData.location} required placeholder="Gedung Utama Lt. 2" />
      </div>
      <div class="form-group form-group-compact">
        <label for="capacity">Kapasitas (Orang)</label>
        <input type="number" id="capacity" bind:value={formData.capacity} required min="1" placeholder="10" />
      </div>
    </div>
    
    <div class="compact-grid">
      <div class="form-group form-group-compact">
        <label for="open_time">Jam Buka</label>
        <input type="time" id="open_time" bind:value={formData.open_time} required />
      </div>
      <div class="form-group form-group-compact">
        <label for="close_time">Jam Tutup</label>
        <input type="time" id="close_time" bind:value={formData.close_time} required />
      </div>
    </div>
    
    <div class="form-group form-group-compact" style="margin-bottom: 0;">
      <label for="description">Fasilitas & Deskripsi</label>
      <textarea id="description" rows="2" bind:value={formData.description} placeholder="Proyektor, Whiteboard, AC..."></textarea>
    </div>
    
    <div class="flex justify-between mt-4">
      <button type="button" class="btn btn-outline" on:click={() => (isModalOpen = false)}>Batal</button>
      <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : 'Simpan Ruangan'}
      </button>
    </div>
  </form>
</Modal>

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

  .flex-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .btn-compact {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .compact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group-compact {
    margin-bottom: 0.875rem;
  }

  .mt-4 { margin-top: 1.5rem; }

  @media (max-width: 768px) {
    .flex-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .p-0 { padding: 0; }
  .overflow-hidden { overflow: hidden; }

  .state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    color: var(--text-muted);
    gap: 1rem;
    text-align: center;
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

  .font-mono {
    font-family: monospace;
    letter-spacing: 0.05em;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
