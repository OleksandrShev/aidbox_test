import express from 'express';
import { fetchAidBoxToken, fetchStgFhirToken } from "./tokenFecher";
import {getDifferenceBetweenEntities} from "./entityFetcher";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const data = {};
    res.send(`Data: ${JSON.stringify(data)}`);
});

app.get('/fhir-token', async (req, res) => {
    try {
        const tokenResponse = await fetchStgFhirToken();
        res.send(`Token: ${JSON.stringify(tokenResponse)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fhir fetching token');
    }
});

app.get('/aidbox-token', async (req, res) => {
    try {
        const tokenResponse = await fetchAidBoxToken();
        res.send(`Token: ${JSON.stringify(tokenResponse)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error aidbox fetching token');
    }
});

app.get('/patients', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Patient"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching patients');
    }
});

app.get('/practitioner', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Practitioner"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching practitioners');
    }
});

app.get('/practitioner-role', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("PractitionerRole"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching practitioner roles');
    }
});

app.get('/location', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Location"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching locations');
    }
});

app.get('/encounter', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Encounter"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching encounters');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
