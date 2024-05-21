import express from 'express';
import { fetchAidBoxToken, fetchStgFhirToken } from "./tokenFecher";
import {getAidBoxEntity, getDifferenceBetweenEntities, getFhirProxyEntity} from "./entityFetcher";
import dotenv from 'dotenv';
import {aidBoxBaseUrl, count, fhirProxyBaseUrl} from "./consts";
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

// app.get('/encounter', async (req, res) => {
//     try {
//         const data = await getDifferenceBetweenEntities("Encounter");
//         console.log(data);
//         res.send(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching encounters');
//     }
// });

app.get('/fhir-encounters', async (req, res) => {
    try {
        const fhirProxyUrl = `${fhirProxyBaseUrl}Encounter?_count=${count}`;
        const data = await getFhirProxyEntity(fhirProxyUrl, [], 1, 'Encounter', 'fhir');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching fhir encounters');
    }
});

app.get('/aidbox-encounters', async (req, res) => {
    try {
        const aidBoxUrl = `${aidBoxBaseUrl}Encounter?_count=${count}`;
        const data = await getAidBoxEntity(aidBoxUrl, [], 1, 'Encounter', 'aidbox');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching aidbox encounters');
    }
});

app.get('/fhir-appointment', async (req, res) => {
    try {
        const fhirProxyUrl = `${fhirProxyBaseUrl}Appointment?_count=${count}`;
        const data = await getFhirProxyEntity(fhirProxyUrl, [], 1, 'Appointment', 'fhir');
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching appointments');
    }
});

app.get('/aidbox-appointment', async (req, res) => {
    try {
        const aidBoxUrl = `${aidBoxBaseUrl}Appointment?_count=${count}`;
        const data = await getAidBoxEntity(aidBoxUrl, [], 1, 'Appointment', 'aidbox');
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching appointments');
    }
});

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

server.timeout = 1800000;

