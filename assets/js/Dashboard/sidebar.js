// Manejar el toggle del sidebar
export function initSidebarToggle() {
    const toggleButton = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
  
    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }
  
  // Manejar la navegación entre secciones del dashboard
  export function initDashboardNavigation() {
    const links = document.querySelectorAll(".sidebar-link");
    const sections = document.querySelectorAll(".dashboard-section");
  
    links.forEach((link, index) => {
      link.addEventListener("click", () => {
        sections.forEach((section) => section.classList.add("d-none"));
        links.forEach((l) => l.classList.remove("active"));
  
        sections[index].classList.remove("d-none");
        link.classList.add("active");
      });
    });
  }