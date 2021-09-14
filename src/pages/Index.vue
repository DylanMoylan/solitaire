<template>
  <q-page class="bg-positive">
    <div class="row full-width justify-between q-mb-md" @click.stop="cardHeld = null">
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
              :cardPosition="key"
              location="drawn" 
              :pile="drawn"
              v-for="(card,key) in drawn"
              :key="`drwc${key}`"
              @moveCard="val => moveCard(val, 'drawn', null, key)"
              @moveCardTo="moveCardTo"
              @holdCard="holdCard"
              @cardHovered="cardHovered"
              :cardHeld="cardHeld"
              :left="left"
              :top="top"
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
                :pile="pane"
                :index="index"
                :cardPosition="key"
                location="foundation" 
                v-for="(card,key) in pane"
                :key="`fn${index}-${key}`"
                @moveCardTo="moveCardTo"
                @holdCard="holdCard"
                @cardHovered="cardHovered"
                :cardHeld="cardHeld"
                :left="left"
                :top="top"
              />
          </div>
        </div>
    </div>
    <div class="row justify-center">
      <div 
        v-for="(pane, index) in tableau"
        :key="`tn${index}`"
        class="empty-pane" 
        style="position:relative"
        @mousedown="moveCardTo"
        @mouseenter="cardHovered({
          cardPosition: index,
          location: 'tableau',
          index: 0,
          card: {
            number: 14,
            color: 'any'
          } 
        })"
        @mouseleave="cardHovered(null)"
      >
        <card
          :card="card"
          :pile="pane"
          :index="key"
          :cardPosition="index"
          location="tableau" 
          v-for="(card,key) in pane"
          :key="`tn${index}-${key}`"
          @moveCard="val => moveCard(val, 'tableau', index, key)"
          @moveCardTo="moveCardTo"
          @holdCard="holdCard"
          @cardHovered="cardHovered"
          :cardHeld="cardHeld"
          :left="left"
          :top="top"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import init from 'src/init'
import Card from 'src/components/Card.vue'

export default {
  components: { Card },
  props: {
    reset: Boolean,
    score: Number
  },
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
      drawn: [],
      cardHeld: null,
      cardHovering: null,
      left: 0,
      top: 0
    }
  },
  methods: {
    cardHovered(data) {
      this.cardHovering = data
    },
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
      this.cardHeld = null
    },
    holdCard(card) {
      this.cardHeld = card
    },

    //Fired on click on a card - tries to move the held card to this.cardHovered.
    moveCardTo() {
      console.log('firing movecardTo')
      if(!!this.cardHeld) {
        let transfer = []
        let source
        if(this.cardHeld.location == 'drawn'){
          source = this.drawn
        }else{
          source = this[this.cardHeld.location][this.cardHeld.cardPosition]
        }
        let destination = this[this.cardHovering.location][this.cardHovering.cardPosition]
        let destinationCard = this.cardHovering.card
        if(this.cardHovering.location == 'foundation' && this.cardHeld.card.number == destinationCard.number + 1 && destinationCard.suite == this.cardHeld.card.suite && (this.cardHeld.index == source.length - 1 || this.cardHeld.card.location == 'drawn')) {
          console.log('Found a match')
          transfer = source.splice(this.cardHeld.index, source.length)
          transfer.forEach(card => destination.push(card))
          this.$emit('update:score', this.score + 10)
          if(source.length) {
            source[source.length - 1].shown = true
            this.$emit('update:score', this.score + 5)
          }
        }else if((!destinationCard && this.cardHeld.card.number == 13) || (destinationCard.color != this.cardHeld.card.color && (destinationCard.number == (this.cardHeld.card.number + 1)))) {
          transfer = source.splice(this.cardHeld.index, source.length)
          transfer.forEach(card => destination.push(card))
          if(this.cardHeld.location == 'foundation'){
            this.$emit('update:score', this.score - 15)
          }
          else if(source.length) {
            source[source.length - 1].shown = true
            this.$emit('update:score', this.score + 5)
          }
        }
      }
      this.cardHeld = null
    },

    //Fired on double click - locates a valid destination for the given card and moves the card there automatically. Updates score accordingly
    moveCard(card, location, index, cardIndex) {
      let source, validFoundation, sourcePile
      if(location == 'drawn'){
        sourcePile = this.drawn
      }else{
        sourcePile = this[location][index]
      }
      let validTableu = this.tableauRequirements.find(slot => (slot.color == card.color || slot.color == 'any') && slot.number == card.number)
      if(sourcePile.length == cardIndex + 1){
        validFoundation = this.foundationRequirements.find(slot => {
          return (slot.suite == 'any' || slot.suite == card.suite) && card.number == slot.number
        })
      }
      if(validFoundation || validTableu){
        if(location == 'drawn'){
          source = [this.drawn.pop()]
        }else{
          source = this[location][index].splice(cardIndex, (this[location][index].length - cardIndex + 1))
        }
        if(location == 'tableau' && this[location][index].length){
          this[location][index][this[location][index].length - 1].shown = true
          this.$emit('update:score', this.score + 5)
        }
      }
      if(validTableu && validFoundation) {
        if((card.number == 1 || card.number == 2) || card.number == 13 && location == 'tableau') {
          source.forEach(c => this[validFoundation.location][validFoundation.index].push(c))
          setTimeout(()=> {
            this.$emit('update:score', this.score + 10)
          }, 500)
        }else{
          if(location == 'drawn'){
            this.$emit('update:score', this.score + 5)
          }
          source.forEach(c => this[validTableu.location][validTableu.index].push(c))
        }
      }else{
        if(validTableu) {
          if(location == 'drawn'){
            this.$emit('update:score', this.score + 5)
          }
          source.forEach(c => this[validTableu.location][validTableu.index].push(c))
        }else if(validFoundation) {
          source.forEach(c => this[validFoundation.location][validFoundation.index].push(c))
          this.$emit('update:score', this.score + 10)
        }
      }
    },

    //Set to window.mousemove in mounted.
    watchPosition(e) {
      this.left = e.clientX
      this.top = e.clientY
    }
  },
  computed: {

    //Returns an array representing what card each tableau slot requires on the top of its stack.
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

    //Returns an array representing what card each foundation slot requires on the top of its stack.
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
  watch: {
    reset(val) {
      this.deck = []
      this.tableau = []
      this.drawn = []
      this.foundation = [
        [],
        [],
        [],
        []
      ]
      this.createDeck()
      this.createTableau()
    }
  },
  mounted() {
    this.createDeck()
    // this.createTestDeck()
    this.createTableau()
    this.$emit('update:score', 0)
    window.addEventListener('mousemove', this.watchPosition)
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.watchPosition)
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
