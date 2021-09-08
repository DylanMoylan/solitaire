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
            <card
              :card="card"
              :index="key"
              location="drawn" 
              v-for="(card,key) in drawn"
              :key="`drwc${key}`"
              @moveCard="moveCard"
            />
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
      class="empty-pane" 
      style="position:relative"
    >
      <card
        :card="card"
        :index="key"
        location="drawn" 
        v-for="(card,key) in pane"
        :key="`tn${index}-${key}`"
      />
    </div>
  </q-page>
</template>

<script>
import init from 'src/init'
import Card from 'src/components/Card.vue'

export default {
  components: { Card },
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
    },
    moveCard(card) {
      let validLocation = this.tableauRequirements.find(slot => slot.color == card.color && slot.number == card.number)
      if(validLocation) {
        this[validLocation.location][validLocation.index].push(this.drawn.pop())
      }
    }
  },
  computed: {
    tableauRequirements() {
      return this.tableau.map((slot, index) => {
        if(slot.length) {
          let topCard = slot[slot.length - 1]
          return {
            color: topCard.color == 'black' ? 'red' : 'black',
            number: topCard.number - 1,
            location: 'tableau',
            index
          }
        }else {
          return {
            color: 'any',
            number: 13,
            location: 'tableau',
            index
          }
        }
      }).concat(this.foundation.map((slot, index) => {
        if(slot.cards.length) {
          return {
            suite: slot.suite,
            number: slot.cards.length,
            location: 'foundation',
            index
          }
        }else{
          return {
            number: 1,
            location: 'foundation',
            index
          }
        }
      }))
    },
  },
  mounted() {
    this.createDeck()
    this.createTableau()
  }
}
</script>

<style>
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
