import {IPowshieldChallenge, IPowshieldSolution} from './interfaces/powshield';
import {Algorithm} from './types/powshield';

export class Powshield {

    private encoder = new TextEncoder();

    public getChallenge(url: string): Promise<IPowshieldChallenge> {
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
    public verifySolution(url: string, solution:IPowshieldSolution): Promise<boolean> {
        const payload = {
            payload: btoa(JSON.stringify(solution)),
        }
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then((data: boolean) => {
                return data;
            });
    }

    public solveChallenge(challenge:IPowshieldChallenge):Promise<IPowshieldSolution|null> {
        const searchSecretNumber = async () => {
            for (let secretNumber = challenge.start; secretNumber <= challenge.max; secretNumber += 1) {
                const t = await this.hashHex(challenge.algorithm, challenge.salt + secretNumber + challenge.timestamp);
                if (t === challenge.challenge) {
                    return {...challenge, number: secretNumber};
                }
            }
            return null;
        }
        return searchSecretNumber();
    }


    private ab2hex(ab) {
        return [...new Uint8Array(ab)]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('');
    }

    private async hash(algorithm:Algorithm, data) {
        return crypto.subtle.digest(
            algorithm.toUpperCase(),
            typeof data === 'string' ? this.encoder.encode(data) : new Uint8Array(data)
        );
    }

    private async hashHex(algorithm:Algorithm, data) {
        return this.ab2hex(await this.hash(algorithm, data));
    }
}





