import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const cors = require('cors')({ origin: true });

function bodyToSnippet({ author, title, data, type }) {
    return { 
        author: author || '',
        title: title || '',
        data,
        type: type || 'text'
    };
}

function getSnippetSnapshot(id) {
    return admin.database().ref(`snippets/${id}`).once('value');
}

export const ping = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        res.send('Successfully pinged!\n\n');
    });
});

// POST method to create snippet
export const createSnippet = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
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
        await admin.database().ref(`snippets/${privateUid}`).update({ publicUid });

        return res.json({ privateUid, publicUid });
    });
});

// DELETE method to delete snippet
export const deleteSnippet = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
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

        const snapshot = await getSnippetSnapshot(id);
        if (snapshot.exists()) {
            await Promise.all([
                admin.database().ref(snapshot.ref).remove(),
                admin.database().ref(`readonlyProxy/${snapshot.val().publicUid}`).remove()
            ]);
            return res.json({
                message: `Snippet ${id} is successfully deleted.`
            });
        } else {
            return res.status(404).json({
                message: `Snippet ${id} is not found.`
            });
        }
    });
});

// GET method to get snippet
export const getSnippet = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).header('Allow', 'GET').json({
                message: 'Send a GET request.'
            });
        }

        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                message: 'Search parameter "id" is required.'
            });
        }

        const snapshot = await getSnippetSnapshot(id);
        if (snapshot.exists()) {
            return res.json({
                snippet: snapshot.val(),
                readonly: false
            });
        } else {
            const proxySnapshot = await
                admin.database().ref(`readonlyProxy/${id}`).once('value');
            return proxySnapshot.exists()
                ? res.json({
                    snippet: await getSnippetSnapshot(proxySnapshot.val().snippet),
                    readonly: true
                })
                : res.status(404).json({
                    message: `Snippet ${id} is not found.`
                });
        }
    });
});

// PUT method to update snippet
export const updateSnippet = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'PUT') {
            return res.status(405).header('Allow', 'GET').json({
                message: 'Send a PUT request.'
            });
        }

        const id = req.query.id;
        if (!id) {
            return res.status(400).json({
                message: 'Search parameter "id" is required.'
            });
        }

        const data = bodyToSnippet(req.body);
        Object.keys(data).forEach(key => 
            (data[key] === undefined || data[key] === null) && delete data[key]);
        await admin.database().ref(`snippets/${id}`).update(data);
        
        return res.json({ message: "Successfully updated."});
    });
});
