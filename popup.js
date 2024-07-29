document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".trigger");
  const popups = document.querySelectorAll(".popup");
  const overlay = document.querySelector(".overlay");

  // Функция для открытия попапа
  const openPopup = (popup) => {
    popup.classList.add("active");
    overlay.classList.add("active");
  };

  // Функция для закрытия попапа
  const closePopup = () => {
    popups.forEach((popup) => popup.classList.remove("active"));
    overlay.classList.remove("active");
  };

  // Обработчик кликов для открытия попапа
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const popupId = trigger.getAttribute("data-popup"); // Идентификатор попапа
      const popup = document.querySelector(`#${popupId}`);
      openPopup(popup);
    });
  });

  // Закрываем попап при клике на оверлей
  overlay.addEventListener("click", closePopup);

  // Закрываем попап при клике на кнопку закрытия внутри попапа
  popups.forEach((popup) => {
    const closeButton = popup.querySelector(".close");
    if (closeButton) {
      closeButton.addEventListener("click", closePopup);
    }
  });
});

(function () {
  // Получаем все попапы
  const popupElements = document.querySelectorAll(".popup");

  // Для каждого попапа применяем скрипт
  popupElements.forEach((popupElement) => {
    const contentElement = popupElement.querySelector(".content");
    const clonedContent = contentElement.cloneNode(true);

    // Добавляем клонированный контент
    contentElement.appendChild(clonedContent);

    popupElement.addEventListener("scroll", () => {
      const scrollPosition = popupElement.scrollTop;
      const contentHeight = contentElement.scrollHeight / 2;

      if (scrollPosition >= contentHeight) {
        popupElement.scrollTop = scrollPosition - contentHeight;
      } else if (scrollPosition <= 0) {
        popupElement.scrollTop = contentHeight + scrollPosition;
      }
    });
  });
})();
