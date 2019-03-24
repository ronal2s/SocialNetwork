const config = {
    apiKey: "AIzaSyAksBhAo90khYTZP8BQgL11lohW34WBdOE",
    authDomain: "socialnetwork-3b7a1.firebaseapp.com",
    databaseURL: "https://socialnetwork-3b7a1.firebaseio.com",    
    projectId: "socialnetwork-3b7a1",
    storageBucket: "socialnetwork-3b7a1.appspot.com",
    messagingSenderId: "643282533725"
  };

const CURRENTUSER = {
    correo: "",
    fotoPrincipal:"",
    usuario:""
}

const user = {
    // uid: "",
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

const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
        return true;
    }
    return false;
  }

export {config, user,CURRENTUSER, verifyEmail}