<script>
  import { auth } from "../stores/authStore";
  import { layoutStore } from "../stores/layoutStore";
  import { Link, useLocation } from "svelte-routing";

  const location = useLocation();

  $: path = $location.pathname;

  function isActive(currentPath, matchPath, exact = false) {
    if (exact) {
      return currentPath === matchPath;
    }
    return currentPath.startsWith(matchPath);
  }

  function closeSidebar() {
    layoutStore.update(s => ({ ...s, isSidebarOpen: false }));
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="sidebar-backdrop" class:open={$layoutStore.isSidebarOpen} on:click={closeSidebar}></div>

<aside class="sidebar" class:open={$layoutStore.isSidebarOpen}>
  <div class="brand">
    <img src="/icons.svg" alt="BookingRoam Logo" class="logo-img" />
    <h1>BookingRoam</h1>
  </div>

  <div class="nav-section">
    <div class="nav-label">Menu Utama</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <nav class="nav-menu" on:click={closeSidebar}>
      <Link to="/" class="nav-item {isActive(path, '/', true) ? 'active' : ''}">
        <span class="icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </span>
        Dashboard
      </Link>
      
      <Link to="/rooms" class="nav-item {isActive(path, '/rooms') ? 'active' : ''}">
        <span class="icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </span>
        Katalog Ruangan
      </Link>

      <Link to="/reservations" class="nav-item {isActive(path, '/reservations') ? 'active' : ''}">
        <span class="icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </span>
        Reservasi Saya
      </Link>
    </nav>
  </div>

  {#if $auth.user?.role === 'admin'}
    <div class="nav-section">
      <div class="nav-label">Administrasi</div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <nav class="nav-menu" on:click={closeSidebar}>
        <Link to="/admin/rooms" class="nav-item {isActive(path, '/admin/rooms') ? 'active' : ''}">
          <span class="icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </span>
          Manajemen Ruang
        </Link>
        <Link to="/admin/reservations" class="nav-item {isActive(path, '/admin/reservations') ? 'active' : ''}">
          <span class="icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </span>
          Otorisasi Reservasi
        </Link>
        <Link to="/admin/notifications" class="nav-item {isActive(path, '/admin/notifications') ? 'active' : ''}">
          <span class="icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
          </span>
          Kirim Notifikasi
        </Link>
      </nav>
    </div>
  {/if}
</aside>

<style>
  .sidebar-backdrop {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 90;
    opacity: 0;
    transition: opacity var(--transition-smooth);
  }

  .sidebar {
    width: 260px;
    height: 100vh;
    background-color: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    overflow-y: auto;
    z-index: 100;
    transition: transform var(--transition-smooth);
  }

  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      box-shadow: var(--shadow-lg);
    }
    
    .sidebar.open {
      transform: translateX(0);
    }

    .sidebar-backdrop.open {
      display: block;
      opacity: 1;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 0.75rem 2rem;
  }

  .logo-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .brand h1 {
    font-size: 1.25rem;
    color: var(--text-h);
    margin: 0;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .nav-section {
    margin-bottom: 2rem;
  }

  .nav-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0 1rem;
    margin-bottom: 0.75rem;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  :global(.nav-item) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--text-body);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s ease;
  }

  :global(.nav-item:hover) {
    background-color: var(--bg-subtle);
    color: var(--text-h);
  }

  :global(.nav-item.active) {
    background-color: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    opacity: 0.7;
  }

  :global(.nav-item.active .icon) {
    opacity: 1;
  }
</style>
