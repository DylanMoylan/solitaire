<template>
  <q-page class="flex flex-center bg-positive">
    <div class="row full-width justify-between">
        <div class="row q-mt-md">
          <div
            v-for="(card,key) in deck"
            :key="`dc${key}`"
            v-html="card.icon"
            :style="{
              'color': card.color,
              'display': card.shown ? 'initial' : 'none'
            }"
          />
          <div class="empty-pane q-ml-md" @click="draw">
            Hand
          </div>
          <div class="empty-pane" style="position:relative">
            <div
              v-for="(card,key) in drawn"
              :key="`drwc${key}`"
              :style="{
                'color': card.color,
                'display': card.shown ? 'initial' : 'none',
                'position': 'absolute',
                'z-index': key + 1,
                'left': `${key * 25}px`
              }"
            >
              <div v-html="card.icon" class="sltr-card non-selectable"/>
            </div>
          </div>
        </div>
        <div class="row q-mt-md">
          <div 
            v-for="(pane, index) in foundation"
            :key="`fp${index}`"
            class="empty-pane">
          </div>
        </div>
    </div>
    <div 
      v-for="(pane, index) in tableau"
      :key="`tn${index}`"
    >
      <div
        v-for="(card,key) in pane"
        :key="`tn${index}-${key}`"
        v-html="card.icon"
        class="sltr-card non-selectable"
        :style="{
          'color': card.color,
          'display': card.shown ? 'initial' : 'none'
        }"
      />
    </div>
  </q-page>
</template>

<script>
import init from 'src/init'

export default {
  name: 'PageIndex',
  mixins: [init],
  data() {
    return {
      foundation: [
        {
          suite: null,
          cards: []
        },
        {
          suite: null,
          cards: []
        },
        {
          suite: null,
          cards: []
        },
        {
          suite: null,
          cards: []
        }
      ],
      deck: [],
      tableau: [],
      drawn: []
    }
  },
  methods: {
    draw() {
      if(this.deck.length){
        this.drawn.push(...this.deck.splice(0,3))
        this.drawn[this.drawn.length - 3].shown = true
        this.drawn[this.drawn.length - 2].shown = true
        this.drawn[this.drawn.length - 1].shown = true
      }else {
        this.deck = [...this.drawn.map(card => {
          card.shown = false
          return card
        })]
        this.drawn = []
      }
    }
  },
  mounted() {
    this.createDeck()
    this.createTableau()
  }
}
</script>

<style scoped>
 .empty-pane {
   width: 9em;
   height: 14em;
   border: 1px solid white;
   border-radius: 3px;
   margin-right: 15px;
   cursor: pointer;
 }
 .sltr-card {
   cursor: pointer;
   font-size: 15em;
   background-color: white;
 }
</style>
