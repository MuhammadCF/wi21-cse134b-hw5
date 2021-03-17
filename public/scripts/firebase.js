// Your web app's Firebase configuration
    // export function signIn(){

    //     let credential;
    //     let token;
    //     let user;

    //     let provider = new firebase.auth.GoogleAuthProvider();
    //     firebase.auth()
    //     .signInWithPopup(provider)
    //     .then((result) => {
    //         /** @type {firebase.auth.OAuthCredential} */
    //         credential = result.credential;
    //         token = credential.accessToken;
    //         user = result.user;
    
    //     }).catch((error) => {
    
    //         let errorCode = error.code;
    //         let errorMessage = error.message;
    //         let email = error.email;
    //         let credential = error.credential;
    //     });
    
    //     return {credential, token, user};
    

    // }
    export function signIn(email,password){

        let credential;
        let token;
        let user;

        let newFire;
        //let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            //credential = result.credential;
            //token = credential.accessToken;
            user = result.user;

            newFire = {
                "user": user
            };
            console.log(user.user.id);

            newFire = JSON.stringify(newFire);
            //console.log(newFire);
            localStorage.setItem("fire", newFire);
            location.reload();
            //console.log("for testing:")
           // console.log(returnValue)
        
            
        

        
    
        }).catch((error) => {
    
            let errorCode = error.code;
            let errorMessage = error.message;
            let email = error.email;
            let credential = error.credential;

            if(alert(`Unregistered Credentials  ${errorCode}  ${errorMessage}  ${email}  ${credential}`)){

            }
            else{
                location.reload();
            }
        });

        


    }

    export function uploadArticles(title, body, date, userID){
        
        let db = firebase.firestore();
        
        db.collection("articles").add({
            "title": title,
            "body": body,
            "date": date,
            "user_id": userID.uid
        })
        .then((docRef) => {
            return docRef.id;
        })
        .catch((error) => {
            console.error("error adding article");
            return null;
        })
    }

    export function modifyArticles(id, title, body, date, userID){

        db.collection("articles").doc(id).update({
            "title": title,
            "date": date,
            "body": body,
            "user_id": userID
        })
        
    }

    export function removeArticles(id){
        db.collection("articles").doc(id).delete().then(() => {
            console.log("article " + id + " was removed");
        }).catch((error) => {
            console.error("removal error");
        })
    }

    export function retrieveArticles(){

        let db = firebase.firestore();

        let storage = {};
        db.collection("articles").get().then((querySnapshot) => {
            querySnapshot.forEach((article) => {
                let data = article.data;
                let id = article.id;
                let title = data.title;
                let body = data.body;
                let date = data.date;
                let user_id = data.user_id;

                storage[id] = {
                    "title": title,
                    "body": body,
                    "date": date,
                    "user_id": user_id
                }
            })
            
        })

        return storage;


        
    }
