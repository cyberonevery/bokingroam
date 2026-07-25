<script>
  import { onMount } from "svelte";
  import { api } from "../lib/api";
  import { dialog } from "../stores/dialogStore";
  import StatusBadge from "../components/StatusBadge.svelte";
  import Modal from "../components/Modal.svelte";

  let reservations = [];
  let loading = true;
  
  let isRejectModalOpen = false;
  let selectedId = null;
  let rejectReason = "";

  async function loadReservations() {
    loading = true;
    try {
      const res = await api.get('/reservations');
      if (res.success) {
        reservations = res.data.reverse();
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  onMount(loadReservations);

  async function handleApprove(id) {
    if (await dialog.confirm("Otorisasi pengajuan reservasi ini?")) {
      try {
        const res = await api.patch(`/reservations/${id}/approve`);
        if (res.success) {
          loadReservations();
        } else {
          await dialog.alert(res.message || "Gagal mengotorisasi reservasi.");
        }
      } catch (err) {
        await dialog.alert("Terjadi kegagalan komunikasi dengan server.");
      }
    }
  }

  function openRejectModal(id) {
    selectedId = id;
    rejectReason = "";
    isRejectModalOpen = true;
  }

  async function handleRejectSubmit() {
    try {
      const res = await api.patch(`/reservations/${selectedId}/reject`, { reject_reason: rejectReason });
      if (res.success) {
        isRejectModalOpen = false;
        loadReservations();
      } else {
        await dialog.alert(res.message || "Sistem gagal menolak reservasi.");
      }
    } catch (err) {
      await dialog.alert("Terjadi kegagalan komunikasi dengan server.");
    }
  }

  async function handleCancel(id) {
    if (await dialog.confirm("Eksekusi pembatalan paksa (Force Cancel) untuk reservasi ini?")) {
      try {
        const res = await api.patch(`/reservations/${id}/cancel`);
        if (res.success) {
          loadReservations();
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
      <h2>Kelola Reservasi</h2>
      <p>Pantau dan atur semua pesanan ruangan masuk.</p>
    </div>
  </header>

  <div class="card p-0 overflow-hidden">
    {#if loading}
      <div class="state-container">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>
    {:else if reservations.length === 0}
      <div class="state-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        <p>Belum ada pesanan ruangan yang masuk.</p>
      </div>
    {:else}
      <div class="table-responsive" style="border: none; border-radius: 0;">
        <table>
          <thead>
            <tr>
              <th width="10%">ID</th>
              <th width="20%">Tanggal & Waktu</th>
              <th width="15%">Pemesan & Ruangan</th>
              <th width="20%">Keperluan</th>
              <th width="15%">Status</th>
              <th width="20%">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each reservations as resv}
              <tr>
                <td class="font-mono text-muted">#{resv.id.toString().padStart(4, '0')}</td>
                <td>
                  <div style="font-weight: 500; color: var(--text-h);">{new Date(resv.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
                  <div class="text-sm text-muted font-mono mt-1">{resv.startTime.substring(0,5)} &mdash; {resv.endTime.substring(0,5)}</div>
                </td>
                <td>
                  <div class="font-mono text-sm" style="color: var(--text-h);">User: #{resv.userId}</div>
                  <div class="font-mono text-sm text-muted">Room: #{resv.roomId}</div>
                </td>
                <td>
                  <div class="purpose-cell" title={resv.purpose}>
                    {resv.purpose}
                  </div>
                </td>
                <td><StatusBadge status={resv.status} /></td>
                <td>
                  <div class="action-buttons">
                    {#if resv.status === 'pending'}
                      <button class="btn btn-outline text-sm approve-btn" on:click={() => handleApprove(resv.id)}>Setujui</button>
                      <button class="btn btn-outline text-sm reject-btn" on:click={() => openRejectModal(resv.id)}>Tolak</button>
                    {:else if resv.status === 'approved'}
                      <button class="btn btn-outline text-sm" on:click={() => handleCancel(resv.id)}>Force Cancel</button>
                    {:else}
                      <span class="text-muted text-sm">&mdash;</span>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<Modal title="Keputusan Penolakan Sistem" isOpen={isRejectModalOpen} on:close={() => (isRejectModalOpen = false)}>
  <form on:submit|preventDefault={handleRejectSubmit}>
    <div class="form-group">
      <label for="reject_reason">Alasan Penolakan (Dicatat dalam Log)</label>
      <textarea id="reject_reason" bind:value={rejectReason} rows="4" placeholder="Alokasi waktu bertentangan dengan jadwal prioritas..."></textarea>
    </div>
    <div class="flex justify-between mt-8">
      <button type="button" class="btn btn-outline" on:click={() => (isRejectModalOpen = false)}>Batal</button>
      <button type="submit" class="btn btn-danger">Tolak Reservasi</button>
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
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mt-1 { margin-top: 0.25rem; }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .approve-btn { color: var(--success); border-color: var(--success); }
  .approve-btn:hover { background-color: var(--success-bg); border-color: var(--success); color: var(--success); }

  .reject-btn { color: var(--danger); border-color: var(--danger); }
  .reject-btn:hover { background-color: var(--danger-bg); border-color: var(--danger); color: var(--danger-hover); }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
