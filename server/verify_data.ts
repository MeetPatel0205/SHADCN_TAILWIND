import http from 'http';

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/dashboard',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', data.substring(0, 200) + '...'); // Print first 200 chars
        try {
            const json = JSON.parse(data);
            console.log(`Count: ${json.length}`);
        } catch (e) {
            console.log("Response is not JSON");
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
