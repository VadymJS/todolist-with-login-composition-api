<template>
    <div class="todo-list">
        <div class="wrapper">
            <h1 class="head-md">Todo list</h1>
            <hr>
            <div class="todo-list-body" :class="{'is-loading': isLoading}">
                <div class="todo-list-body-user">
                    <h5 class="head-sm">User info</h5>
                    <p v-for="(value, key) in userInfo" :key="key" class="user-info">{{ key }}: {{ value }}</p>
                </div>
                <div class="todo-list-body-list">
                    <h5 class="head-sm">Todos</h5>
                    <Todo ref="todoRef"/>
                </div>
                <form class="todo-list-body-add">
                    <h5 class="head-sm">Add new todo</h5>
                    <div class="form-group" :class="{'is-invalid': validation.userId !== null}">
                        <input
                            type="number"
                            class="form-control"
                            placeholder="User ID"
                            v-model.number="todo.userId">
                        <div class="invalid-tooltip" v-if="validation.userId !== null">
                            {{ validation.userId }}
                        </div>
                    </div>

                    <div class="form-group" :class="{'is-invalid': validation.title !== null}">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Title"
                            v-model="todo.title">
                        <div class="invalid-tooltip" v-if="validation.title !== null">
                            {{ validation.title }}
                        </div>
                    </div>

                    <button
                        class="btn btn-info"
                        type="submit"
                        @click.prevent="addTodo">
                        Add
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import Todo from '../components/Todo.vue';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

const userInfo = ref(null);
const todo = reactive({
    userId: '',
    title: ''
});
const validation = reactive({
    userId: null,
    title: null,
});

const isLoading = ref(true);

onMounted( async () => {
    if (!route.params.id) {
        await router.push('/');
    }

    const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${route.params.id}`);
    userInfo.value = await userResponse.json();

    userInfo.value.address = userInfo.value.address?.city;
    userInfo.value.company = userInfo.value.company?.name;

    isLoading.value = false;
})

const idIncrement = ref(0);
const todoRef = ref();

function addTodo() {
    clearValidation();
    validate();

    if (validation.userId !== null || validation.title !== null) {
        return;
    }

    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            id: 501,
            userId: todo.userId,
            title: todo.title
        }),
    })
        .then(response => response.json())
        .then(data => {
            data.id += idIncrement.value;
            data.completed = false;
            idIncrement.value += 1;

            todoRef.value.addTodo(data);

            todo.userId = '';
            todo.title = '';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function validate() {
    if (!todo.userId) {
        validation.userId = 'Type something';
    } else {
        if (!(/^[0-9]+$/.test(todo.userId))) {
            validation.userId = 'Allowed only numbers';
        }
    }

    if (!todo.title.trim()) {
        validation.title = 'Type something';
    }
}

function clearValidation() {
    validation.userId = null;
    validation.title = null;
}
</script>
