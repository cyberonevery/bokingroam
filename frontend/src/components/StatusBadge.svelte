<script>
  export let status = 'pending';

  const badgeStyles = {
    pending: { bg: '#FEF3C7', color: '#D97706', text: 'Menunggu' },
    approved: { bg: '#D1FAE5', color: '#059669', text: 'Disetujui' },
    rejected: { bg: '#FEE2E2', color: '#DC2626', text: 'Ditolak' },
    cancelled: { bg: '#F3F4F6', color: '#4B5563', text: 'Dibatalkan' }
  };

  $: style = badgeStyles[status] || badgeStyles.pending;
</script>

<span 
  class="badge" 
  style="background-color: {style.bg}; color: {style.color};"
>
  {style.text}
</span>

<style>
  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    display: inline-block;
  }
</style>
