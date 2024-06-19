class Powshield {
    constructor() {
        this.encoder = new TextEncoder();
    }
    getChallenge(url) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
            const bytes = atob(data);
            return JSON.parse(bytes);
        });
    }
    verifySolution(url, solution) {
        const payload = {
            payload: btoa(JSON.stringify(solution)),
        };
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then((data) => {
            return data;
        });
    }
    solveChallenge(challenge) {
        const searchSecretNumber = async () => {
            for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
                const t = await this.hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
                if (t === challenge.challenge) {
                    return Object.assign(Object.assign({}, challenge), { number: secretNumber });
                }
            }
            return null;
        };
        return searchSecretNumber();
    }
    ab2hex(ab) {
        return [...new Uint8Array(ab)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
    }
    async hash(algorithm, data) {
        return crypto.subtle.digest(algorithm.toUpperCase(), typeof data === 'string' ? this.encoder.encode(data) : new Uint8Array(data));
    }
    async hashHex(algorithm, data) {
        return this.ab2hex(await this.hash(algorithm, data));
    }
}

export { Powshield };
//# sourceMappingURL=index.es.js.map
