<template>
	<title>Pizza Neapolitana</title>

	<Header></Header>

	<div class="slider">
		<nav class="slider__element" v-for="slide of slidesCount" :key="slide" :class="{'slider__element--active': currSlide === slide-1}" :title="`${slide} сторінка`" @click="goToSlide(slide-1)"></nav>
	</div>

	<div id="page">
		<div class="slides">

			<section class="slide" id="slide-reasons" ref="slide1">
				<div class="reason">
					У нас найкраща піца!
				</div>
				<div class="reason">
					У нас найкраща піца!
				</div>
				<div class="reason">
					У нас найкраща піца!
				</div>

				<div id="pizzaBoxContainer">
					<img id="pizzaBox" src="@/assets/Pizzabox.jpg"/>
				</div>
			</section>

			<section class="slide" id="slide-menu" ref="slide2">
				<nav class="categories">
					<div v-for="category in categories" :key="category" class="categories__item" :class="{'categories__item--active': category === chosenCategory}" @click="applyFilter(category)">{{category}}</div>
				</nav>

				<div id="menuBoxContainer">
					<img id="menuBox" src="@/assets/Menubox.png"/>
					<img id="pizzaImg" ref="pizzaImg"/>
				</div>

				<div class="trades" @wheel.stop>
					<Trade v-for="trade of trades" :trade="trade" :key="trade.id" @mouseenter="onMouseEnterTrade(trade.photo)" @mouseleave="onMouseLeaveTrade"></Trade>
				</div>
			</section>

			<section class="slide" id="slide-order" ref="slide3">
				<div class="form">
					<div class="form__left" @wheel.stop>
						<Order v-for="order of orders" :order="order" :key="order.id" @delete="onDelete" @changeQuantity="onChangeQuantity"></Order>
						<div id="maybeMore" @click="togglePopup('ChoosePizza')">
							<div id="maybeMore__img"></div>
							<div id="maybeMore__name">Додати ще</div>
						</div>
					</div>

					<div class="form__divider"></div>
					
					<div class="form__right">
						<span class="form__text">
							Разом до сплати:
							<br/>
							{{price}} грн
						</span>
						<input class="form__input" type="tel" ref="formPhone" placeholder="Телефон" title="Телефон"/>
						<input class="form__input" type="text" ref="formAddress" placeholder="Адреса" title="Адреса"/>
						<input class="form__input" type="text" ref="formComments" placeholder="А може щось ще?.." title="Коментарі"/>
						<span class="mobile__order" @click="order">Замовити</span>
					</div>

					<div class="form__mobile">
						<span class="mobile__order" @click="togglePopup('FormMobile')">Уточнити дані</span>
					</div>
				</div>
			</section>

		</div>
	</div>

	<Popup :trades="initTrades" @addTrade="addTrade"></Popup>
	<PopupFormMobile :price="price" @order="order"></PopupFormMobile>
</template>

<script setup>
import Header from './components/Header.vue';
import Trade from './components/Trade.vue';
import Order from './components/Order.vue';
import Popup from './components/Popup.vue';
import PopupFormMobile from './components/PopupFormMobile.vue';

useHead({
	title: "Pizza Neapolitana",
	viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
	charset: 'utf-8',
	meta: [
		{
			name: 'description',
			content: 'Pizza delivery'
		}
	]
});

// refs and groups
const 	slide1 = ref(null),
		slide2 = ref(null),
		slide3 = ref(null),
		slides = [slide1, slide2, slide3],
		pizzaImg = ref(null),
		// temp
		categories = ref(["Все", "Піца", "Напої"]),
		initTrades = ref([]);

let currSlide = ref(0),
	slidesCount = 3,
	isScrollingAnimationComplete = true,
	chosenCategory = ref(0),
	trades = ref([]),
	orders = ref([]),
	price = ref(0),
	formPhone = ref(""),
	formAddress = ref(""),
	formComments = ref("");

function goToSlide(num){
	currSlide.value = num;

	applySlideAnimation();
}

