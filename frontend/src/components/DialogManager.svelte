<script>
  import { dialogStore } from "../stores/dialogStore";
  import { fade, scale } from "svelte/transition";
</script>

{#if $dialogStore}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="dialog-backdrop" transition:fade={{duration: 200}} on:click={$dialogStore.type === 'alert' ? $dialogStore.onConfirm : $dialogStore.onCancel}>
    <div class="dialog-content" transition:scale={{duration: 250, start: 0.95}} on:click|stopPropagation>
      <div class="dialog-header">
        <div class="icon-container" class:confirm={$dialogStore.type === 'confirm'}>
          {#if $dialogStore.type === 'confirm'}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          {/if}
        </div>
        <div class="header-text">
          <h3>{$dialogStore.title}</h3>
          <p>{$dialogStore.message}</p>
        </div>
      </div>
      <div class="dialog-footer">
        {#if $dialogStore.type === 'confirm'}
          <button class="btn btn-outline flex-1" on:click={$dialogStore.onCancel}>Batal</button>
        {/if}
        <button class="btn btn-primary flex-1" on:click={$dialogStore.onConfirm}>Mengerti</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
  }

  .dialog-content {
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 380px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .dialog-header {
    padding: 1.5rem 1.5rem 1.25rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .icon-container {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-light);
    color: var(--primary);
  }

  .icon-container.confirm {
    background: var(--warning-bg);
    color: var(--warning);
  }

  .header-text h3 {
    margin: 0 0 0.375rem 0;
    font-size: 1.125rem;
    line-height: 1.3;
  }

  .header-text p {
    margin: 0;
    color: var(--text-body);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--bg-main);
    border-top: 1px solid var(--border);
  }

  .flex-1 {
    flex: 1;
  }

  @media (min-width: 640px) {
    .flex-1 {
      flex: none;
      min-width: 100px;
    }
  }
</style>
