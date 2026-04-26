let menuAberto = false;

function toggleMenu() {
    let sidebar = document.getElementById("sidebar");
    let overlay = document.getElementById("overlay");

    if (!menuAberto) {
        sidebar.style.left = "0";
        overlay.style.opacity = "1";
        overlay.style.visibility = "visible";
        menuAberto = true;
    } else {
        sidebar.style.left = "-320px";
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
        menuAberto = false;
    }
}