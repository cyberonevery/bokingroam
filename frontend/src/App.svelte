<script>
  import { Router, Route } from "svelte-routing";
  import { auth } from "./stores/authStore";
  import { onMount } from "svelte";

  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import RoomList from "./pages/RoomList.svelte";
  import RoomManagement from "./pages/RoomManagement.svelte";
  import ReservationHistory from "./pages/ReservationHistory.svelte";
  import ReservationManagement from "./pages/ReservationManagement.svelte";
  import AdminNotifications from "./pages/AdminNotifications.svelte";
  import DialogManager from "./components/DialogManager.svelte";

  import Sidebar from "./components/Sidebar.svelte";
  import Header from "./components/Header.svelte";

  export let url = "";

  onMount(() => {
    auth.init();
  });
</script>

<Router {url}>
  {#if $auth.isAuthenticated}
    <div class="admin-layout">
      <Sidebar />
      <div class="main-wrapper">
        <Header />
        <main class="content-area">
          <Route path="/"><Dashboard /></Route>
          <Route path="/rooms"><RoomList /></Route>
          <Route path="/reservations"><ReservationHistory /></Route>
          {#if $auth.user?.role === 'admin'}
            <Route path="/admin/rooms"><RoomManagement /></Route>
            <Route path="/admin/reservations"><ReservationManagement /></Route>
            <Route path="/admin/notifications"><AdminNotifications /></Route>
          {/if}
        </main>
      </div>
    </div>
  {:else}
    <main class="auth-container">
      <Route path="/register"><Register /></Route>
      <Route path="/"><Login /></Route>
      <Route><Login /></Route>
    </main>
  {/if}
</Router>

<DialogManager />

<style>
  .admin-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: var(--bg-main);
  }
  .main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .content-area {
      padding: 1rem;
    }
  }
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg-main);
  }
</style>
