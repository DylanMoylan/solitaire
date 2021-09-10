<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          SLTR
        </q-toolbar-title>
        <div>
          <span class="q-mr-md text-body1">Score: {{ score }}</span>
          <q-btn
            label="reset"
            class="bg-negative"
            @click="resetGame"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view :reset="reset" v-model:score="score" />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

  data() {
    return {
      reset: false,
      score: 0
    }
  },
  methods: {
    resetGame() {
      this.reset = !this.reset
      this.score = 0
    }
  }
})
</script>
