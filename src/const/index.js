const config = {
    apiKey: "AIzaSyAksBhAo90khYTZP8BQgL11lohW34WBdOE",
    authDomain: "socialnetwork-3b7a1.firebaseapp.com",
    databaseURL: "https://socialnetwork-3b7a1.firebaseio.com",    
    projectId: "socialnetwork-3b7a1",
    storageBucket: "socialnetwork-3b7a1.appspot.com",
    messagingSenderId: "643282533725"
  };

const currentUser= {
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    uid: null,//email
}

const user = {
    uid: "",
    usuario: "",
    clave: "", 
    clave2:"",
    fotoPrincipal:"",
    correo:"",
    seguidores:[],
    fotos: [],
    likes: [], //A quien mis fotos le gustan
    mensajes: 
    [
        {
            usuario: "",
            mensajes: 
            {
                yo: "",
                tu:""
            }
        }
    ]

}

export {config, user}