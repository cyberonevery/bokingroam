<script>
  import { notificationStore } from "../stores/notificationStore";
  import { onMount, onDestroy } from "svelte";

  let isOpen = false;

  onMount(() => {
    notificationStore.fetchNotifications();
  });

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function handleMarkRead(id) {
    notificationStore.markAsRead(id);
  }
  
  function handleClickOutside(event) {
    const bell = document.getElementById('notif-bell');
    if (isOpen && bell && !bell.contains(event.target)) {
      isOpen = false;
    }
  }

</script>

<svelte:window on:click={handleClickOutside} />

<div class="notification-wrapper" id="notif-bell">
  <button class="bell-btn" on:click={toggleDropdown}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
    {#if $notificationStore.unreadCount > 0}
      <span class="badge">{$notificationStore.unreadCount}</span>
    {/if}
  </button>

  {#if isOpen}
    <div class="dropdown">
      <div class="dropdown-header">
        <h4>Notifikasi</h4>
      </div>
      <div class="notification-list">
        {#if $notificationStore.notifications.length === 0}
          <div class="empty">Tidak ada notifikasi</div>
        {:else}
          {#each $notificationStore.notifications as notif}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="notif-item {notif.isRead ? 'read' : 'unread'}" on:click={() => !notif.isRead && handleMarkRead(notif.id)}>
              <p>{notif.message}</p>
              <small>{new Date(notif.createdAt).toLocaleDateString()}</small>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .notification-wrapper {
    position: relative;
  }
  .bell-btn {
    background: none;
    border: none;
    position: relative;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    color: var(--text-muted);
  }
  .bell-btn:hover {
    color: var(--primary);
  }
  .badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: var(--danger);
    color: white;
    font-size: 0.65rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
  }
  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 320px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    margin-top: 0.5rem;
    z-index: 100;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }
  .dropdown-header {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
  }
  .dropdown-header h4 {
    margin: 0;
  }
  .notification-list {
    overflow-y: auto;
  }
  .notif-item {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.2s;
  }
  .notif-item:hover {
    background: var(--bg-secondary);
  }
  .notif-item p {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
  }
  .notif-item small {
    color: var(--text-muted);
  }
  .unread {
    background-color: rgba(79, 70, 229, 0.05);
    border-left: 3px solid var(--primary);
  }
  .empty {
    padding: 2rem 1rem;
    text-align: center;
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .dropdown {
      position: fixed;
      top: 75px;
      left: 1rem;
      right: 1rem;
      width: auto;
      max-height: calc(100vh - 100px);
    }
  }
</style>
