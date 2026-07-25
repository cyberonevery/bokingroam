<script>
  import { onMount } from "svelte";
  import { api } from "../lib/api";
  import StatusBadge from "../components/StatusBadge.svelte";
  import { auth } from "../stores/authStore";

  let recentReservations = [];
  let loading = true;
  let stats = { totalRooms: 0, pendingReservations: 0 };

  onMount(async () => {
    try {
      if ($auth.user.role === 'admin') {
        const [roomsRes, resvRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/reservations')
        ]);
        if (roomsRes.success && resvRes.success) {
          stats.totalRooms = roomsRes.data.length;
          stats.pendingReservations = resvRes.data.filter(r => r.status === 'pending').length;
          recentReservations = resvRes.data.slice(-5).reverse();
        }
      } else {
        const res = await api.get('/reservations/me');
        if (res.success) {
          recentReservations = res.data.slice(-5).reverse();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="page-enter">
  <header class="dashboard-header">
    <div class="header-content">
      <h2>Halo, {$auth.user?.name}!</h2>
      <p>Ringkasan aktivitas dan status pemesanan ruangan Anda.</p>
    </div>
  </header>

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>
  {:else}
    {#if $auth.user?.role === 'admin'}
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--primary-light); color: var(--primary);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-title">Total Ruangan</span>
            <span class="stat-value">{stats.totalRooms}</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: var(--warning-bg); color: var(--warning);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-title">Menunggu Persetujuan</span>
            <span class="stat-value">{stats.pendingReservations}</span>
          </div>
        </div>
      </div>
    {/if}

    <div class="card section-card">
      <div class="section-header">
        <h3>Aktivitas Reservasi Terbaru</h3>
      </div>
      
      {#if recentReservations.length === 0}
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <p>Belum ada aktivitas reservasi.</p>
        </div>
      {:else}
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Rentang Waktu</th>
                <th>Keperluan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {#each recentReservations as resv}
                <tr>
                  <td style="font-weight: 500;">{new Date(resv.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                  <td class="font-mono text-sm">{resv.startTime.substring(0,5)} &mdash; {resv.endTime.substring(0,5)}</td>
                  <td>{resv.purpose}</td>
                  <td><StatusBadge status={resv.status} /></td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dashboard-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  
  .dashboard-header h2 {
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
  
  .dashboard-header p {
    color: var(--text-muted);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .stat-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: var(--shadow-sm);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
  }

  .stat-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1;
    color: var(--text-h);
  }

  .section-card {
    padding: 0;
    overflow: hidden;
  }

  .section-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-surface);
  }

  .section-header h3 {
    font-size: 1.125rem;
    margin: 0;
  }

  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .empty-icon {
    color: var(--border-focus);
    opacity: 0.5;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
    color: var(--text-muted);
    gap: 1rem;
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
    color: var(--text-muted);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
