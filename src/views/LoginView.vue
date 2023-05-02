<template>
    <main class="login">
        <section class="forms">

            <form class="register" @submit.prevent="register">
                <h2>Registrazione</h2>
                <input 
                    type="email"
                    placeholder="esempio@gmail.com" 
                    autocomplete="username"
                    v-model="register_form.email"
                    required
                />
                <input
                    type="password"
                    autocomplete="current-password"
                    placeholder="password"
                    v-model="register_form.password"
                    required
                />
                <input
                    type="submit"
                    value="register"
                />
            </form>

            <form class="login" @submit.prevent="login">
                <h2>Login</h2>
                <input 
                    type="email"
                    placeholder="esempio@gmail.com" 
                    autocomplete="username"
                    v-model="login_form.email"
                    required
                />
                <input
                    type="password"
                    autocomplete="current-password"
                    placeholder="password"
                    v-model="login_form.password"
                    required
                />
                <input
                    type="submit"
                    value="login"
                />
            </form>

            <button @:click="loginWithGoogle">Login with google</button>

        </section>
    </main>
</template>


<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
    setup(){
        const login_form = ref({});
        const register_form = ref({});
        const store = useStore();

        const login = () => {
            store.dispatch('login', login_form.value);
        }

        const loginWithGoogle = () => {
            store.dispatch('loginWithGoogle');
        }

        const register = async () =>{
            store.dispatch('register', register_form.value);
        }

        return {
            login_form,
            register_form,
            login,
            loginWithGoogle,
            register
        }
    }
}
</script>


<style>
    /* .forms {
        display: flex;
        min-height: 100vh;
    }

    form {
        flex: 1 1 0%;
        padding: 8rem 1rem 1rem;
    }

    form.register {
        color: white;
        background-color: rgb(245, 66, 101);
        background-image: linear-gradient(
            to bottom right,
            rgb(245, 66, 101) 0%,
            rgb(128, 28, 60) 100%
        );
    }

    h2 {
        font-size: 2rem;
        text-transform: uppercase;
        margin-bottom: 2rem;
    }

    input{
        appearance: none;
        border: none;
        outline: none;
        background: none;

        display: block;
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        font-size: 1.5rem;
        margin-bottom: 2rem;
        padding: 0.5rem 0rem;
    }

    input:not([type="submit"]) {
        opacity: 0.8;
        transition-delay: 0.4s;
    }

    input:focut:not([type="submit"]) {
        opacity: 1;
    }

    input::placeholder {
        color: inherit;
    }

    form.login  input:not([type="submit"]){
        color: #2c3e50;
        border-bottom: 2px solid #2c3e50;
    }

    form.login  input[type="submit"]{
        background-color: rgb(245, 66, 101);
        color: #FFF;
        font-weight: 700;
        padding: 1rem 2 rem;
        border-radius: 0.5rem;
        cursor: pointer;
        text-transform: uppercase;
    }

    form.register  input[type="submit"]{
        background-color: #FFF;
        color: rgb(245, 66, 101);
        font-weight: 700;
        padding: 1rem 2 rem;
        border-radius: 0.5rem;
        cursor: pointer;
        text-transform: uppercase;
    } */
</style>