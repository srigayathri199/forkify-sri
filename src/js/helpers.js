//  for helper functions
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';


const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(() => {
            reject(new Error(`Request took too long! Timeout after ${s} second`))
        }, s * 1000);
    });
};


export const ajax = async function(url, uploaddata = undefined) {
    try {
        const fetchpro = uploaddata ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploaddata)
        }) : fetch(url);

        const res = await Promise.race([fetchpro, timeout(`${TIMEOUT_SEC}`)]);
        const data = await res.json();
        // console.log(res, data);
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        //throwing to below catch 
        throw err;
    }
}