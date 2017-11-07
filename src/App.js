import React, { Component } from 'react';
import './App.css';
import { firebaseDb } from './firebase/index.js'
import firebase from 'firebase'
import Message from './components/Message.js'
import ChatBox from './components/ChatBox.js'

const messagesRef = firebaseDb.ref('messages')

class App extends Component {
  constructor(props) {
    super(props);
    this.onTextChange = this.onTextChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
    this.state = {
      text : "",
      user_name: "",
      profile_image: "",
      messages : []
    }
  }
  onGoogleLogin(e){
    const provider = new firebase.auth.GoogleAuthProvider()
    const auth = firebase.auth()
    const prevUser = auth.currentUser
    let credential = null
    // let user
    if (prevUser){
      auth.currentUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        credential = result.credential
        // user = result.user
        return auth.signInWithCredential(credential)
      }).then(function(user) {
        console.log("Sign In Success", user);
        // var currentUser = user;
        // Merge prevUser and currentUser data stored in Firebase.
        // Note: How you handle this is specific to your application

        // After data is migrated delete the duplicate user
      //   return user.delete().then(function() {
      //     // Link the OAuth Credential to original account
      //     return prevUser.link(credential);
      //   }).then(function() {
      //     // Sign in with the newly linked credential
      //     return auth.signInWithCredential(credential);
      //   });
      }).catch(function(error) {
        console.log('error!',error)
        // ...
      });
    }else{
      firebase.auth().signInWithPopup(provider);
    }
    // firebase.auth().signInWithPopup(provider).then(function(result) {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   // var token = result.credential.accessToken;
    //   // // The signed-in user info.
    //   // var user = result.user;
    //   // ...
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   // var errorCode = error.code;
    //   // var errorMessage = error.message;
    //   // // The email of the user's account used.
    //   // var email = error.email;
    //   // // The firebase.auth.AuthCredential type that was used.
    //   // var credential = error.credential;
    //   // ...
    // });
  }
  onTwitterLogin(e){
    // var prevUser = auth.currentUser;
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      // var token = result.credential.accessToken;
      // var secret = result.credential.secret;
      // // The signed-in user info.
      // var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // The email of the user's account used.
      // var email = error.email;
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // ...
    });
  }
  onTextChange(e) {
    if(e.target.name === 'user_name') {
      this.setState({
        "user_name": e.target.value,
      });
    } else if (e.target.name === 'profile_image') {
      this.setState({
        "profile_image": e.target.value,
      });
    } else if (e.target.name === 'text') {
      this.setState({
        "text": e.target.value,
      });
    }
  }
  onButtonClick() {
    // 簡単なバリデーション
    if(this.state.user_name === "") {
      alert('user_name empty')
      return
    } else if(this.state.text === "") {
      alert('text empty')
      return
    }
    messagesRef.push({
      "user_name" : this.state.user_name,
      "profile_image" : this.state.profile_image,
      "text" : this.state.text,
    })
  }
  componentWillMount() {
    messagesRef.on('child_added', (snapshot) => {
      const m = snapshot.val()
      let msgs = this.state.messages

      msgs.push({
        'text' : m.text,
        'user_name' : m.user_name,
        'profile_image' : m.profile_image,
      })

      this.setState({
        messages : msgs
      });
    })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Chat</h2>
          <button onClick={this.onGoogleLogin}>Google Login</button>
          <button onClick={this.onTwitterLogin}>Twitter Login</button>
        </div>
        <div className="MessageList">
          {this.state.messages.map((m, i) => {
            return <Message key={i} message={m} />
          })}
        </div>
        <ChatBox onTextChange={this.onTextChange} onButtonClick={this.onButtonClick} />
      </div>
    );
  }
}

export default App;