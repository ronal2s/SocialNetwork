import SCREEN_IMPORT from 'Dimensions'

const SCREEN_WIDTH = SCREEN_IMPORT.get('window').width;

const CONFIG = {
    apiKey: "AIzaSyAksBhAo90khYTZP8BQgL11lohW34WBdOE",
    authDomain: "socialnetwork-3b7a1.firebaseapp.com",
    databaseURL: "https://socialnetwork-3b7a1.firebaseio.com",
    projectId: "socialnetwork-3b7a1",
    storageBucket: "socialnetwork-3b7a1.appspot.com",
    messagingSenderId: "643282533725"
};
const FACEBOOK = {
    TOKEN: "https://graph.facebook.com/me?access_token",
    API: "https://graph.facebook.com/v3.3"
}
const DEFAULTPHOTO = require("../../assets/icons/user.png")
const DATAMODAL = { buttonText1: "", buttonText2: "", buttonText2Color: "", buttonText1Color: "", OnPressButton1: null, OnPressButton2: null };
const ROUTES = 
{
    Posts: "/POSTS",
    Usuarios: "/USUARIOS",
    Solicitudes: "/SOLICITUDES",
    Amigos: "/AMIGOS",
    MeGustas: "/MEGUSTAS",
    Comentarios: "/COMENTARIOS",
    Notificaciones: "/NOTIFICACIONES",
    Mensajes: "/MENSAJES"
}


const CURRENTUSER = {
    email: "",
    mainPhoto: "",
    user: "",
    // likes: 0, //numerico
    // friends: 0, //numero. Lo haré con un length
    //El plan de que sea numero es no traer toda esa data al cliente, que se solicite y ya.
    //Si un amigo lo elimina o viceversa, se disminuye el numero en el momento
    // posts: 0, //Ya no será necesario, lo haré con un .length
    requests: [],//Array de texto de usuarios
    messages: [],//Array de mensajes
}

// const FOLLOWERS =
//     [
//         user1,
//         user2
//     ]

//Este se usa para el registro
const user = {
    // uid: "",
    email: "",
    mainPhoto: "",
    // friends: 0,
    //El plan de que sea numero es no traer toda esa data al cliente, que se solicite y ya.
    //Si un amigo lo elimina o viceversa, se disminuye el numero en el momento
    // posts: 0,
    user: "",    
    pass1: "",
    pass2: "",    
}

const SCREENS = 
{
    Inicio: "Inicio",
    Buscar: "Buscar",
    Camara: "Cámara",
    Notificaciones: "Notificaciones",
    Perfil: "Perfil",
    Registro: "Registro",
    Login: "Login",
    Cargando: "Cargando"
}

const POST = {
    user: "",
    photo: "",
    description: "",
    date: "",//Fecha completa, es decir + new Date()
    location:""
    // likes: 
    // [
    //     {usuario: ""}
    // ],
    // comments:
    // [
    //     {
    //         user: "",
    //         comment:""
    //     }
    // ]

}

const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
        return true;
    }
    return false;
}

async function GetBlob(photo) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', photo, true);
        xhr.send(null);
    });
    return blob;
}


export {SCREEN_WIDTH, ROUTES, FACEBOOK, CONFIG, DEFAULTPHOTO, SCREENS, user, CURRENTUSER, POST, DATAMODAL, verifyEmail, GetBlob }