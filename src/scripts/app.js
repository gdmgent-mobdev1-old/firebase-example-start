import '../styles/main.css';
import * as firebase from 'firebase/app';
import firebaseConfig from './firebase-config';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

/**
 * Get elements
 */

// Authentication
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');

// Database
const txtContent = document.getElementById('txtContent');
const postsContainer = document.getElementById('posts');
const productsContainer = document.getElementById('products');
const authenticatedContent = document.getElementById('authenticatedContent');
const btnAddProduct = document.getElementById('btnAddProduct');

// Storage
const btnImageUpload = document.getElementById('btnImgUpload');
const imgUpload = document.getElementById('imgUpload');

/**
 * Authentication
 */

// function to start login
const login = () => {
  // choose the provider we want to use
  const provider = new firebase.auth.GoogleAuthProvider();

  // sign up with given provider
  firebase.auth().signInWithPopup(provider);
};

// function to start logout
const logout = () => firebase.auth().signOut();

// when the authentication state changed
const onAuthStateChanged = (firebaseUser) => {
  if (firebaseUser) {
    btnLogin.style.display = 'none';
    btnLogout.style.display = 'block';
    authenticatedContent.style.display = 'block';
  } else {
    btnLogin.style.display = 'block';
    btnLogout.style.display = 'none';
    authenticatedContent.style.display = 'none';
  }
};

/**
 * Database
 */

// update a post
const changePost = (e) => {
  const db = firebase.firestore();
  const myPost = db.collection('posts').doc('csMW8Wbtisq0B4HHtYNV');
  myPost.update({ content: e.target.value });
};

// get a single post
const getPost = () => {
  const db = firebase.firestore();
  const myPost = db.collection('posts').doc('csMW8Wbtisq0B4HHtYNV');

  /*
  // getting data
  myPost.get().then((doc) => {
    const posts = document.getElementById('posts');
    posts.innerHTML = doc.data().content;
  });
  */

  // snapshotting data
  myPost.onSnapshot((doc) => { postsContainer.innerHTML = doc.data().content; });
};

// add a product (example)
const addProduct = () => {
  const db = firebase.firestore();
  db.collection('products').doc().set({
    name: 'my new product',
    price: 0.4,
  });
};

// query products
const getProducts = () => {
  const db = firebase.firestore();
  const productsRef = db.collection('products');

  // define the query
  const query = productsRef
    .where('price', '>', 0)
    .orderBy('price', 'asc');
    // .limit(1);

  // get the products
  query.get().then((products) => {
    products.forEach((doc) => {
      const data = doc.data();
      const element = document.createElement('div');
      element.innerHTML = `${data.name} at €${data.price}`;
      productsContainer.appendChild(element);
    });
  });
};

/**
 * Storage
 */

const uploadFile = () => {
  // get the fileslist
  const filesList = btnImageUpload.files;

  // create a reference to the storage
  const storageRef = firebase.storage().ref();

  // create a reference to the image storage (as a child of the storage)
  const myImageStorage = storageRef.child('images');

  // create a reference to my image
  const myImage = myImageStorage.child('myImage');

  // get the first file
  const file = filesList.item(0);

  // add the first file to the image ref
  const task = myImage.put(file);

  // execute the task
  task.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((downloadURL) => imgUpload.setAttribute('src', downloadURL));
  });
};

/**
 * My app
 */

const initApp = () => {
  // init the firebase app
  firebase.initializeApp(firebaseConfig);

  /**
   * Authentication
   */

  btnLogin.addEventListener('click', login);
  btnLogout.addEventListener('click', logout);
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  /**
   * Database
   */

  txtContent.addEventListener('change', changePost);
  getPost();
  getProducts();
  btnAddProduct.addEventListener('click', addProduct);

  /**
   * Storage
   */

  btnImageUpload.addEventListener('change', uploadFile, false);
};

// start my app
initApp();
