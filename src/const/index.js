const CONFIG = {
    apiKey: "AIzaSyAksBhAo90khYTZP8BQgL11lohW34WBdOE",
    authDomain: "socialnetwork-3b7a1.firebaseapp.com",
    databaseURL: "https://socialnetwork-3b7a1.firebaseio.com",
    projectId: "socialnetwork-3b7a1",
    storageBucket: "socialnetwork-3b7a1.appspot.com",
    messagingSenderId: "643282533725"
};

const CURRENTUSER = {
    correo: "",
    fotoPrincipal: "",
    usuario: ""
}

const user = {
    // uid: "",
    usuario: "",
    clave: "",
    clave2: "",
    fotoPrincipal: "",
    correo: "",
    seguidores: [],
    solicitudes: [],
    fotos: [],
    likes: [], //A quien mis fotos le gustan
    mensajes: []
    // mensajes:
    //     [
    //         {
    //             usuario: "",
    //             mensajes:
    //             {
    //                 yo: "",
    //                 tu: ""
    //             }
    //         }
    //     ]

}

const POST = {
    user:"",
    photo: "",
    description:"",
    date:"",//Fecha completa, es decir + new Date()
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

async function GetBlob(photo)  
{
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


export { CONFIG, user, CURRENTUSER, POST, verifyEmail, GetBlob }