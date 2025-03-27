"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSidebarToggle = initSidebarToggle;
exports.initDashboardNavigation = initDashboardNavigation;

// Manejar el toggle del sidebar
function initSidebarToggle() {
  var toggleButton = document.getElementById("toggleSidebar");
  var sidebar = document.getElementById("sidebar");
  var mainContent = document.getElementById("mainContent");
  toggleButton.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
  });
} // Manejar la navegación entre secciones del dashboard


function initDashboardNavigation() {
  var links = document.querySelectorAll(".sidebar-link");
  var sections = document.querySelectorAll(".dashboard-section");
  links.forEach(function (link, index) {
    link.addEventListener("click", function () {
      sections.forEach(function (section) {
        return section.classList.add("d-none");
      });
      links.forEach(function (l) {
        return l.classList.remove("active");
      });
      sections[index].classList.remove("d-none");
      link.classList.add("active");
    });
  });
}
//# sourceMappingURL=sidebar.dev.js.map
