<template>
  <q-page class="flex flex-center bg-positive">
    <div class="row full-width justify-between">
        <div class="row q-mt-md">
          <div
            class="q-ml-md q-mr-md  non-selectable"
            :class="deck.length ? 'sltr-card' : 'empty-pane'"
            v-html="deck.length ? '&#127136;' : ''"
            @click="draw" />
          <div class="empty-pane" style="position:relative">
            <card
              :card="card"
              :index="key"
              location="drawn" 
              v-for="(card,key) in drawn"
              :key="`drwc${key}`"
              @moveCard="val => moveCard(val, 'drawn')"
            />
          </div>
        </div>
        <div class="row q-mt-md">
          <div 
            v-for="(pane, index) in foundation"
            :key="`fp${index}`"
            class="empty-pane" style="position:relative">
              <card
                :card="card"
                :index="key"
                location="foundation" 
                v-for="(card,key) in pane"
                :key="`fn${index}-${key}`"
              />
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
        location="tableau" 
        v-for="(card,key) in pane"
        :key="`tn${index}-${key}`"
        @moveCard="val => moveCard(val, 'tableau', index, key)"
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
        [],
        [],
        [],
        []
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
    moveCard(card, location, index, cardIndex) {
      console.log('card: ', card);
      console.log('location: ', location);
      console.log('index: ', index);
      console.log('cardIndex: ', cardIndex);
      let source
      let validTableu = this.tableauRequirements.find(slot => (slot.color == card.color || slot.color == 'any') && slot.number == card.number)
      let validFoundation = this.foundationRequirements.find(slot => {
        return (slot.suite == 'any' || slot.suite == card.suite) && card.number == slot.number
      })
      if(validFoundation || validTableu){
        if(location == 'drawn'){
          source = [this.drawn.pop()]
        }else{
          source = this[location][index].splice(cardIndex, (this[location][index].length - cardIndex + 1))
        }
        if(location == 'tableau' && this[location][index].length){
          this[location][index][this[location][index].length - 1].shown = true
        }
      }
      if(validFoundation) {
        source.forEach(c => this[validFoundation.location][validFoundation.index].push(c))
      }else {
        if(validTableu) {
          source.forEach(c => this[validTableu.location][validTableu.index].push(c))
        }
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
      })
    },
    foundationRequirements() {
      return this.foundation.map((slot, index) => {
        if(slot.length) {
          return {
            suite: slot[0].suite,
            number: slot.length + 1,
            location: 'foundation',
            index
          }
        }else{
          return {
            suite: 'any',
            number: 1,
            location: 'foundation',
            index
          }
        }
      })
    }
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
   line-height: .93;
   cursor: pointer;
   font-size: 15em;
   background-color: white;
 }
</style>
