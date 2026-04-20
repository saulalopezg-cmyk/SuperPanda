import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  get
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDg4jxoL6LnaWVLqdfu48SdBfH-8T3hVzA",
  authDomain: "superpanda-a89c0.firebaseapp.com",
  projectId: "superpanda-a89c0",
  storageBucket: "superpanda-a89c0.firebasestorage.app",
  messagingSenderId: "730819312861",
  appId: "1:730819312861:web:4a60912c859691d45a6f34"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


// VERIFICAR SESIÓN Y ROL
export function verificarRol(paginasPermitidas = []) {

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const snapshot = await get(ref(db, "usuarios/" + user.uid));
    const data = snapshot.val();

    const rol = data?.rol || "cliente";

    // Guardamos rol global
    window.usuarioRol = rol;
    window.usuarioEmail = user.email;

    const paginaActual = window.location.pathname.split("/").pop();

    if (rol === "vendedor") {

      if (!paginasPermitidas.includes(paginaActual)) {
        window.location.href = "home.html";
      }

    }

    // mostrar info usuario en sidebar
    const spanInfo = `${user.email}<br><small>${rol}</small>`;
    document.querySelectorAll(".navLateral-body-cr span").forEach(el => {
      el.innerHTML = spanInfo;
    });

  });

}


// LOGOUT GLOBAL
export function logoutSistema() {

  signOut(auth).then(() => {
    window.location.href = "index.html";
  });

}
