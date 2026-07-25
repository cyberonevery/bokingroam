<script>
  import { onMount } from "svelte";
  import { api } from "../lib/api";
  import { dialog } from "../stores/dialogStore";
  import StatusBadge from "../components/StatusBadge.svelte";

  let reservations = [];
  let loading = true;
  let error = "";

  async function loadReservations() {
    loading = true;
    try {
      const res = await api.get('/reservations/me');
      if (res.success) {
        reservations = res.data;
      }
    } catch (err) {
      error = "Gagal memuat log riwayat reservasi.";
    } finally {
      loading = false;
    }
  }

  onMount(loadReservations);

  async function handleCancel(id) {
    if (await dialog.confirm("Konfirmasi pembatalan reservasi ini? Tindakan ini tidak dapat diubah.")) {
      try {
        const res = await api.patch(`/reservations/${id}/cancel`);
        if (res.success) {
          loadReservations();
        } else {
          await dialog.alert(res.message || "Sistem gagal membatalkan reservasi.");
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
      <h2>Riwayat Reservasi</h2>
      <p>Pantau status pesanan ruangan Anda di sini.</p>
    </div>
  </header>

  {#if error}
    <div class="alert alert-danger mb-4">{error}</div>
  {/if}

  <div class="card p-0 overflow-hidden">
    {#if loading}
      <div class="state-container">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>
    {:else if reservations.length === 0}
      <div class="state-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <p>Anda belum membuat pesanan ruangan apa pun.</p>
      </div>
    {:else}
      <div class="table-responsive" style="border: none; border-radius: 0;">
        <table>
          <thead>
            <tr>
              <th width="10%">ID</th>
              <th width="20%">Jadwal Pelaksanaan</th>
              <th width="30%">Keperluan Penggunaan</th>
              <th width="20%">Status</th>
              <th width="20%">Kontrol</th>
            </tr>
          </thead>
          <tbody>
            {#each reservations as resv}
              <tr>
                <td class="font-mono text-muted">#{resv.roomId.toString().padStart(3, '0')}</td>
                <td>
                  <div style="font-weight: 500; color: var(--text-h);">{new Date(resv.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
                  <div class="text-sm text-muted font-mono mt-1">{resv.startTime.substring(0,5)} &mdash; {resv.endTime.substring(0,5)}</div>
                </td>
                <td>
                  <div class="purpose-cell" title={resv.purpose}>
                    {resv.purpose}
                  </div>
                </td>
                <td><StatusBadge status={resv.status} /></td>
                <td>
                  {#if resv.status === 'pending' || resv.status === 'approved'}
                    <button class="btn btn-outline text-sm" on:click={() => handleCancel(resv.id)}>Batalkan</button>
                  {:else}
                    <span class="text-muted text-sm">&mdash;</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
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

  .purpose-cell {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .alert-danger {
    padding: 1rem;
    background-color: var(--danger-bg);
    color: var(--danger-hover);
    border: 1px solid rgba(225, 29, 72, 0.2);
    border-radius: var(--radius-sm);
  }

  .mt-1 { margin-top: 0.25rem; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
