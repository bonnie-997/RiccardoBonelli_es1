import express from 'express';
import fs from 'fs';
import { readFile } from 'fs/promises';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
const frasi = ['ciao, come stai?', 'Evviva la vita', 'sei uno sviluppatore anche tu?', 'sei forte! continua così'];
const km_in_miglia = 0.621371;
const file_path = 'testo.txt';


app.get('/', (req, res) => {
    res.json({ message: "server funzionante!" });
});

 //GENERA FRASI RANDOM
app.get('/frase', (req, res) => {
    const fraseCasuale = frasi[Math.floor(Math.random()*frasi.length)];
    return res.json({ frase: fraseCasuale });
});

//CONVERTI CHILOMETRI IN MIGLIA
app.get('/converti', (req, res) => {
    const km = parseFloat(req.query.k);

    if(isNaN(km)) {
        return res.status(500).json({error: 'Parametro K non valido. inserisci un numero'});
    };

    const miglia = km * km_in_miglia;
    res.json({ chilometri: km, miglia: miglia });
});

//SOMMA DI DATI
app.get('/somma', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if(isNaN(a) || isNaN(b)) {
        return res.status(500).json({ error: 'Parametro a o b non validi. Inserisci dei numeri'});
    };

    const somma = a+b;
    res.json({ 'La somma è': somma});
});

//GESTIONE FILE DI TESTO
app.post('/testo', (req, res) => {
    const { testo } = req.body;
    if(!testo) {
        return res.status(500).json({ errore: 'Il testo è obbligatorio' });
    };
    fs.writeFile(file_path, testo, (err) => {
        if(err) {
            return res.status(500).json({ errore: 'Errore nella scrittura del file' });
        };
        res.json({ messaggio: 'testo salvato con successo' });
    });
});

app.delete('/testo', (req, res) => {
    fs.writeFile(file_path, '', (err) => {
        if(err) {
            return res.status(500).json({ errore: 'errore nella cancellazione del file' });
        }
        res.json({messaggio: 'testo cancellato con successo'});
    })
});

app.get('/testo', (req, res) => {
    fs.readFile(file_path, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ errore: 'problema con la lettura del testo'});
        };

        const testo = data.trim();
        //parole e caratteri
        const parole = testo.match(/\b\w+\b/g) || [];
        const num_parole = parole.length;
        const num_caratteri = testo.length;

        //vocali e consonanti
        const vocali = testo.match(/[aeiouAEIOUàèéìòóù]/g) || [];
        const consonanti = testo.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || [];

        //parola più lunga e parola più corta
        const parola_piu_lunga = parole.reduce((a,b) => (b.lenght > a.length ? b : a), "");
        const parola_piu_corta = parole.reduce((a,b) => (b.lenght < a.lenght ? b : a), parole[0] || "");

        //frequenza parole
        const frequenza = {};
        let parola_piu_ripetuta = "";
        let num_parola_piu_ripetuta = 0;

        for (const parola of parole) {
            frequenza[parola] = (frequenza[parola] || 0) + 1;
            if(frequenza[parola] > num_parola_piu_ripetuta) {
                parola_piu_ripetuta = parola;
                num_parola_piu_ripetuta = frequenza[parola];
            };
        };

        return res.json({
            testo,
            num_parole,
            num_caratteri,
            vocali: vocali.lenght,
            consonanti: consonanti.lenght,
            parola_piu_lunga,
            parola_piu_corta,
            parola_piu_ripetuta,
            num_parola_piu_ripetuta
        });
            
    });
});

/* app.post('/testo', (req, res) => {
    
}); */

app.listen(PORT, () => {
    console.log('server in esecuzione sulla porta: ' + PORT);
})