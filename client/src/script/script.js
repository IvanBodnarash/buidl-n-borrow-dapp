import AOS from 'aos';
import 'aos/dist/aos.css';

document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
});

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = () => {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
};

scrollToTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Burger animation and mobile menu toggle
const burgerButton = document.getElementById("burgerButton");
const mobileNav = document.getElementById("mobileNav");
let menuOpen = false;

burgerButton.addEventListener("click", () => {
  menuOpen = !menuOpen;

  // Burger animation
  const spanElements = burgerButton.querySelectorAll("span");
  if (menuOpen) {
    spanElements[0].style.transform = "translateY(12px) rotate(45deg)";
    spanElements[1].style.opacity = "0";
    spanElements[2].style.transform = "translateY(-12px) rotate(-45deg)";
  } else {
    spanElements[0].style.transform = "translateY(0px) rotate(0)";
    spanElements[1].style.opacity = "1";
    spanElements[2].style.transform = "translateY(0px) rotate(0)";
  }

  // Mobile menu animation
  if (menuOpen) {
    mobileNav.classList.remove("hidden");
    setTimeout(() => {
      mobileNav.style.opacity = "1";
      mobileNav.style.transform = "translateY(0)";
    }, 10);
  } else {
    mobileNav.style.opacity = "0";
    mobileNav.style.transform = "translateY(-10px)";
    setTimeout(() => {
      mobileNav.classList.add("hidden");
    }, 300);
  }
});
