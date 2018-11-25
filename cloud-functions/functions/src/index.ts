import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

function bodyToSnippet({ author, title, data, type }) {
    return { 
        author: author || '',
        title: title || '',
        data,
        type: type || 'text' };
}

export const ping = functions.https.onRequest((req, res) => {
    res.send('Successfully pinged!\n\n');
});

// POST method to create snippet
export const createSnippet = functions.https.onRequest((req, res) => {
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

    return res.json({ privateUid, publicUid });
});
