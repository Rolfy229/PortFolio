// -- Initialize AOS --
AOS.init({
    duration: 800, // Animation duration
    once: true, // Only animate once
    offset: 50 // Offset (in px) from the original trigger point
});

// --- Three.js Animation ---
let scene, camera, renderer, mesh;
let container = document.getElementById('3d-container');

function init3D() {
    if (!container) {
        console.error("3D container not found");
        return;
    }
    try {
        scene = new THREE.Scene();

        // Adjust camera based on container size
        let aspect = container.clientWidth / container.clientHeight;
        // Handle potential division by zero if container has no height initially
        if (aspect === Infinity || aspect === 0 || isNaN(aspect) ) {
            aspect = 1; // Default to square aspect ratio
        }

        camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Added antialias
        renderer.setSize(container.clientWidth, container.clientHeight || container.clientWidth); // Use width if height is 0
        renderer.setPixelRatio(window.devicePixelRatio); // Better resolution on high-dpi screens
        container.innerHTML = ''; // Clear container before appending canvas
        container.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(2, 1); // Increased detail slightly
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff, // Use theme color later if desired
            wireframe: true,
            metalness: 0.1, // Slight metallic sheen
            roughness: 0.5
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft ambient light
         scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 10, 10);
        scene.add(pointLight);

        animate();
    } catch (error) {
        console.error("Error initializing Three.js:", error);
        if (container) {
             container.innerHTML = '<p style="color: var(--text-color);">3D model loading failed.</p>';
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
     if (mesh && renderer && scene && camera) {
        mesh.rotation.x += 0.005; // Slower rotation
        mesh.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
}

 // Handle window resize for 3D canvas
 function onWindowResize() {
    if (container && camera && renderer) {
         let newWidth = container.clientWidth;
         // Calculate height based on aspect ratio (1:1) from width
         let newHeight = newWidth;

         // Ensure dimensions are valid
         if (newWidth <= 0) {
             // Fallback if container is hidden or has no width
             const heroCol = container.closest('.col-lg-5');
             if (heroCol) {
                  newWidth = heroCol.clientWidth > 0 ? heroCol.clientWidth : 300; // Use column width or default
                  newHeight = newWidth; // Maintain aspect ratio
             } else {
                  newWidth = 300; // Default size
                  newHeight = 300;
             }
         }

         camera.aspect = 1; // Keep aspect ratio 1:1
         camera.updateProjectionMatrix();
         renderer.setSize(newWidth, newHeight);
    }
}

// --- Theme Toggle ---
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);

    const themeIcon = document.getElementById("theme-icon");
    const navbar = document.getElementById("navbar-main");

    if (newTheme === "dark") {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        navbar.classList.remove("navbar-light", "bg-light");
        navbar.classList.add("navbar-dark", "bg-dark");
        // Optional: Update 3D mesh color for dark theme
         if(mesh) mesh.material.color.setHex(0x00ffff);
    } else {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        navbar.classList.remove("navbar-dark", "bg-dark");
        navbar.classList.add("navbar-light", "bg-light");
         // Optional: Update 3D mesh color for light theme
          if(mesh) mesh.material.color.setHex(0x007bff);
    }
     // Update timeline dot border color dynamically
    try {
         const computedStyle = getComputedStyle(document.body);
         // Use the correct variable name based on the theme
         const sectionBgVarName = (newTheme === 'dark') ? '--section-bg-light' : '--section-bg-light';
         const sectionBg = computedStyle.getPropertyValue(sectionBgVarName).trim();

         document.querySelectorAll('.experience-item::before, .education-item::before').forEach(el => {
             el.style.borderColor = sectionBg;
         });
    } catch(e) {
        console.warn("Could not update timeline dot border color:", e);
    }
}

 // Set Initial Theme Icon based on default theme
 function setInitialThemeIcon() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute("data-theme") || 'dark'; // Default to dark if not set
      const themeIcon = document.getElementById("theme-icon");
      const navbar = document.getElementById("navbar-main");

      // Ensure theme attribute is set
      if (!html.getAttribute("data-theme")) {
          html.setAttribute("data-theme", currentTheme);
      }

      if (currentTheme === "light") {
           themeIcon.classList.remove("fa-moon");
           themeIcon.classList.add("fa-sun");
           navbar.classList.remove("navbar-dark", "bg-dark");
           navbar.classList.add("navbar-light", "bg-light");
           if(mesh) mesh.material.color.setHex(0x007bff); // Set initial 3D color
      } else {
           themeIcon.classList.remove("fa-sun");
           themeIcon.classList.add("fa-moon");
           navbar.classList.remove("navbar-light", "bg-light");
           navbar.classList.add("navbar-dark", "bg-dark");
           if(mesh) mesh.material.color.setHex(0x00ffff); // Set initial 3D color
      }
      // Set initial timeline dot border color
      try {
          const computedStyle = getComputedStyle(document.body);
          const sectionBgVarName = (currentTheme === 'dark') ? '--section-bg-light' : '--section-bg-light';
          const sectionBg = computedStyle.getPropertyValue(sectionBgVarName).trim();
          document.querySelectorAll('.experience-item::before, .education-item::before').forEach(el => {
              el.style.borderColor = sectionBg;
          });
       } catch(e) {
            console.warn("Could not set initial timeline dot border color:", e);
       }
 }

 // Update Copyright Year
 function updateCopyrightYear() {
     const yearElement = document.getElementById('current-year');
     if (yearElement) {
         yearElement.textContent = new Date().getFullYear();
     }
 }


 // --- Initialize ---
 document.addEventListener('DOMContentLoaded', () => {
     updateCopyrightYear();
     init3D(); // Initialize the 3D animation
     setInitialThemeIcon(); // Set correct icon and initial styles on load

     window.addEventListener('resize', onWindowResize, false); // Add resize listener

      // Bootstrap Scrollspy activation (if needed for active nav links)
      const mainNav = document.getElementById('navbar-main');
      if (mainNav) {
           try {
               const scrollSpy = new bootstrap.ScrollSpy(document.body, {
                   target: '#navbar-main',
                   offset: 90 // Adjust offset as needed
               });
           } catch (e) {
               console.error("Failed to initialize Bootstrap ScrollSpy:", e);
           }
      }
 });