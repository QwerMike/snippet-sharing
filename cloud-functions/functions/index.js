const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

function bodyToSnippet({ author, title, data, type }) {
    return { 
        author: author || '',
        title: title || '',
        data,
        type: type || 'text' };
}

exports.ping = functions.https.onRequest(async (req, res) => {
    res.send('Successfully pinged!\n\n');
});

exports.createSnippet = functions.https.onRequest((req, res) => {
    if (req.method != 'POST') {
        return res.status(405).header('Allow', 'POST').json({
            message: 'Send a POST request.'
        });
    }
    
    const snippet = bodyToSnippet(req.body);
    if (!snippet.data) {
        return res.status(400).json({
            message: 'Property "data" is required.'
        });
    }

    const privateUid = admin.database().ref('snippets').push(snippet).key;
    const publicUid = admin.database().ref('readonlyProxy').push({
        'snippet': privateUid
    }).key;

    res.json({ privateUid, publicUid });
});
