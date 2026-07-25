<script>
  import { api } from "../lib/api";
  import { Link, navigate } from "svelte-routing";

  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let success = "";
  let loading = false;

  async function handleRegister() {
    error = "";
    success = "";
    
    if (password !== confirmPassword) {
      error = "Konfirmasi kata sandi tidak cocok.";
      return;
    }

    loading = true;
    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.success) {
        success = "Registrasi berhasil! Menyiapkan profil Anda...";
        setTimeout(() => navigate("/"), 2000);
      } else {
        error = res.message || "Gagal registrasi";
      }
    } catch (err) {
      error = "Terjadi kegagalan komunikasi dengan server.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-wrapper page-enter">
  <div class="auth-card">
    <div class="brand-header">
      <img src="/icons.svg" alt="BookingRoam Logo" class="logo-img-large" />
      <h2>Daftar Akun Baru</h2>
      <p>Mulai kelola reservasi ruangan Anda hari ini.</p>
    </div>

    {#if error}
      <div class="alert alert-danger">{error}</div>
    {/if}
    {#if success}
      <div class="alert alert-success">{success}</div>
    {/if}

    <form on:submit|preventDefault={handleRegister} class="auth-form">
      <div class="form-group">
        <label for="name">Nama Lengkap</label>
        <input type="text" id="name" bind:value={name} required placeholder="Mis. John Doe" />
      </div>

      <div class="form-group">
        <label for="email">Alamat Email</label>
        <input type="email" id="email" bind:value={email} required placeholder="nama@perusahaan.com" />
      </div>

      <div class="form-group">
        <label for="password">Kata Sandi</label>
        <input type="password" id="password" bind:value={password} required minlength="6" placeholder="Minimal 6 karakter" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Kata Sandi</label>
        <input type="password" id="confirmPassword" bind:value={confirmPassword} required placeholder="Ulangi kata sandi" />
      </div>

      <button type="submit" class="btn btn-primary w-full mt-2" disabled={loading}>
        {loading ? 'Memproses...' : 'Daftar Sekarang'}
      </button>
    </form>
  </div>
  
  <div class="auth-footer">
    Sudah punya akun? <Link to="/">Masuk di sini</Link>
  </div>
</div>

<style>
  .auth-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .auth-card {
    background: var(--bg-surface);
    width: 100%;
    max-width: 440px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    padding: 3rem 2.5rem;
  }

  .brand-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .logo-img-large {
    width: 56px;
    height: 56px;
    object-fit: contain;
    margin: 0 auto 1rem;
  }

  .brand-header h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .brand-header p {
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .alert {
    padding: 0.875rem 1rem;
    border-radius: var(--radius-sm);
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .alert-danger {
    background-color: var(--danger-bg);
    color: var(--danger-hover);
    border: 1px solid rgba(225, 29, 72, 0.2);
  }

  .alert-success {
    background-color: var(--success-bg);
    color: var(--success);
    border: 1px solid rgba(5, 150, 105, 0.2);
  }

  .auth-footer {
    margin-top: 2rem;
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .auth-footer :global(a) {
    color: var(--text-h);
    font-weight: 600;
    margin-left: 0.25rem;
  }

  .auth-footer :global(a:hover) {
    color: var(--primary);
  }
</style>