function changeSlide(dir){
	currSlide.value += dir;

	if(currSlide.value < 0) currSlide.value = slidesCount + dir;
	else if(currSlide.value >= slidesCount) currSlide.value = -1 + dir;

	applySlideAnimation();
}

function applySlideAnimation(){
	document.querySelector("#page").style.transform = `translateY(calc(-${currSlide.value*33.3334}%))`;
}

function applyFilter(categoryName){
	chosenCategory.value = categoryName;

	if(categoryName === 'Все') trades.value = initTrades.value;
	else trades.value = initTrades.value.filter(el => el.categories.includes(categoryName));

	console.log(trades.value, initTrades.value);
}

function onMouseEnterTrade(image){
	console.log(image);
	pizzaImg.value.src = image;
	pizzaImg.value.classList.add("active");
}

function onMouseLeaveTrade(){
	pizzaImg.value.classList.remove("active");
	setTimeout(() => pizzaImg.src = undefined, 750);
}

function onDelete(id){
	delete orders.value.find(el => el.id == id).amount;
	orders.value = orders.value.filter(el => el.id !== id);
}

function onChangeQuantity(quantity, id){
	orders.value.find(el => el.id == id).amount = quantity.value;
}

function addTrade(trade){
	if(!orders.value.includes(trade)) {
		orders.value.push(trade);
		orders.value.find(el => el.id == trade.id).amount = 1;
	}
	else orders.value.find(el => el.id == id).amount++;
	togglePopup('ChoosePizza');
}

async function order(){
	let phone = formPhone.value.value,
		address = formAddress.value.value;
	console.log(phone, address);
	if(!phone || !address) return;
	await fetch(`https://pizzeria-api.onrender.com/addOrder`, {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
		body: JSON.stringify({
			phone,
			address,
			comments: formComments.value.value,
			cart: orders.value
		})
	}); 
}

watchEffect(() => {
	price.value = orders.value.reduce((acc, el) => {
		return acc + +(+el.price * +el.amount);
	}, 0);
})

onMounted(async () => {
	let resp = await fetch(`https://pizzeria-api.onrender.com/getGoods`);
	try{
		let body = await resp.json();
		console.log(body);
		initTrades.value = body;
		trades.value = initTrades.value;
		categories.value = new Set();
		body.filter(el => {
			categories.value.add(...el.categories);
		});
		categories.value = ['Все', ...categories.value]
	}
	catch(e){
		console.error(e);
	}

	chosenCategory.value = categories.value[0];

	if(window.innerWidth <= 1050) return document.body.style.overflow = 'auto';
	window.addEventListener("wheel", (e)=>{
		if(!isScrollingAnimationComplete) return;

		changeSlide(Math.sign(e.deltaY));
		isScrollingAnimationComplete = false;
		setTimeout(() => isScrollingAnimationComplete = true, 500);
	});
});
</script>

<style lang="scss">
@font-face {
	font-family: "Pan-Pizza";
	src: url("~/assets/panpizza.ttf");
}
@font-face {
	font-family: "Montserrat";
	src: url("~/assets/Montserrat-Medium.otf");
}
@font-face {
	font-family: "Playfair-Display";
	src: url("~/assets/PlayfairDisplay-Medium.ttf");
}

