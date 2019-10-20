/* eslint-disable import/prefer-default-export */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// initialize the application
admin.initializeApp();

/**
 * The send message (test)
 */
exports.sendMessage = functions.firestore
    .document('products/{productId}')
    .onCreate((data, context) => {
        const docId = context.params.productId;
        const product = data.data();
        const productRef = admin.firestore().collection('products').doc(docId);
        return productRef.update({ message: `Nice ${product.name}!`});
    });