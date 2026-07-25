<script>
  import { onMount } from "svelte";
  import { api } from "../lib/api";
  import { dialog } from "../stores/dialogStore";
  import RoomCard from "../components/RoomCard.svelte";
  import Modal from "../components/Modal.svelte";
  import ReservationForm from "../components/ReservationForm.svelte";

  let rooms = [];
  let loading = true;
  let error = "";
  
  let isModalOpen = false;
  let selectedRoom = null;
  let isSubmitting = false;
  let submitError = "";

  onMount(async () => {
    try {
      const res = await api.get('/rooms');
      if (res.success) {
        rooms = res.data;
      }
    } catch (err) {
      error = "Gagal memuat katalog ruangan dari server.";
    } finally {
      loading = false;
    }
  });

  function openBookModal(room) {
    selectedRoom = room;
    submitError = "";
    isModalOpen = true;
  }

  async function handleReservationSubmit(event) {
    isSubmitting = true;
    submitError = "";
    try {
      const payload = event.detail;
      const res = await api.post('/reservations', payload);
      
      if (res.success) {
        await dialog.alert("Reservasi berhasil diajukan ke sistem!");
        isModalOpen = false;
      } else {
        submitError = res.message || "Gagal mengajukan reservasi.";
      }
    } catch (err) {
      submitError = "Terjadi kegagalan komunikasi dengan server.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="page-enter">
  <header class="page-header">
    <div class="header-content">
      <h2>Katalog Ruangan</h2>
      <p>Pilih ruangan yang sesuai untuk rapat atau acara Anda.</p>
    </div>
  </header>

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Memuat katalog...</p>
    </div>
  {:else if error}
    <div class="alert alert-danger">{error}</div>
  {:else if rooms.length === 0}
    <div class="empty-state card">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
      <p>Katalog ruangan kosong. Silakan hubungi Administrator.</p>
    </div>
  {:else}
    <div class="grid grid-cols-3">
      {#each rooms as room}
        <RoomCard {room} onBook={openBookModal} />
      {/each}
    </div>
  {/if}
</div>

<Modal title="Pesan Ruangan" isOpen={isModalOpen} on:close={() => (isModalOpen = false)}>
  {#if selectedRoom}
    <ReservationForm 
      room={selectedRoom} 
      loading={isSubmitting}
      error={submitError}
      on:submit={handleReservationSubmit}
      on:cancel={() => (isModalOpen = false)} 
    />
  {/if}
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

  .loading-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    color: var(--text-muted);
    gap: 1rem;
    text-align: center;
  }
  
  .empty-state.card {
    padding: 4rem;
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

  .alert-danger {
    padding: 1rem;
    background-color: var(--danger-bg);
    color: var(--danger-hover);
    border: 1px solid rgba(225, 29, 72, 0.2);
    border-radius: var(--radius-sm);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