body{
	margin: 0;
	padding: 0;
	overflow: hidden;
}
*{
	box-sizing: border-box;
}
#__nuxt{
	min-height: 300vh;
	//background-image: url('~/assets/Background.jpg');
	background-image: url('~/assets/bg1.jpg');
}
#page{
	margin: 0 10vw;
	background-color: #d9d9d9cc;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	transition: 1s;
}
.slider{
	position: absolute;
	left: calc(5vw - 25px);
	height: calc(100vh - 70px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 64px;
	&__element{
		width: 50px;
		height: 50px;
		border-radius: 100%;
		background-color: #e9c37c;
		transition: .75s;
		cursor: pointer;
		&--active{
			background-color: #fb4052;
		}
	}
}
.slides{
	width: 100%;
}
.slide{
	width: 100%;
	height: calc(100vh - 70px);
}

#slide{
	&-reasons{
		display: grid;
		grid-template-columns: auto 512px;
		grid-template-rows: 128px repeat(2, 256px);
		font-family: "Playfair-Display", "Montserrat";
		padding: calc(50vh - (70px / 2) - (256px + 64px)) 64px;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		font-size: 64px;
		gap: 0 64px;
	}
	&-menu{
		display: grid;
		grid-template-columns: auto auto;
		grid-template-rows: 64px auto;
		gap: 32px;
		padding: 10vh 32px;
	}
	&-order{
		margin: 0 auto;
		padding: 10vh 64px;
	}
}
.reason{
	&:first-of-type{
		grid-column: 1 / span 2;
	}
}
#pizzaBox{
	width: 100%;
	object-fit: cover;

	&Container{
		width: 512px;
		height: 512px;
		grid-column: 2;
		grid-row: 2 / span 1;
	}

	&--animated{}
}
.categories{
	grid-column: 2;
	display: flex;
	flex-direction: row;
	gap: 32px;
	font-family: "Playfair-Display";
	font-size: 36px;
	line-height: 1.8;
	padding: 0 24px;
	flex-wrap: wrap;
	&__item{
		background-color: #27d702;
		color: #000;
		transition: .5s;
		padding: 6px 12px;
		border-radius: 16px;
		cursor: pointer;
		&--active{
			color: #fb4052;
		}
	}
}
#menuBox{
	position: relative;
	z-index: 1;
	width: 100%;
	object-fit: cover;

	&Container{
		position: relative;
		width: 420px;
		height: 420px;
		grid-column: 1;
		grid-row: 2;
		border-radius: 32px;
		background-color: #e9c37c;
	}
}
#pizzaImg{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	transition: .75s;
	opacity: 0;
	border-radius: 32px;
	&.active{
		opacity: 1;
	}
}
.trades{
	display: flex;
	flex-direction: column;
	gap: 16px;
	overflow: auto;
	height: fit-content;
	max-height: 60vh;
}
.form{
	display: grid;
	grid-template-columns: 65% 4px calc(35% - 4px);
	background-color: #e9c37c;
	border-radius: 64px;
	&__left{
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 32px;
		overflow: auto;
		max-height: 50vh;
	}
	&__divider{
		width: 100%;
		height: 100%;
		background-color: #fb4052;
	}
	&__right{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24px;
		padding: 32px 12px;
		color: #fb4052;
	}
	&__mobile{
		display: none;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 12px 0;
	}
	&__text{
		font-family: "Montserrat";
		font-size: 36px;
		text-align: center;
	}
	&__input{
		width: 100%;
		font-family: "Montserrat";
		font-size: 28px;
		border: 2px solid transparent;
		outline: unset;
		border-radius: 8px;
		padding: 4px 8px;
		background-color: #27d70233;
		transition: .5s;
		
		&:focus{
			border: 2px solid #27d702;
		}
	}
}
#maybeMore{
	width: 100%;
	background-color: #27d70233;
	border-radius: 32px;
	display: grid;
	grid-template-columns: 64px auto;
	color: #fb4052;
	font-family: "Montserrat";
    padding: 12px 24px;
	cursor: pointer;
	&__img{
		width: 64px;
		height: 64px;
		background-color: #e9c37c;
		border-radius: 100%;
	}
	&__name{
		padding: 0 12px;
		margin: auto 0;
		font-size: 48px;
	}
}
.mobile__order{
	padding: 12px 24px;
	font-style: normal;
	font-weight: 400;
	font-size: 36px;
	background: rgba(39, 215, 2, 0.4);
	border-radius: 32px;
	line-height: 40px;
	color: #FB4052;
	margin: 0 auto;
	font-family: "Montserrat";
	cursor: pointer;
}

