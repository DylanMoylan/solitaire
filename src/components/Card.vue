<template>
    <div
        :style="{
            'color': card.color,
            'position': detached ? 'fixed' : 'absolute',
            'z-index': detached ? '100' : index + 1,
            'left': detached ? `${left}px` : (location == 'drawn' ? `${index * 25}px` : 0),
            'top': detached ? `${top}px` : (location == 'tableau' ? (card.shown ? `${index * 25}px` : `${index * 10}px`) : 0)
        }"
        @dblclick="moveCard"
    >
        <div v-html="card.shown ? card.icon : '&#127136;'" class="sltr-card non-selectable"/>
    </div>
</template>

<script>
export default {
    props: ['card', 'index', 'location', 'pile'],
    data() {
        return {
            detached: false,
            left: null,
            top: null
        }
    },
    methods: {
        moveCard() {
            if(this.location != 'drawn'){
                this.$emit('moveCard', this.card)
            }
            else {
                if(this.pile && this.index + 1 == this.pile.length){
                    this.$emit('moveCard', this.card)
                }
            }
        },
        detach() {
            this.detached = true
            window.addEventListener('mousemove', this.moveThis)
            window.addEventListener('mouseup', this.removeListener)
        },
        attach() {
            window.removeEventListener('mousemove', this.moveThis)
        },
        moveThis(e) {
            console.log('e: ', e);
            this.left = e.clientX
            this.top = e.clientY
        },
        removeListener() {
            this.detached = false
            window.removeEventListener('mousemove', this.moveThis)
            window.removeEventListener('mousemove', this.removeListener)
        }
    }
}
</script>

<style>

</style>