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
    if (req.method !== 'POST') {
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

// DELETE method to delete snippet
export const deleteSnippet = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'DELETE') {
        return res.status(405).header('Allow', 'DELETE').json({
            message: 'Send a DELETE request.'
        });
    }

    const id = req.query.id;
    if (!id) {
        return res.status(400).json({
            message: 'Search parameter "id" is required.'
        });
    }

    const snapshot = await admin.database().ref(`snippets/${id}`).once('value');
    const proxySnippet = await admin.database().ref('readonlyProxy').
        orderByChild('snippet').equalTo(id).once('value');
    if (snapshot.exists()) {
        const promises = [admin.database().ref(snapshot.ref).remove()];
        proxySnippet.forEach(child => {
            promises.push(child.ref.remove());
            return true;
        });
        await Promise.all(promises);
        return res.json({
            message: `Snippet ${id} is successfully deleted.`
        });
    } else {
        return res.status(404).json({
            message: `Snippet ${id} is not found.`
        });
    }
});