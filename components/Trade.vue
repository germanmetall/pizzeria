<template>
    <div class="trade" @click="toggleMobileImg = !toggleMobileImg">
        <img class="trade__img" :class="{'trade__img--expanded': toggleMobileImg}" :src="props.trade.photo"/>
        <span class="trade__name">{{props.trade.name}}</span>
        <span class="trade__size" v-if="props.trade.size">({{props.trade.size}})</span>
        <span class="trade__ingredients">{{props.trade.description}}</span>
        <span class="trade__price">{{props.trade.price}}</span>
    </div>
</template>

<script setup>
const props = defineProps(['trade']);
let toggleMobileImg = ref(false);
</script>

<style scoped lang="scss">
.trade{
	width: 100%;
	background-color: #e9c37c;
	border-radius: 32px;
	display: grid;
	grid-template-columns: 64px auto auto 70px;
	padding: 12px;
	gap: 12px 6px;
	color: #fb4052;
	font-family: "Montserrat";
	&__img{
		width: 64px;
		height: 64px;
		object-fit: cover;
		background-color: #fb4052;
		border-radius: 100%;
	}
	&__name{
		margin: auto 0;
		font-size: 36px;
		line-height: 1;
	}
	&__size{
		margin: auto;
		font-size: 28px;
		line-height: 1;
		white-space: nowrap;
	}
	&__ingredients{
		font-size: 28px;
		line-height: 1;
		grid-row: 2;
		grid-column: 1 / span 3;
	}
	&__price{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		text-align: center;
		line-height: 1;
		grid-row: 1 / span 2;
		&::after{
			content: " грн";
		}
	}
}

@media screen and (max-width: 1050px) {
	.trade{
		&__img{
			aspect-ratio: 6/1;
			height: unset;
		}
	}
}
</style>