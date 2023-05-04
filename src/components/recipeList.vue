<template>
    <div>
        <p>
            Sono il componente RecipeList che usa
        </p>
        <RecipeItem />
    </div>
</template>

<script>
import RecipeItem from './RecipeItem.vue'

export default {
    name: "RecipeList",
    props: {

    },
    components:{
        RecipeItem
    },
    methods: {

    }
}
</script>