<template>
    <div class="popup__container" id="FormMobile" @wheel.stop>
        <div class="popup">
            <svg @click="togglePopup('FormMobile')" id="popupCross" width="49" height="50" viewBox="0 0 49 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="1.41421" y1="1.58579" x2="46.669" y2="46.8406" stroke="black" stroke-width="4"/>
                <line x1="46.6691" y1="2.41421" x2="1.41426" y2="47.669" stroke="black" stroke-width="4"/>
            </svg>

            <span class="form__text">
                Разом до сплати:
                <br/>
                {{props.price}} грн
            </span>
            <input class="form__input" type="tel" ref="formPhone" placeholder="Телефон" title="Телефон"/>
            <input class="form__input" type="text" ref="formAddress" placeholder="Адреса" title="Адреса"/>
            <input class="form__input" type="text" ref="formComments" placeholder="А може щось ще?.." title="Коментарі"/>
            <span class="mobile__order" @click="$emit('order'); togglePopup('FormMobile')">Замовити</span>
        </div>
    </div>
</template>

<script setup>
let props = defineProps(['price']);
let emits = defineEmits(['order'])
</script>

<style scoped lang="scss">
.popup{
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px 32px;
    width: 80vw;
    max-height: 70vh;
    overflow: auto;
    background-color: #e9c37c;
    padding: 32px;
    border-radius: 16px;
    &__container{
        display: none;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 101;
        background-color: #00000060;
        &--active{
            display: flex;
        }
    }
}
#popupCross{
    background: #e9c37c;
    padding: 12px;
    border-radius: 12px;
    position: fixed;
    right: 10vw;
    top: 15vh;
    margin: 12px;
    cursor: pointer;
}
</style>