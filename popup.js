const trigger = document.querySelector(".trigger");
const popup = document.querySelector(".popup");
const overlay = document.querySelector(".overlay");
const close = document.querySelector(".popup .close");

// Функция для открытия попапа
const openPopup = () => {
  popup.classList.add("active");
  overlay.classList.add("active");
};

// Функция для закрытия попапа
const closePopup = () => {
  popup.classList.remove("active");
  overlay.classList.remove("active");
};

// Открываем попап при клике на кнопку
trigger.addEventListener("click", openPopup);

// Закрываем попап при клике на кнопку закрытия или на overlay
close.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);
