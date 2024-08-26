import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createUser, comparePassword, passwordhash } from '../lib/bcrypt.mjs'; // Correct import
import { generateToken } from '../lib/jwtAuth.mjs'
import { redis } from '../lib/redis.mjs';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/registration', async (req, res) => {
    const { key, data } = req.body;

    if (!key || !data) {
        return res.status(400).json({ error: 'Key and data are required' });
    }

    try {
        const user = await createUser(key, data);
        res.status(200).json({ message: 'Data saved successfully', user });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.post('/changePassword', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const keys = await redis.keys('*');
        let key = null;

        for (let i = 0; i < keys.length; i++) {
            const redisUser = JSON.parse(await redis.call('JSON.GET', keys[i]));
            if (email === redisUser.email) {
                key = keys[i];
                break;
            }
        }

        if (!key) {
            return res.status(404).json({ error: 'User not found' });
        }

        await redis.call('JSON.SET', key, '$.password', JSON.stringify(await passwordhash(password)));

        res.status(200).json("Password changed.");
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});


app.post('/registration', async (req, res) => {
    const { key, data } = req.body;

    if (!key || !data) {
        return res.status(400).json({ error: 'Key and data are required' });
    }

    try {
        const user = await createUser(key, data);
        res.status(200).json({ message: 'Data saved successfully', user });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.get('/checkRegistrationInfo', async (req, res) => {
    const user = req.query;

    let answer = {
        username: false,
        email: false
    };

    try {
        const keys = await redis.keys('*');
        
        for (const key of keys) {
            //check key in db
            if (user.key === key) {
                answer.username = true;
            }
            //check email in db
            const redisUser = JSON.parse(await redis.call('JSON.GET', key));
            if (user.email === redisUser.email) {
                answer.email = true;
            }

            if (answer.username && answer.email) {
                break;
            }
        }

        res.status(200).json(answer);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to GET username' });
    }
});

app.get('/checkEmail/:email', async (req, res) => {
    const email = req.params.email

    let answer = false

    try {
        const keys = await redis.keys('*');
        
        for (const key of keys) {
            //check email in db
            const redisUser = JSON.parse(await redis.call('JSON.GET', key));
            if (email === redisUser.email) {
                answer = true;
            }

            if (answer) {
                break;
            }
        }

        res.status(200).json(answer);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to GET username' });
    }
})

app.get('/checkUser', async (req, res) => {
    const user = req.query;

    const userPayload = {
        username: user.key,
        role: user.password
    };

    let answer = {
        username: false,
        password: false,
        jwtToken: null
    };

    try {
        const keys = await redis.keys('*');
        
        for (const key of keys) {
            //check key in db
            if (user.key === key) {
                answer.username = true;
            }
        }
        
        if(answer.username){
            const redisUser = await JSON.parse(await redis.call('JSON.GET', user.key))
            answer.password = await comparePassword(user.password, redisUser.password)
        }

        answer.jwtToken = generateToken(userPayload) 

        res.status(200).json(answer);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to GET username' });
    }
});


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

//check email in db
// const redisUser = JSON.parse(await redis.call('JSON.GET', key));
// if (await comparePassword(user.password, redisUser.password)) {
//     answer.password = true;
// }

// if (answer.username && answer.password) {
//     break;
// }

//Changed code 


// app.get('/usernameChecker/:username', async (req, res) => {
//     const key = req.params.username

//     try {
//         const user = await redis.exists(key);
//         res.status(200).json({ exists: user });
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).json({ error: 'Failed to GET username' });
//     }
// });

// app.get('/emailChecker/:username', async (req, res) => {
//     const key = req.params.username;

//     if (!key) {
//         return res.status(400).json({ error: 'Username is not provided' });
//     }

//     try {

//         const user = JSON.parse(await redis.call('JSON.GET', key))
        
//         res.status(200).json(user.email);
//     } catch (err) {
//         console.error('Error:', err);
//         res.status(500).json({ error: 'Failed to GET username' });
//     }
// });


//IDS

// app.post('/newId', async (req, res) => {
//     let { key, id } = req.body;

//     if (!key || !id) {
//         return res.status(400).json({ error: 'Key and ID are required' });
//     }
    
//     try {
//         const [part1, part2] = id.split(':'); 
//         const newId = part1 + ":" + (Number(part2) + 1);  

//         await redis.set(key, newId);  
//         res.status(200).json({ message: 'ID saved successfully'});
//     } catch (err) {
//         console.error('Error saving ID:', err);
//         res.status(500).json({ error: 'Failed to save ID' });
//     }
// });

// app.get('/ids', async (req, res) => {
    
//     try {
//         const id = await redis.get("id");
//         res.status(200).json({ message: id});
//     } catch (err) {
//         console.error('id', err);
//         res.status(500).json({ error: 'Failed to GET data' });
//     }
// });