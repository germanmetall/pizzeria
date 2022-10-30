<template>
    <div class="order">
        <div class="order__left">
            <img class="order__img" :src="props.order.photo"/>
            <span class="order__name">{{props.order.name}}</span>
            <span class="order__size" v-if="props.order.size">({{props.order.size}})</span>
            <span class="order__ingredients">{{props.order.ingredients}}</span>
        </div>
        
        <div class="order__divider"></div>

        <div class="order__right">
            <div class="order__minus" @click="minus">-</div>
            <div class="order__quantity">{{quantity}}</div>
            <div class="order__plus" @click="plus">+</div>
            <span class="order__price">{{props.order.price}}</span>
        </div>
    </div>
</template>

<script setup>
const   props = defineProps(['order']),
        quantity = ref(1),
        emit = defineEmits(['delete', 'changeQuantity'])

function plus(){
    quantity.value++;
    emit("changeQuantity", quantity, props.order.id);
}

function minus(){
    quantity.value--;
    if(quantity.value === 0) emit("delete", props.order.id);
    else emit("changeQuantity", quantity, props.order.id);
}
</script>

<style scoped lang="scss">
.order{
	width: 100%;
	background-color: #27d70233;
	border-radius: 32px;
	display: grid;
	grid-template-columns: auto 4px 150px;
	color: #fb4052;
	font-family: "Montserrat";

    &__left{
        display: grid;
	    grid-template-columns: 64px auto auto;
        gap: 12px 6px;
        padding: 12px 24px;
    }
    &__divider{
        background-color: #fb4052;
    }
    &__right{
        display: grid;
        gap: 12px 0;
        grid-template-columns: auto auto auto;
        align-items: center;
        padding: 12px;
    }

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
	}
	&__ingredients{
		font-size: 28px;
		line-height: 1;
		grid-row: 2;
		grid-column: 1 / span 3;
	}
    &__plus, &__minus{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 48px;
        background-color: #d9d9d9;
        border-radius: 100%;
        font-size: 48px;
        cursor: pointer;
        transition: .5s;
        color: #000;
        user-select: none;
        &:hover{
            background-color: #fb4052;
        }
    }
    &__quantity{
        text-align: center;
        margin: auto;
        font-size: 32px;
    }
	&__price{
		font-size: 32px;
		text-align: center;
		line-height: 1;
		grid-row: 2;
        grid-column: 1 / span 3;
		&::after{
			content: " грн";
		}
	}
}
</style>