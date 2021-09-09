<template>
    <div
        :style="{
            'color': card.color,
            'position': 'absolute',
            'z-index': index + 1,
            'left': location == 'drawn' ? `${index * 25}px` : 0,
            'top': location == 'tableau' ? (card.shown ? `${index * 25}px` : `${index * 10}px`) : 0
        }"
        @click="moveCard"
    >
        <div v-html="card.shown ? card.icon : '&#127136;'" class="sltr-card non-selectable"/>
    </div>
</template>

<script>
export default {
    props: ['card', 'index', 'location'],
    methods: {
        moveCard() {
            this.$emit('moveCard', this.card)
        }
    }
}
</script>

<style>

</style>