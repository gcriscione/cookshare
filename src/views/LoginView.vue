<template>
  <main class="container mt-5">
    <section class="row">
      <div class="col-md-6">
        <form class="register border p-4" @submit.prevent="register">
          <h2>Registrazione</h2>
          <div class="mb-3">
            <input
              type="email"
              class="form-control"
              placeholder="esempio@gmail.com"
              autocomplete="username"
              v-model="register_form.email"
              required
            />
          </div>
          <div class="mb-3">
            <input
              type="password"
              class="form-control"
              autocomplete="current-password"
              placeholder="password"
              v-model="register_form.password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </div>
      <div class="col-md-6">
        <form class="login border p-4" @submit.prevent="login">
          <h2>Login</h2>
          <div class="mb-3">
            <input
              type="email"
              class="form-control"
              placeholder="esempio@gmail.com"
              autocomplete="username"
              v-model="login_form.email"
              required
            />
          </div>
          <div class="mb-3">
            <input
              type="password"
              class="form-control"
              autocomplete="current-password"
              placeholder="password"
              v-model="login_form.password"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </section>
    <section class="row mt-4">
      <div class="col-md-12">
        <button class="btn btn-secondary" @click="loginWithGoogle">Login with Google</button>
      </div>
    </section>
    <div v-if="isLoading" class="loading-spinner-container">
        <div class="loading-spinner"></div>
    </div>
  </main>
</template>


<script lang="ts">
import { useStore } from 'vuex'
import { Vue } from 'vue-class-component';
import Swal from 'sweetalert2';

export default class LoginView extends Vue {

  private login_form = {
    email: '',
    password: '',
  };
  private register_form = {
    email: '',
    password: '',
  };
  private store = useStore();
  private isLoading = false;

  login = async () => {
    this.isLoading = true;
    try {
      await this.store.dispatch('login', this.login_form);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.showErrorAlert("Errore Login", error.message);
        console.error("Errore nel login con email e password:\n"+error.message);
      } else {
        this.showErrorAlert("Errore sconosciuto nel Login", "");
        console.error("Errore nel login con email e password:\n"+error);
      }
    }
    this.isLoading = false;
  }

  loginWithGoogle = async () => {
    this.isLoading = true;
    try {
      await this.store.dispatch('loginWithGoogle');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.showErrorAlert("Errore Login", error.message);
        console.error("Errore nel login con google:\n"+error.message);
      } else {
        this.showErrorAlert("Errore sconosciuto nel Login con google", "");
        console.error("Errore sconosciuto nel Login con google:\n"+error);
      }
    }
    this.isLoading = false;
  }

  register = async () =>{
    this.isLoading = true;
    try {
      await this.store.dispatch('register', this.register_form);
      Swal.fire("Registrazione avvenuta con successo", "", "success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.showErrorAlert("Errore registrazione", error.message);
        console.error("Errore nella registrazione con email e password:\n"+error.message);
      } else {
        this.showErrorAlert("Errore sconosciuto nella registrazione", "");
        console.error("Errore sconosciuto nella registrazione con email e password:\n"+error);
      }
    }
    this.isLoading = false;
  }    

  showErrorAlert(title: string, message: string) {
    Swal.fire(
      title,
      message,
      'error'
    )
  } 
}
</script>


<style>
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #F1A661;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>