@media all and (max-width: 1400px){
	#slide-reasons{
		grid-template-columns: auto 420px;
		grid-template-rows: 128px auto repeat(2, 210px);
		font-size: 48px;
	}
	#pizzaBox{
		&Container{
			grid-row: 2 / span 2;
			width: 420px;
			height: 420px;
		}
	}
	.categories__item{
		font-size: 32px;
	}
	.trade, .order{
		&__name{
			font-size: 26px !important;
		}
		&__size, &__price{
			font-size: 20px !important;
		}
	}
	.form__input{
		font-size: 24px;
	}
}
@media all and (max-width: 1200px){
	#slide-reasons{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		font-size: 36px;
		height: 860px;
		gap: 24px;
	}
	#pizzaBox{
		&Container{
			width: 360px;
			height: 360px;
		}
	}
	.categories__item{
		font-size: 28px;
	}
	#slide-menu{
		gap: 16px;
	}
	#menuBox{
		&Container{
			width: 360px;
			height: 360px;
		}
	}
	.trade, .order{
		&__name, &__ingredients{
			font-size: 20px !important;
		}
		&__size, &__price{
			font-size: 16px !important;
		}
	}
	.form__input{
		font-size: 20px;
	}
	#maybeMore{
		&__name{
			font-size: 34px;
		}
	}
}
@media all and (max-width: 1150px){
	#page{
		margin: 0 !important;
	}
	.slider{
		display: none;
	}
	.slide{
		height: unset;
	}
	#slide{
		&-menu{
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: stretch;
			gap: 32px;
		}
		&-order{
			padding: 4vh 16px;
		}
	}
	#menuBox{
		&Container{
			display: none;
		}
	}
	.categories{
		padding: 0;
		gap: 12px 24px;
		&__item{
			font-size: 24px;
		}
	}
	.trade{
		position: relative;
		display: flex !important;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 0 !important;
		&s{
			max-height: 60vh;
		}
		&__name{
			width: 50%;
			margin: 0 !important;
			padding-top: 24px;
			padding-left: 24px;
			font-size: 36px !important;
		}
		&__size{
			margin: 0 auto !important;
			padding-top: 24px;
			font-size: 36px !important;
		}
		&__price{
			width: 100%;
			flex-direction: row !important;
			font-size: 36px !important;
		}
		&__ingredients{
			order: 2;
			width: 100%;
			padding-left: 24px !important;
			padding-right: 24px !important;
			font-size: 20px !important;
		}
		&__img{
			width: 100% !important;
			height: 128px !important;
			order: 3;
    		border-radius: 0 0 32px 32px !important;
			transition: .5s;
			margin: 0;
			&--expanded{
    			border-radius: 32px !important;
				height: 256px !important;
				margin: 0 24px 24px 24px;
			}
		}
	}
	.form{
		display: flex !important;
		flex-direction: column;
		border-radius: 16px;
		&__left{
			max-height: unset;
			overflow: unset;
		}
		&__right{
			display: none;
		}
		&__mobile{
			display: flex;
			width: 80%;
			margin: 0 auto;
		}
	}
	.order{
		display: flex !important;
		flex-direction: column;
		&__right{
			justify-content: space-around;
		}
	}
	#maybeMore{
		&__name{
			font-size: 28px;
		}
	}
}
@media all and (max-width: 700px){
	.trade{
		&__name{
			min-width: 50%;
			padding-top: 24px !important;
			padding-left: 24px !important;
			font-size: 24px !important;
		}
		&__size{
			padding-top: 24px !important;
			font-size: 24px !important;
		}
		&__price{
			font-size: 24px !important;
		}
		&__ingredients{
			padding-left: 24px !important;
			padding-right: 24px !important;
			font-size: 16px !important;
		}
		&__img{
			height: 64px !important;
			&--expanded{
				height: 128px !important;
			}
		}
	}
}
@media all and (max-width: 500px){
	.trade{
		&__name{
			width: 100%;
			text-align: center;
		}
		&__size{
			width: 100%;
			text-align: center;
		}
	}
}
</style>