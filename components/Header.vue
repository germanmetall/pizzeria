<template>
    <header class="header">
        <img src="@/public/favicon.png"/>
        <div class="header__text">Pizza Neapolitana</div>
    </header>
</template>

<style scoped lang="scss">
.header{
    position: relative;
    z-index: 100;
    width: 100%;
    background-color: #e9c37c20;
    &__text{
        text-align: center;
        color: #fb4052;
        font-size: 64px;
        font-family: "Pan-Pizza";
        margin: 0 auto;
    }
    img{
        position: absolute;
        height: 70px;
        padding: 12px;
    }
}
@media all and (max-width: 1050px){
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background-color: #e9c37c20;
        img{
            position: relative;
            padding: 0;
            height: 140px;
        }
        &__text{
            margin: 0;
        }
    }
}
</style>