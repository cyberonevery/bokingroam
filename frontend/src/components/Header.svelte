<script>
  import { auth } from "../stores/authStore";
  import { layoutStore } from "../stores/layoutStore";
  import NotificationBell from "./NotificationBell.svelte";
  import { useLocation } from "svelte-routing";

  const location = useLocation();
  let isDropdownOpen = false;

  function handleLogout() {
    auth.logout();
  }

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function toggleSidebar() {
    layoutStore.update(s => ({ ...s, isSidebarOpen: !s.isSidebarOpen }));
  }

  function handleClickOutside(event) {
    if (isDropdownOpen && !event.target.closest('.user-profile-container')) {
      isDropdownOpen = false;
    }
  }

  $: pathParts = $location.pathname.split('/').filter(Boolean);
  $: breadcrumb = pathParts.length > 0 
    ? pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')
    : 'Dashboard';
</script>

<svelte:window on:click={handleClickOutside} />

<header class="header">
  <div class="header-left">
    <button class="hamburger-btn" on:click={toggleSidebar} aria-label="Toggle Menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
    <div class="breadcrumb">
      <span class="brand-name">BookingRoam</span> <span class="separator">/</span> <span class="path-name">{breadcrumb}</span>
    </div>
  </div>

  <div class="header-actions">
    {#if $auth.user?.role !== 'admin'}
      <NotificationBell />
    {/if}
    
    <div class="user-profile-container">
      <button class="avatar-btn" on:click={toggleDropdown}>
        {$auth.user?.name.charAt(0).toUpperCase()}
      </button>

      {#if isDropdownOpen}
        <div class="dropdown-menu">
          <div class="dropdown-header">
            <span class="user-name">{$auth.user?.name}</span>
            <span class="user-role">{$auth.user?.role}</span>
          </div>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item text-danger" on:click={handleLogout}>
            Logout
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .header {
    height: 70px;
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .hamburger-btn {
    display: none;
    background: none;
    border: none;
    color: var(--text-h);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    margin-left: -0.5rem;
  }

  .hamburger-btn:hover {
    background-color: var(--bg-subtle);
  }

  .breadcrumb {
    font-size: 0.875rem;
    color: var(--text-h);
    font-weight: 500;
  }

  .separator {
    color: var(--text-muted);
    margin: 0 0.5rem;
  }

  @media (max-width: 768px) {
    .header {
      padding: 0 1rem;
    }
    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-name, .separator {
      display: none;
    }
    .path-name {
      font-size: 1rem;
      font-weight: 700;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .user-profile-container {
    position: relative;
    padding-left: 1.5rem;
    border-left: 1px solid var(--border);
  }

  .avatar-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .avatar-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(67, 56, 202, 0.2);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    background-color: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    min-width: 180px;
    padding: 0.5rem 0;
    z-index: 50;
    animation: fadeDown 0.2s ease forwards;
  }

  .dropdown-header {
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-h);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: capitalize;
  }

  .dropdown-divider {
    height: 1px;
    background-color: var(--border);
    margin: 0.25rem 0;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.75rem 1.25rem;
    background: none;
    border: none;
    font-size: 0.875rem;
    color: var(--text-body);
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }

  .dropdown-item:hover {
    background-color: var(--bg-subtle);
  }

  .dropdown-item.text-danger:hover {
    color: var(--danger);
    background-color: var(--danger-bg);
  }

  @keyframes fadeDown {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
