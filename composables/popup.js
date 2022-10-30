export const togglePopup = (id) => {
    return document.querySelector(`#${id}`).classList.toggle("popup__container--active");
}