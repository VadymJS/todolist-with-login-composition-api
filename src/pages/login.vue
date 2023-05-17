<template>
    <div class="login">
        <form class="card">
            <div class="card-title">
                <h2>Login</h2>
            </div>
            <div class="card-body">
                <p>Enter your username & password</p>
                <div class="form-group" :class="{'is-invalid': validation.username !== null}">
                    <input
                        class="form-control"
                        type="text"
                        placeholder="Username"
                        v-model="form.username">
                    <div class="invalid-tooltip" v-if="validation.username !== null">
                        {{ validation.username }}
                    </div>
                </div>

                <div class="form-group" :class="{'is-invalid': validation.phone !== null}">
                    <input
                        class="form-control"
                        type="tel"
                        placeholder="Phone Number"
                        v-model="form.phone">
                    <div class="invalid-tooltip" v-if="validation.phone !== null">
                        {{ validation.phone }}
                    </div>
                </div>

                <button
                    class="btn btn-success"
                    type="submit"
                    @click.prevent="emitLogin">
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();

const form = reactive({
    username: 'Kamren',
    phone: '(254)954-1289',
})
const validation = reactive({
    username: null,
    phone: null,
})
async function emitLogin() {
    clearValidation();
    validate();

    if (validation.username !== null || validation.phone !== null) {
        return;
    }

    let isLogin = false;
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();

    let existedUser = users.find(user =>
        user.username === form.username &&
        user.phone.replace(/\sx\d+/gi, "") === form.phone
    );

    if (existedUser) {
        isLogin = true;
    }

    if (isLogin) {
        await router.push({
            path: `/todo-list/${existedUser.id}`,
        });
    } else {
        validation.username = 'Login error: Incorrect username';
        validation.phone = 'Login error: Or phone';
    }
}

function validate() {
    if (!form.username.trim()) {
        validation.username = 'Type something';
    } else {
        if (!(/^[a-zA-Z]+$/.test(form.username))) {
            validation.username = 'Allowed only letters';
        }
    }

    if (!form.phone.trim()) {
        validation.phone = 'Type something';
    } else {
        if (!(/^[0-9!@#\$%\^\&*\)\(+=._-]+$/.test(form.phone))) {
            validation.phone = 'Allowed only numbers or symbols';
        }
    }
}

function clearValidation() {
    validation.username = null;
    validation.phone = null;
}

</script>
