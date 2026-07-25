<script>
  import { auth } from "../stores/authStore";
  import { api } from "../lib/api";
  import { Link } from "svelte-routing";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleLogin() {
    error = "";
    loading = true;
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.success) {
        auth.login(res.token, res.user);
      } else {
        error = res.message || "Gagal login";
      }
    } catch (err) {
      error = "Terjadi kesalahan pada server.";
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-wrapper page-enter">
  <div class="auth-card">
    <div class="brand-header">
      <img src="/icons.svg" alt="BookingRoam Logo" class="logo-img-large" />
      <h2>Selamat Datang Kembali</h2>
      <p>Akses dashboard BookingRoam Anda</p>
    </div>

    {#if error}
      <div class="alert alert-danger">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="auth-form">
      <div class="form-group">
        <label for="email">Alamat Email</label>
        <!-- svelte-ignore a11y-autofocus -->
        <input type="email" id="email" bind:value={email} required placeholder="nama@perusahaan.com" autofocus />
      </div>

      <div class="form-group">
        <div class="flex justify-between">
          <label for="password">Kata Sandi</label>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" class="forgot-link">Lupa sandi?</a>
        </div>
        <input type="password" id="password" bind:value={password} required placeholder="••••••••" />
      </div>

      <button type="submit" class="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  </div>
  
  <div class="auth-footer">
    Belum punya akun? <Link to="/register">Daftar sekarang</Link>
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
    max-width: 420px;
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
    gap: 0.5rem;
  }

  .forgot-link {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary);
  }
  
  .forgot-link:hover {
    color: var(--primary-hover);
    text-decoration: underline;
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
