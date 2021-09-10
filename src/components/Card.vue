<template>
    <div
        :style="{
            'color': card.shown ? card.color : 'black',
            'position': position,
            'z-index': zIndex,
            'left': cLeft,
            'top': cTop
        }"
        @mousedown="detach"
        @mouseup="attach"
        @mouseenter="hoverCard"
    >
        <div v-html="card.shown ? card.icon : '&#127136;'" class="sltr-card non-selectable"/>
    </div>
</template>

<script>
export default {
    props: ['card', 'index', 'location', 'pile', 'cardHeld', 'cardPosition', 'left', 'top'],
    data() {
        return {
            detached: false,
            clicks: 0,
            delay: 150
        }
    },
    methods: {
        hoverCard() {
            if(!this.detached) {
                this.$emit('cardHovered', {
                    card: this.card,
                    index: this.index,
                    location: this.location,
                    cardPosition: this.cardPosition
                })
            }
        },
        moveCard(moveCardTo) {
            if(this.location != 'drawn'){
                if(moveCardTo){
                    this.$emit('moveCardTo', this.card)
                }else {
                    this.$emit('moveCard', this.card)
                }
            }
            else {
                if(this.pile && this.index + 1 == this.pile.length){
                    this.$emit('moveCard', this.card)
                }
            }
        },
        detach() {
            this.clicks++
            if(!!this.cardHeld){
                this.moveCard(true)
                this.clicks = 0
            }else {
                if(this.clicks == 1) {
                    this.timer = setTimeout(() => {
                        if(this.card.shown && (this.index == this.pile.length - 1 || this.location != 'drawn')) {
                            this.detached = true
                            window.addEventListener('mouseup', this.removeListener)
                            this.$emit('holdCard', {
                                card: this.card,
                                location: this.location,
                                index: this.index,
                                cardPosition: this.cardPosition
                            })
                        }
                        this.clicks = 0
                    }, this.delay);
                } else {
                    clearTimeout(this.timer)
                    this.moveCard()
                    this.attach()
                    this.clicks = 0
                }
            }
        },
        attach() {
            if(!!this.detached) {
                clearTimeout(this.timer)
                this.removeListener()
                this.$emit('holdCard', null)
            }
        },
        removeListener() {
            this.detached = false
            window.removeEventListener('mouseup', this.removeListener)
        }
    },
    computed: {
        position() {
            if(this.detached || this.isTiedToCardHeld) {
                return 'fixed'
            }else{
                return 'absolute'
            }
        },
        zIndex() {
            return this.position == 'fixed' ? 100 + this.index + 1 : this.index + 1
        },
        cLeft() {
            if(this.detached) {
                return `${this.left}px`
            }else if(this.isTiedToCardHeld){
                return `${this.left}px`
            }else if(this.location == 'drawn') {
                return `${this.index * 25}px`
            }else{
                return 0
            }
        },
        cTop() {
            if(this.detached) {
                return `${this.top}px`
            }else if(this.isTiedToCardHeld){
                return `${this.top + this.index * 25}px`
            }else if(this.location == 'tableau') {
                if(this.card.shown) {
                    return `${this.index * 25 - (this.shownInPile * 10)}px`
                }else{
                    return `${this.index * 10}px`
                }
            }else{
                return 0
            }
        },
        //Are we holding this card also, aka is it below the card held?
        isTiedToCardHeld() {
            //We are holding a card, this card is visible, in the same section, in the same slot, and below the card held.
            return !!this.cardHeld && this.card.shown && this.location == this.cardHeld.location && this.cardPosition == this.cardHeld.cardPosition && this.index >= this.cardHeld.index
        },
        shownInPile() {
            if(!!this.pile) {
                return this.pile.filter(card => !card.shown).length
            }
        }
    }
}
</script>

<style>

</style>