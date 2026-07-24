<script>
  export let room;
  export let onBook = () => {};
</script>

<div class="room-card">
  <div class="card-visual">
    <div class="room-pattern">
      <div class="pattern-id">ID: {room.id.toString().padStart(3, '0')}</div>
    </div>
    <div class="capacity-badge">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
      {room.capacity} Org
    </div>
  </div>
  <div class="card-content">
    <div class="card-header">
      <h3>{room.name}</h3>
      <p class="location">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        {room.location}
      </p>
    </div>
    
    <div class="card-details">
      <div class="time-block">
        <span class="label">Operasional</span>
        <span class="value">{room.openTime.substring(0,5)} &mdash; {room.closeTime.substring(0,5)}</span>
      </div>
      <p class="desc">{room.description || 'Ruangan ini belum memiliki deskripsi tambahan.'}</p>
    </div>
  </div>
  
  <div class="card-footer">
    <button class="btn btn-primary w-full" on:click={() => onBook(room)}>
      Reservasi Ruangan
    </button>
  </div>
</div>

<style>
  .room-card {
    display: flex;
    flex-direction: column;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: all var(--transition-smooth);
    height: 100%;
  }

  .room-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
    border-color: var(--border-focus);
  }

  .card-visual {
    position: relative;
    height: 140px;
    background: linear-gradient(135deg, var(--bg-subtle) 0%, #E2E8F0 100%);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .room-pattern {
    width: 100%;
    height: 100%;
    background-image: radial-gradient(var(--border-focus) 1px, transparent 1px);
    background-size: 16px 16px;
    opacity: 0.3;
    display: flex;
    align-items: flex-end;
    padding: 1rem;
  }

  .pattern-id {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    color: var(--text-h);
    opacity: 0.2;
    letter-spacing: -0.05em;
  }

  .capacity-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-h);
    box-shadow: var(--shadow-sm);
  }

  .card-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card-header h3 {
    font-size: 1.125rem;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  .location {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--text-muted);
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .card-details {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .time-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-main);
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }

  .time-block .label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .time-block .value {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--primary);
  }

  .desc {
    color: var(--text-body);
    font-size: 0.875rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }

  .card-footer {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
</style>
