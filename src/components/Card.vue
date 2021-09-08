<template>
    <div
        :style="{
            'color': card.color,
            'display': card.shown ? 'initial' : 'none',
            'position': 'absolute',
            'z-index': index + 1,
            'left': `${index * 25}px`
        }"
        @click="moveCard"
    >
        <div v-html="card.icon" class="sltr-card non-selectable"/>
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