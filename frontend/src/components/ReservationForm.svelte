<script>
  import { createEventDispatcher } from 'svelte';
  
  export let room;
  export let loading = false;
  export let error = "";
  
  const dispatch = createEventDispatcher();

  let formData = {
    date: '',
    start_time: '',
    end_time: '',
    purpose: ''
  };

  function handleSubmit() {
    error = "";
    if (formData.start_time >= formData.end_time) {
      error = "Jam selesai harus lebih lambat dari jam mulai.";
      return;
    }
    dispatch('submit', {
      room_id: room.id,
      ...formData
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  {#if error}
    <div class="alert-danger" style="margin-bottom: 1.5rem;">{error}</div>
  {/if}
  <div class="form-info">
    <p>Memesan ruangan: <strong>{room?.name}</strong></p>
  </div>

  <div class="form-group form-group-compact">
    <label for="date">Tanggal</label>
    <input type="date" id="date" bind:value={formData.date} required />
  </div>

  <div class="time-grid">
    <div class="form-group form-group-compact">
      <label for="start_time">Jam Mulai</label>
      <input type="time" id="start_time" bind:value={formData.start_time} required />
    </div>
    <div class="form-group form-group-compact">
      <label for="end_time">Jam Selesai</label>
      <input type="time" id="end_time" bind:value={formData.end_time} required />
    </div>
  </div>

  <div class="form-group form-group-compact" style="margin-bottom: 0;">
    <label for="purpose">Tujuan Pemesanan</label>
    <textarea id="purpose" rows="2" bind:value={formData.purpose} required placeholder="Mis: Rapat mingguan divisi IT..."></textarea>
  </div>

  <div class="form-actions">
    <button type="button" class="btn btn-outline" on:click={() => dispatch('cancel')}>Batal</button>
    <button type="submit" class="btn btn-primary" disabled={loading}>
      {loading ? 'Memproses...' : 'Konfirmasi Pesanan'}
    </button>
  </div>
</form>

<style>
  .form-info {
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: var(--bg-subtle);
    border-radius: var(--radius-md);
  }
  
  .form-info p {
    margin: 0;
    font-size: 0.9375rem;
  }

  .form-group-compact {
    margin-bottom: 1rem;
  }

  .time-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .alert-danger {
    padding: 1rem;
    background-color: var(--danger-bg);
    color: var(--danger-hover);
    border: 1px solid rgba(225, 29, 72, 0.2);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .form-actions {
      flex-direction: column-reverse;
      gap: 0.75rem;
    }
    .form-actions button {
      width: 100%;
    }
  }
</style>
